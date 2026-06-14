import { createContext, useContext, useState, ReactNode } from 'react';

export type FrameworkMode = 'standard' | 'assa';

interface FrameworkContextType {
  mode: FrameworkMode;
  setMode: (mode: FrameworkMode) => void;
  showASSA: boolean;
}

const FrameworkContext = createContext<FrameworkContextType>({
  mode: 'standard',
  setMode: () => {},
  showASSA: false,
});

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FrameworkMode>('standard');

  return (
    <FrameworkContext.Provider value={{ mode, setMode, showASSA: mode === 'assa' }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework() {
  return useContext(FrameworkContext);
}
