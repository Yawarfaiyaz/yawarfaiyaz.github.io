import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { portfolio, type PortfolioConfig } from '../data/portfolio.config';

interface ConfigContextValue {
  config: PortfolioConfig;
  setConfig: (next: PortfolioConfig) => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PortfolioConfig>(portfolio);
  const value = useMemo(() => ({ config, setConfig }), [config]);
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used inside <ConfigProvider>');
  return ctx;
}
