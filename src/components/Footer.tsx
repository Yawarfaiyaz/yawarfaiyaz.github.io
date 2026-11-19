import { useConfig } from '../context/ConfigContext';

export default function Footer() {
  const { config } = useConfig();
  return (
    <footer className="border-t border-line no-print">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 font-mono text-xs text-ash md:flex-row md:px-10">
        <p>© {new Date().getFullYear()} {config.name}. Built with React, GSAP & Three.js.</p>
        <div className="flex gap-6">
          <a href={config.links.github} target="_blank" rel="noreferrer" data-cursor="EXPLORE" className="hover:text-gold">GitHub</a>
          <a href={config.links.linkedin} target="_blank" rel="noreferrer" data-cursor="EXPLORE" className="hover:text-gold">LinkedIn</a>
          <a href={`mailto:${config.email}`} data-cursor="EXPLORE" className="hover:text-gold">Email</a>
        </div>
      </div>
    </footer>
  );
}
