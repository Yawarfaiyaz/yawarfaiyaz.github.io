import { useEffect, type RefObject } from 'react';

/** Three night-sky palettes, one per act. */
const PALETTES: [string, string][] = [
  ['#06070c', '#151a2a'],
  ['#120c14', '#33202a'],
  ['#08101a', '#213445'],
];

interface Building { x: number; w: number; h: number }

/**
 * Built-in animated rooftop-leap silhouette. Plays until real clips are added.
 * Draws to a canvas that is also used as a colour-sampling source for the cursor.
 */
export default function SilhouetteCanvas({
  canvasRef,
  actRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  actRef: RefObject<number>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let W = 0, H = 0;
    let buildings: Building[] = [];
    let raf = 0;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Deterministic skyline so the scene looks identical on every visit.
      buildings = [];
      let seed = 7;
      const rnd = () => ((seed = (seed * 9301 + 49297) % 233280), seed / 233280);
      for (let x = -20; x < W + 40; ) {
        const w = 40 + rnd() * 90;
        buildings.push({ x, w, h: H * (0.18 + rnd() * 0.38) });
        x += w + rnd() * 8;
      }
    };

    const draw = (now: number) => {
      const [top, bottom] = PALETTES[(actRef.current ?? 0) % PALETTES.length];
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, top);
      sky.addColorStop(1, bottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.2, Math.min(W, H) * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 227, 194, 0.85)';
      ctx.fill();

      const baseY = H * 0.82;
      ctx.fillStyle = '#05060a';
      for (const b of buildings) ctx.fillRect(b.x, baseY - b.h, b.w, H - (baseY - b.h));

      // One leap cycle every 7 seconds: off the left roof, over the skyline, onto the right roof.
      const p = ((now - t0) / 7000) % 1;
      const startX = W * 0.18, endX = W * 0.82;
      const roofL = baseY - H * 0.02, roofR = baseY - H * 0.12;
      const x = startX + (endX - startX) * p;
      const y = roofL + (roofR - roofL) * p - H * 0.32 * Math.sin(Math.PI * p);
      const swing = Math.sin(p * Math.PI * 2) * 0.35;
      drawFigure(ctx, x, y, swing, Math.min(W, H) * 0.035);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, actRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function drawFigure(ctx: CanvasRenderingContext2D, x: number, y: number, swing: number, s: number) {
  ctx.save();
  ctx.strokeStyle = '#020204';
  ctx.fillStyle = '#020204';
  ctx.lineWidth = s * 0.28;
  ctx.lineCap = 'round';
  const shX = x, shY = y - s * 1.9;
  ctx.beginPath();
  ctx.moveTo(shX, shY);
  ctx.lineTo(x, y);
  // arms
  ctx.moveTo(shX, shY);
  ctx.lineTo(shX + Math.cos(swing + 0.9) * s * 1.6, shY + Math.sin(swing + 0.9) * s * 1.6);
  ctx.moveTo(shX, shY);
  ctx.lineTo(shX + Math.cos(swing - 2.2) * s * 1.6, shY + Math.sin(swing - 2.2) * s * 1.6);
  // legs
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(swing + 2.3) * s * 1.7, y + Math.sin(swing + 2.3) * s * 1.7);
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(swing + 0.7) * s * 1.7, y + Math.sin(swing + 0.7) * s * 1.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(shX, shY - s * 0.75, s * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
