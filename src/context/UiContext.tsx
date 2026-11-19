import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'day';

interface UiContextValue {
  theme: Theme;
  toggleTheme: () => void;
  fx: boolean;
  toggleFx: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

function readInitial(): { theme: Theme; fx: boolean } {
  const root = document.documentElement;
  return { theme: root.dataset.theme === 'day' ? 'day' : 'dark', fx: root.dataset.fx !== 'off' };
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [{ theme, fx }, setState] = useState(readInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('yf-theme', theme);
    } catch {
      /* storage unavailable: keep in-memory state */
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.fx = fx ? 'on' : 'off';
    try {
      localStorage.setItem('yf-fx', fx ? 'on' : 'off');
    } catch {
      /* storage unavailable */
    }
  }, [fx]);

  const value = useMemo<UiContextValue>(
    () => ({
      theme,
      fx,
      toggleTheme: () => setState((s) => ({ ...s, theme: s.theme === 'dark' ? 'day' : 'dark' })),
      toggleFx: () => setState((s) => ({ ...s, fx: !s.fx })),
    }),
    [theme, fx],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>');
  return ctx;
}
