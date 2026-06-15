import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  verticals,
  defaultVerticalId,
  type VerticalId,
  type VerticalTheme,
} from '../config/verticals';

interface VerticalContextType {
  verticalId: VerticalId;
  setVertical: (id: VerticalId) => void;
  /** Resolved theme for the active vertical (vocabulary, org, user, taxonomy). */
  theme: VerticalTheme;
}

const STORAGE_KEY = 'rise.vertical';

function readStored(): VerticalId {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && v in verticals) return v as VerticalId;
  } catch {
    /* ignore (private mode / unavailable) */
  }
  return defaultVerticalId;
}

const VerticalContext = createContext<VerticalContextType>({
  verticalId: defaultVerticalId,
  setVertical: () => {},
  theme: verticals[defaultVerticalId],
});

export function VerticalProvider({ children }: { children: ReactNode }) {
  const [verticalId, setVerticalId] = useState<VerticalId>(readStored);

  // Persist so a switch sticks across reloads (Loom demo).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, verticalId);
    } catch {
      /* ignore */
    }
  }, [verticalId]);

  const value: VerticalContextType = {
    verticalId,
    setVertical: setVerticalId,
    theme: verticals[verticalId],
  };

  return <VerticalContext.Provider value={value}>{children}</VerticalContext.Provider>;
}

export function useVertical() {
  return useContext(VerticalContext);
}
