import { useConfig } from '../context/ConfigContext';
import { useToast } from '../context/ToastContext';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Resume() {
  const { config } = useConfig();
  const { show } = useToast();

  const downloadPdf = () => {
    // Print stylesheet (see index.css @media print) renders only the resume block.
    const previous = document.title;
    document.title = `${config.name.replace(/\s+/g, '_')}_Resume`;
    window.print();
    setTimeout(() => (document.title = previous), 500);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      show('Email copied to clipboard');
    } catch {
      show(config.email);
    }
  };

  return (
    <section id="resume" className="section print-area">
      <div className="no-print">
        <SectionHeading eyebrow="Executive resume" title="Resume" />
      </div>

      <div className="mb-12 flex flex-wrap gap-4 no-print">
        <button type="button" onClick={downloadPdf} className="btn-gold" data-cursor="EXPLORE">
          Download PDF Resume
        </button>
        <button type="button" onClick={copyEmail} className="btn-ghost" data-cursor="EXPLORE">
          Copy contact email
        </button>
      </div>

      <Reveal className="mb-16 max-w-3xl">
        <h2 className="display text-4xl print:text-black md:text-5xl">{config.name}</h2>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-gold print:text-black">{config.tagline}</p>
        <p className="mt-6 text-base leading-relaxed text-champagne/85">{config.resumeSummary}</p>
        <p className="mt-4 font-mono text-xs text-ash">
          {config.email} · <a href={config.links.github}>GitHub</a> · <a href={config.links.linkedin}>LinkedIn</a> ·{' '}
          <a href={config.links.portfolio}>Portfolio</a>
        </p>
      </Reveal>

      <Reveal className="mb-16">
        <h3 className="eyebrow mb-8">Projects</h3>
        <ol className="relative space-y-10 border-l border-white/10 pl-8">
          {config.projects.map((p) => (
            <li key={p.id} className="relative">
              <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-gold" />
              <h4 className="font-display text-2xl text-champagne">{p.title}</h4>
              <p className="mt-1 font-mono text-xs text-ash">{p.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-champagne/80">
                {p.highlights.map((h) => (
                  <li key={h}>— {h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mb-16">
        <h3 className="eyebrow mb-8">Education</h3>
        <ol className="relative space-y-10 border-l border-white/10 pl-8">
          {config.education.map((e) => (
            <li key={e.title} className="relative">
              <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-gold" />
              <h4 className="font-display text-2xl text-champagne">{e.title}</h4>
              <p className="mt-1 text-sm text-champagne/80">{e.org}</p>
              <p className="mt-1 font-mono text-xs text-ash">
                {e.period}
                {e.detail ? ` · ${e.detail}` : ''}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <h3 className="eyebrow mb-6">Certifications</h3>
        <ul className="space-y-3 text-sm text-champagne/85">
          {config.certifications.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
