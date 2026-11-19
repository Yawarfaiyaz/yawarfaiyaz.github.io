import { useConfig } from '../context/ConfigContext';
import { useToast } from '../context/ToastContext';
import Reveal from './Reveal';

export default function Contact() {
  const { config } = useConfig();
  const { show } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      show('Email copied to clipboard');
    } catch {
      show(config.email);
    }
  };

  return (
    <section id="contact" className="section no-print">
      <Reveal className="glass rounded-[2.5rem] p-10 text-center md:p-20">
        <p className="eyebrow mb-6">Contact</p>
        <h2 className="display text-5xl md:text-7xl">Let’s build something reliable.</h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={copyEmail} className="btn-gold" data-cursor="EXPLORE">
            Copy email
          </button>
          <a href={`mailto:${config.email}`} className="btn-ghost" data-cursor="EXPLORE">
            {config.email}
          </a>
          <a href={config.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost" data-cursor="EXPLORE">
            LinkedIn ↗
          </a>
          <a href={config.links.github} target="_blank" rel="noreferrer" className="btn-ghost" data-cursor="EXPLORE">
            GitHub ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
