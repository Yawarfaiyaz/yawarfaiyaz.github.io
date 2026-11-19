import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import type { CaseStudy } from '../data/portfolio.config';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

/** Cover for a case study: real image if provided, otherwise a gold-on-obsidian gradient. */
function Cover({ project, className = '' }: { project: CaseStudy; className?: string }) {
  if (project.image) {
    return <img src={project.image} alt="" className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`relative h-full w-full bg-gradient-to-br from-obsidian-3 via-obsidian-2 to-gold/20 ${className}`}>
      <span className="absolute bottom-6 right-6 font-display text-7xl text-gold/20">
        {project.title.split(' ').slice(0, 2).map((w) => w[0]).join('')}
      </span>
    </div>
  );
}

function CaseStudyModal({ project, onClose }: { project: CaseStudy; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        layoutId={`project-${project.id}`}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="glass relative max-h-full w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-obsidian-2"
        transition={{ type: 'spring', stiffness: 180, damping: 26 }}
      >
        <div className="relative h-56 overflow-hidden rounded-t-[2rem] md:h-72">
          <Cover project={project} />
        </div>
        <div className="p-8 md:p-12">
          <p className="eyebrow mb-4">{project.subtitle}</p>
          <h3 className="display text-4xl md:text-5xl">{project.title}</h3>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-champagne/85">{project.summary}</p>

          {project.metrics && (
            <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border border-line p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-ash">{m.label}</dt>
                  <dd className="mt-2 font-display text-2xl text-gold">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h4 className="eyebrow mb-4 mt-12">Highlights</h4>
          <ul className="space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm leading-relaxed text-champagne/80">
                <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-champagne/70">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-gold" data-cursor="EXPLORE">
                View source ↗
              </a>
            )}
            <button type="button" onClick={onClose} className="btn-ghost" data-cursor="EXPLORE">
              Close (Esc)
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Projects() {
  const { config } = useConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = config.projects.find((p) => p.id === activeId) ?? null;

  return (
    <section id="projects" className="section">
      <SectionHeading eyebrow="Projects & case studies" title="Selected work" />

      <div className="grid gap-6 md:grid-cols-2">
        {config.projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
            <motion.button
              type="button"
              layoutId={`project-${project.id}`}
              onClick={() => setActiveId(project.id)}
              data-cursor="VIEW"
              className="glass group relative block w-full overflow-hidden rounded-[2rem] text-left"
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-72 md:h-96' : 'h-56'}`}>
                <div className="h-full w-full transition duration-700 group-hover:scale-105">
                  <Cover project={project} />
                </div>
              </div>
              <div className="p-8">
                <p className="eyebrow mb-3">{project.subtitle}</p>
                <h3 className="font-display text-3xl leading-tight text-champagne">{project.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ash">{project.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.slice(0, 5).map((t) => (
                    <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-champagne/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active && <CaseStudyModal key={active.id} project={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </section>
  );
}
