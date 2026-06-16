/* ──────────────────────────────────────────────────────────────────────────
   CasesContext — the web admin's live case store, backed by shared Supabase.

   The web side previously read a static `cases` array directly across several
   pages. This provider fetches the same cases from Supabase, subscribes to
   realtime so changes made on the mobile companion (or by other staff) appear
   live, and exposes the staff mutations (confirm match / record outcome / send
   message). The audit log is derived from the live cases, exactly as before.
   ────────────────────────────────────────────────────────────────────────── */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Case, MatchDecision, CaseOutcomeResult, CaseMessage, AuditEntry } from '../data/cases';
import {
  fetchCases,
  confirmMatchWrite,
  recordOutcomeWrite,
  sendMessageWrite,
  buildAuditFromCases,
  subscribeToCases,
} from '../lib/cases-api';

interface CasesContextType {
  cases: Case[];
  loading: boolean;
  getCase: (id: string) => Case | undefined;
  confirmMatch: (id: string, decision: MatchDecision) => Promise<void>;
  recordOutcome: (id: string, outcome: { result: CaseOutcomeResult; note: string }) => Promise<void>;
  sendMessage: (id: string, msg: { side: CaseMessage['side']; author: string; text: string }) => Promise<void>;
  auditLog: AuditEntry[];
}

const CasesContext = createContext<CasesContextType | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refetch = useCallback(async () => {
    try {
      setCases(await fetchCases());
    } catch (err) {
      console.error('[cases] fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await fetchCases();
        if (active) setCases(rows);
      } catch (err) {
        console.error('[cases] initial load failed:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    const unsub = subscribeToCases(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => void refetch(), 150);
    });

    return () => {
      active = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      unsub();
    };
  }, [refetch]);

  const getCase = useCallback((id: string) => cases.find((c) => c.id === id), [cases]);

  const confirmMatch = useCallback(async (id: string, decision: MatchDecision) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Matched',
              patron: decision.patron,
              matchDecision: decision,
              timeline: [
                ...c.timeline,
                {
                  state: 'Matched',
                  date: today(),
                  note: `${decision.mode === 'ai-accepted' ? 'AI suggestion accepted' : 'Manual override'} · ${decision.patron.name} (${decision.score}%)`,
                },
              ],
            }
          : c,
      ),
    );
    try {
      await confirmMatchWrite(id, decision);
    } catch (err) {
      console.error('[cases] confirmMatch failed:', err);
    }
  }, []);

  const recordOutcome = useCallback(
    async (id: string, outcome: { result: CaseOutcomeResult; note: string }) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'Outcome Recorded',
                outcome: { result: outcome.result, note: outcome.note, recordedAt: today() },
                timeline: [
                  ...c.timeline.filter((t) => t.state !== 'Outcome Recorded'),
                  { state: 'Outcome Recorded', date: today(), note: `Outcome recorded as ${outcome.result}.` },
                ],
              }
            : c,
        ),
      );
      try {
        await recordOutcomeWrite(id, outcome);
      } catch (err) {
        console.error('[cases] recordOutcome failed:', err);
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (id: string, msg: { side: CaseMessage['side']; author: string; text: string }) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: `tmp-${Date.now()}`, side: msg.side, author: msg.author, text: msg.text, time: 'Just now' },
                ],
              }
            : c,
        ),
      );
      try {
        await sendMessageWrite(id, msg);
      } catch (err) {
        console.error('[cases] sendMessage failed:', err);
      }
    },
    [],
  );

  const auditLog = useMemo(() => buildAuditFromCases(cases), [cases]);

  return (
    <CasesContext.Provider
      value={{ cases, loading, getCase, confirmMatch, recordOutcome, sendMessage, auditLog }}
    >
      {children}
    </CasesContext.Provider>
  );
}

export function useCases() {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error('useCases must be used within CasesProvider');
  return ctx;
}
