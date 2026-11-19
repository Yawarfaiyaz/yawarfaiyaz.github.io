import { useEffect, useRef, useState } from 'react';
import { useUi } from '../context/UiContext';

/**
 * Magnetic cursor. Elements with data-cursor="VIEW | DRAG | EXPLORE" morph the ring
 * and pull it toward their centre. Colour follows --cursor-accent (set per scene by
 * MovieBackground) and falls back to the theme gold. No blend modes, so faces never invert.
 * Disabled on touch and coarse pointers.
 */
export default function Cursor() {
  const { theme } = useUi();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');

    let x = 0, y = 0;   // real pointer
    let tx = 0, ty = 0; // ring target
    let rx = 0, ry = 0; // ring position
    let raf = 0;
    let activeEl: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!activeEl) {
        tx = x;
        ty = y;
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      activeEl = el;
      if (el) {
        const r = el.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        setLabel(el.dataset.cursor ?? null);
      } else {
        tx = x;
        ty = y;
        setLabel(null);
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  const accent = 'var(--cursor-accent, var(--c-cursor))';
  const transition = 'background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease, width 300ms ease, height 300ms ease';

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden="true">
        <div className="relative">
          {/* soft glow in the scene's colour */}
          <div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: accent, opacity: theme === 'day' ? 0.18 : 0.28, transition: 'background-color 300ms ease' }}
          />
          <div
            className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border"
            style={{
              width: label ? 96 : 40,
              height: label ? 96 : 40,
              borderColor: accent,
              backgroundColor: label ? accent : 'transparent',
              boxShadow: `0 0 24px ${accent}`,
              transition,
            }}
          >
            {label && <span className="font-mono text-[10px] tracking-[0.2em] text-on-gold">{label}</span>}
          </div>
        </div>
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden="true">
        <div
          className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accent, transition: 'background-color 300ms ease' }}
        />
      </div>
    </>
  );
}
