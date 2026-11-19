import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useConfig } from '../context/ConfigContext';
import { useUi } from '../context/UiContext';
import { sampleAccent } from '../lib/accent';
import type { MovieScene } from '../data/portfolio.config';
import SilhouetteCanvas from './SilhouetteCanvas';

const MAX_SECONDS = 13;

/** Playback window, clamped strictly to 0–13 s. */
function windowOf(scene: MovieScene): { start: number; end: number } {
  const start = Math.max(0, Math.min(scene.startTime, MAX_SECONDS));
  const end = Math.max(start, Math.min(scene.endTime, MAX_SECONDS));
  return { start, end };
}

export default function MovieBackground() {
  const { config } = useConfig();
  const { theme, fx } = useUi();
  const scenes = config.movieScenes;

  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => scenes.map(() => false));
  const [failed, setFailed] = useState<boolean[]>(() => scenes.map(() => false));

  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const actRef = useRef(0);
  const activeRef = useRef(0);
  const failedRef = useRef(failed);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  useEffect(() => {
    activeRef.current = active;
    actRef.current = active;
  }, [active]);
  useEffect(() => {
    failedRef.current = failed;
  }, [failed]);

  // Scene switching: entering a section's band selects the scene that owns it.
  useEffect(() => {
    const ctx = gsap.context(() => {
      scenes.forEach((scene, i) => {
        scene.sections.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const select = () => setActive(i);
          ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onEnter: select, onEnterBack: select });
        });
      });
    });
    return () => ctx.revert();
  }, [scenes]);

  // Play only the active scene, inside its window.
  useEffect(() => {
    scenes.forEach((scene, i) => {
      const v = videos.current[i];
      if (!v) return;
      if (i === active && fx) {
        const { start, end } = windowOf(scene);
        if (v.currentTime < start || v.currentTime >= end) v.currentTime = start;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, fx, scenes]);

  // Hold on the last frame at the window end. Checked every animation frame, so the
  // playhead never overshoots the clamp by more than a single frame.
  const holdAtEnd = (i: number) => {
    const v = videos.current[i];
    const scene = scenes[i];
    if (!v || !scene) return;
    const { end } = windowOf(scene);
    const tick = () => {
      if (v.paused) return;
      if (v.currentTime >= end) {
        v.currentTime = end;
        v.pause();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const onReady = (i: number) => {
    setLoaded((prev) => prev.map((x, j) => (j === i ? true : x)));
    if (i === activeRef.current && fx) {
      const v = videos.current[i];
      if (v) {
        v.currentTime = windowOf(scenes[i]).start;
        v.play().catch(() => {});
      }
    }
  };

  const onFail = (i: number) => {
    setFailed((prev) => prev.map((x, j) => (j === i ? true : x)));
  };

  // Video-reactive cursor colour: sample the active scene at ~11 fps.
  useEffect(() => {
    if (config.cursorColorMode !== 'live-video' || !fx) {
      document.documentElement.style.removeProperty('--cursor-accent');
      return;
    }
    const probe = document.createElement('canvas');
    probe.width = 32;
    probe.height = 32;
    const pctx = probe.getContext('2d', { willReadFrequently: true });
    if (!pctx) return;

    const id = window.setInterval(() => {
      const i = activeRef.current;
      const v = videos.current[i];
      let source: CanvasImageSource | null = null;
      if (v && v.readyState >= 2 && !v.paused && !failedRef.current[i]) source = v;
      else if (canvasRef.current) source = canvasRef.current;
      if (!source) return;
      try {
        const colour = sampleAccent(source, themeRef.current, pctx);
        if (colour) document.documentElement.style.setProperty('--cursor-accent', colour);
      } catch {
        /* cross-origin source is tainted: keep the last colour */
      }
    }, 85);

    return () => {
      window.clearInterval(id);
      document.documentElement.style.removeProperty('--cursor-accent');
    };
  }, [config.cursorColorMode, fx]);

  if (!fx) return null;

  return (
    <div aria-hidden="true" className="movie-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <SilhouetteCanvas canvasRef={canvasRef} actRef={actRef} />

      {scenes.map((scene, i) =>
        scene.src ? (
          <video
            key={scene.id}
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={scene.src}
            muted
            playsInline
            preload="auto"
            aria-label={scene.label}
            onCanPlay={() => onReady(i)}
            onError={() => onFail(i)}
            onPlay={() => holdAtEnd(i)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-in-out will-change-[transform,opacity]"
            style={{
              opacity: i === active && loaded[i] && !failed[i] ? 1 : 0,
              filter: 'contrast(1.12) saturate(1.2)',
              transform: 'translateZ(0)',
            }}
          />
        ) : null,
      )}

      {/* Readability: soft radial vignette plus a theme-aware wash */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, var(--c-vignette) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'var(--c-wash)' }} />
    </div>
  );
}
