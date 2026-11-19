import { useEffect, useRef, useState } from 'react';

/**
 * Magnetic cursor. Elements with data-cursor="VIEW | DRAG | EXPLORE" morph the ring
 * and pull it toward their centre. Disabled on touch / coarse pointers.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');

    let x = 0, y = 0;          // real pointer
    let tx = 0, ty = 0;        // ring target (pointer, or magnetic element centre)
    let rx = 0, ry = 0;        // ring current position
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!activeEl) { tx = x; ty = y; }
    };

    let activeEl: HTMLElement | null = null;
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

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference" aria-hidden="true">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-gold transition-[width,height,background-color] duration-300 ${
            label ? 'h-24 w-24 bg-gold' : 'h-10 w-10'
          }`}
        >
          {label && <span className="font-mono text-[10px] tracking-[0.2em] text-obsidian">{label}</span>}
        </div>
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden="true">
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-gold" />
      </div>
    </>
  );
}
