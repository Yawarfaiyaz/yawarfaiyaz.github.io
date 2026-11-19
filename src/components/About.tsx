import { useConfig } from '../context/ConfigContext';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function About() {
  const { config } = useConfig();
  return (
    <section id="about" className="section">
      <SectionHeading eyebrow="About" title="Qualities I bring" />
      <Reveal className="mb-16 max-w-3xl">
        <p className="font-display text-2xl leading-relaxed text-champagne/90 md:text-3xl">{config.bio}</p>
      </Reveal>

      {/* Bento grid of core qualities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {config.qualities.map((q, i) => (
          <Reveal key={q.title} delay={i * 0.08} className="h-full">
            <article className="glass group h-full rounded-3xl p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/60">
              <span className="font-mono text-xs text-gold">0{i + 1}</span>
              <h3 className="mt-10 font-display text-2xl text-champagne">{q.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{q.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
