import { useConfig } from '../context/ConfigContext';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Learning() {
  const { config } = useConfig();
  return (
    <section id="learning" className="section">
      <SectionHeading eyebrow="Certifications & learning" title="Education & credentials" />

      <div className="grid gap-4 md:grid-cols-2">
        {config.education.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.08}>
            <article className="glass h-full rounded-3xl p-8">
              <span className="font-mono text-xs text-gold">Education</span>
              <h3 className="mt-6 font-display text-3xl text-champagne">{e.title}</h3>
              <p className="mt-3 text-sm text-champagne/80">{e.org}</p>
              <p className="mt-4 font-mono text-xs text-ash">
                {e.period}
                {e.detail ? ` · ${e.detail}` : ''}
              </p>
            </article>
          </Reveal>
        ))}
        {config.certifications.map((c, i) => (
          <Reveal key={c} delay={(config.education.length + i) * 0.08}>
            <article className="glass h-full rounded-3xl p-8">
              <span className="font-mono text-xs text-gold">Certification</span>
              <h3 className="mt-6 font-display text-3xl text-champagne">{c.split(' — ')[0]}</h3>
              {c.includes(' — ') && <p className="mt-3 text-sm text-champagne/80">{c.split(' — ')[1]}</p>}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
