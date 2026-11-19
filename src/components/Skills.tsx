import { useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { gsap } from '../lib/gsap';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

function Meter({ name, level }: { name: string; level: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const value = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrap.current || !bar.current || !value.current) return;
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const trigger = { trigger: wrap.current, start: 'top 90%', once: true };
      gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: level / 100, duration: 1.6, ease: 'expo.out', scrollTrigger: trigger });
      gsap.to(counter, {
        v: level,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: trigger,
        onUpdate: () => {
          if (value.current) value.current.textContent = String(Math.round(counter.v));
        },
      });
    }, wrap.current!);
    return () => ctx.revert();
  }, [level]);

  return (
    <div ref={wrap}>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="text-champagne">{name}</span>
        <span className="font-mono text-xs text-gold">
          <span ref={value}>0</span>%
        </span>
      </div>
      <div className="h-px w-full bg-line">
        <div ref={bar} className="h-px origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const { config } = useConfig();

  return (
    <section id="skills" className="section">
      <SectionHeading eyebrow="Technical skills" title="The toolkit" />

      {/* Bento: skill groups */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {config.skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.06} className={group.items.length > 6 ? 'md:col-span-2 lg:col-span-2' : ''}>
            <div className="glass h-full rounded-3xl p-7">
              <h3 className="font-display text-2xl text-champagne">{group.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-champagne/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Proficiency meters */}
      <Reveal className="mt-16">
        <div className="glass rounded-3xl p-8 md:p-10">
          <p className="eyebrow mb-8">Proficiency</p>
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {config.skillMeters.map((m) => (
              <Meter key={m.name} name={m.name} level={m.level} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
