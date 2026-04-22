import { createContext, useContext, type ReactNode } from 'react';

export type AppTab = 'hari' | 'rencana' | 'belanja' | 'prep';

type Ctx = { goToTab: (tab: AppTab) => void };

const TabNavContext = createContext<Ctx | null>(null);

export function TabNavProvider({ children, goToTab }: { children: ReactNode; goToTab: (tab: AppTab) => void }) {
  return <TabNavContext.Provider value={{ goToTab }}>{children}</TabNavContext.Provider>;
}

export function useTabNav(): Ctx {
  const v = useContext(TabNavContext);
  if (!v) {
    throw new Error('useTabNav must be used inside TabNavProvider');
  }
  return v;
}
