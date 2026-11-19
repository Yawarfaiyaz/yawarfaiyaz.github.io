import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { useConfig } from '../context/ConfigContext';
import { useUi } from '../context/UiContext';
import ParticleField from './ParticleField';

export default function Hero({ ready }: { ready: boolean }) {
  const { config } = useConfig();
  const { fx } = useUi();
  const section = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  // Scroll-linked depth parallax (translation only, so the frame stays straight)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 260]);

  // Staggered kinetic reveal once the preloader has finished
  useEffect(() => {
    if (!ready || !nameRef.current || !subRef.current) return;
    const chars = nameRef.current.querySelectorAll('.char');
    const tl = gsap.timeline();
    tl.fromTo(chars, { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
      .fromTo(subRef.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, '-=0.7');
    return () => {
      tl.kill();
    };
  }, [ready]);

  return (
    <section id="home" ref={section} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[26rem] w-[26rem] rounded-full bg-gold-soft/10 blur-[110px]" />
      </motion.div>

      {fx && (
        <div className="absolute inset-0 opacity-80" aria-hidden="true">
          <ParticleField className="h-full w-full" />
        </div>
      )}

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-6 pb-24 pt-32 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <motion.div style={{ y: textY }} className="order-2 md:order-1">
          <p className="eyebrow mb-6">Portfolio · 2026</p>
          <h1 ref={nameRef} className="display text-[clamp(3.5rem,10vw,8.5rem)]" aria-label={config.name}>
            {config.name.split(' ').map((word, wi) => (
              <span key={wi} className="mr-[0.25em] inline-block overflow-hidden align-top">
                {word.split('').map((ch, ci) => (
                  <span key={ci} className="char inline-block origin-bottom-left">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div ref={subRef} className="mt-8 max-w-xl">
            <p className="font-display text-2xl italic text-gold-soft md:text-3xl">{config.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#projects" className="btn-gold" data-cursor="EXPLORE">
                View projects →
              </a>
              <a href="#resume" className="btn-ghost" data-cursor="EXPLORE">
                Resume
              </a>
            </div>
          </div>
        </motion.div>

        {/* Portrait: undistorted. Hover adds a 2% zoom and a crisp gold border only. */}
        <motion.div style={{ y: frameY }} className="order-1 flex justify-center md:order-2">
          <div className="glass relative aspect-[4/5] w-full max-w-sm rounded-[2rem] p-3">
            <div className="group relative h-full w-full overflow-hidden rounded-[1.5rem] border border-line transition-colors duration-500 hover:border-gold">
              <img
                src={config.photo.src}
                alt={config.photo.alt}
                loading="eager"
                data-cursor="VIEW"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <span className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-soft">Scroll ↓</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
