import { useState } from 'react';
import { portfolio } from '../data/portfolio.config';
import { useConfig } from '../context/ConfigContext';

/** Dev-only live preview for name / tagline / bio. Edits are in-memory; copy them into portfolio.config.ts to keep them. */
export default function DevCustomizer() {
  const { config, setConfig } = useConfig();
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print fixed bottom-6 right-6 z-[85] w-[min(20rem,calc(100vw-3rem))]">
      <button type="button" onClick={() => setOpen((o) => !o)} className="btn-ghost w-full justify-center !py-2 text-xs">
        {open ? 'Close customizer' : 'Customize (dev)'}
      </button>
      {open && (
        <div className="glass mt-3 space-y-4 rounded-2xl bg-obsidian-2 p-5 text-sm" data-lenis-prevent>
          {(['name', 'tagline', 'bio'] as const).map((field) => (
            <label key={field} className="block">
              <span className="eyebrow mb-2 block !text-[10px]">{field}</span>
              <textarea
                rows={field === 'bio' ? 4 : 1}
                value={config[field]}
                onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-obsidian p-2 text-champagne outline-none focus:border-gold"
              />
            </label>
          ))}
          <button type="button" onClick={() => setConfig(portfolio)} className="btn-ghost w-full justify-center !py-2 text-xs">
            Reset to config
          </button>
        </div>
      )}
    </div>
  );
}
