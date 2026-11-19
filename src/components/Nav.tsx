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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#home" className="font-display text-2xl text-gold" data-cursor="EXPLORE" aria-label={`${config.name} home`}>
          YF
        </a>
        <ul className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="block rounded-full px-4 py-2 text-sm text-champagne/80 transition hover:bg-white/5 hover:text-gold" data-cursor="EXPLORE">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="glass rounded-full px-3 py-1.5 text-xs text-champagne/90 transition hover:text-gold" aria-label="Toggle theme">{theme === 'dark' ? 'Day' : 'Dark'}</button>
          <button type="button" onClick={toggleFx} className="glass rounded-full px-3 py-1.5 text-xs text-champagne/90 transition hover:text-gold" aria-label="Toggle visual effects">FX {fx ? 'On' : 'Off'}</button>
          <a href="#contact" className="btn-ghost !px-4 !py-2 text-xs md:hidden">Contact</a>
        </div>
      </nav>
    </motion.header>
  );
}
