import { motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { useUi } from '../context/UiContext';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#learning', label: 'Learning' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
];

const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-full text-ash transition hover:bg-hover hover:text-gold';

export default function Nav() {
  const { config } = useConfig();
  const { theme, toggleTheme, fx, toggleFx } = useUi();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 no-print"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-5 md:px-10">
        <a href="#home" className="font-display text-2xl text-gold" data-cursor="EXPLORE" aria-label={`${config.name} home`}>
          YF
        </a>

        <ul className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="block rounded-full px-4 py-2 text-sm text-champagne/80 transition hover:bg-hover hover:text-gold" data-cursor="EXPLORE">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="glass flex items-center gap-1 rounded-full px-1.5 py-1">
          <button
            type="button"
            onClick={toggleFx}
            aria-pressed={fx}
            aria-label={fx ? 'Turn effects off' : 'Turn effects on'}
            className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-champagne/80 transition hover:text-gold"
            data-cursor="EXPLORE"
          >
            FX: {fx ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Day Mode' : 'Dark Mode'}
            className={iconBtn}
            data-cursor="EXPLORE"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
          <a href="#contact" className="btn-ghost !px-4 !py-1.5 text-xs" data-cursor="EXPLORE">
            Contact
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
