import { useEffect, useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { useConfig } from '../context/ConfigContext';
import ParticleField from './ParticleField';
import LiquidImage from './LiquidImage';

export default function Hero({ ready }: { ready: boolean }) {
  const { config } = useConfig();
  const section = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  // Multi-layer scroll parallax
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 260]);

  // 3D mouse-tilt physics on the portrait frame
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 });

  const onTiltMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onTiltLeave = () => {
    mx.set(0);
    my.set(0);
  };

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
      {/* Atmospheric lighting */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[26rem] w-[26rem] rounded-full bg-gold-soft/10 blur-[110px]" />
      </motion.div>

      {/* WebGL ambient particles + centrepiece */}
      <div className="absolute inset-0 -z-0 opacity-80" aria-hidden="true">
        <ParticleField className="h-full w-full" />
      </div>

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

        {/* Portrait with 3D tilt + scroll-linked depth */}
        <motion.div style={{ y: frameY, perspective: 900 }} className="order-1 flex justify-center md:order-2">
          <motion.div
            onMouseMove={onTiltMove}
            onMouseLeave={onTiltLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="glass relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] p-3"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
              <LiquidImage src={config.photo.src} alt={config.photo.alt} />
            </div>
            <span className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-soft">
              Scroll ↓
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
