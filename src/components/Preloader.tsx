import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Cinema-style countdown followed by a curtain wipe. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const curtain = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const state = { value: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(state, {
      value: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(state.value)).padStart(3, '0');
      },
    }).to(curtain.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '+=0.1');
    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div ref={curtain} className="fixed inset-0 z-[70] flex items-end justify-between bg-obsidian p-8 md:p-14" aria-hidden="true">
      <span className="eyebrow">Loading</span>
      <span ref={counter} className="display text-7xl text-gold md:text-9xl">000</span>
    </div>
  );
}
