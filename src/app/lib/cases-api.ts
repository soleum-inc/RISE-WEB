/* ──────────────────────────────────────────────────────────────────────────
   cases-api — the web admin's data-access layer over the shared backend.

   Maps Supabase `cases` rows (+ embedded timeline/activity/messages/documents)
   to the app's existing `Case` type, so pages keep using the same shape. The DB
   stores ONE canonical status; the web labels are 1:1 with canonical. Exposes
   async writes (match / outcome / message / status) that the CaseDetail handlers
   call, plus a realtime subscription and a client-side audit derivation that
   reuses the existing buildAuditForCase logic.
   ────────────────────────────────────────────────────────────────────────── */
import { supabase } from './supabase';
import {
  buildAuditForCase,
  type Case,
  type CaseParty,
  type CaseStatus,
  type CaseTimelineEntry,
  type CaseActivityEntry,
  type CaseDocument,
  type CaseMessage,
  type CaseConsent,
  type CaseOutcome,
  type CaseOutcomeResult,
  type MatchDecision,
  type AuditEntry,
} from '../data/cases';

/* ── canonical status ↔ web labels (1:1) ──────────────────────────────────── */
type Canonical =
  | 'requested' | 'matched' | 'accepted' | 'in_progress' | 'delivered' | 'outcome_recorded';

const CANON_TO_WEB: Record<Canonical, CaseStatus> = {
  requested: 'Requested',
  matched: 'Matched',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  outcome_recorded: 'Outcome Recorded',
};
const WEB_TO_CANON: Record<CaseStatus, Canonical> = {
  Requested: 'requested',
  Matched: 'matched',
  Accepted: 'accepted',
  'In Progress': 'in_progress',
  Delivered: 'delivered',
  'Outcome Recorded': 'outcome_recorded',
};
export const toWebStatus = (s: string): CaseStatus => CANON_TO_WEB[s as Canonical] ?? 'Requested';
export const toCanonicalFromWeb = (s: CaseStatus): Canonical => WEB_TO_CANON[s];

/* ── row shapes ────────────────────────────────────────────────────────────── */
interface TimelineRow { id: string; state: string; note: string | null; occurred_on: string; created_at: string }
interface ActivityRow { id: string; author: string; text: string; internal: boolean; display_time: string | null; created_at: string }
interface MessageRow { id: string; side: 'riser' | 'patron'; author: string; text: string; display_time: string | null; created_at: string }
interface DocumentRow { id: string; name: string; kind: string; size: string; uploaded_by: string; created_at: string }
interface CaseRow {
  id: string; reference: string; category: string; urgency: 'acute' | 'chronic'; status: string; summary: string;
  escalated: boolean;
  riser_name: string; riser_initials: string; riser_stage_key: CaseParty['stageKey'] | null; riser_detail: string | null;
  patron_name: string | null; patron_initials: string | null; patron_detail: string | null;
  match_decision: MatchDecision | null;
  share_name: boolean; share_contact: boolean; share_need_details: boolean; share_location: boolean; share_documents: boolean;
  outcome_result: CaseOutcomeResult | null; outcome_note: string | null; outcome_recorded_at: string | null;
  created_at: string; last_activity_at: string;
  case_timeline?: TimelineRow[]; case_activity?: ActivityRow[]; case_messages?: MessageRow[]; case_documents?: DocumentRow[];
}

const SELECT = '*, case_timeline(*), case_activity(*), case_messages(*), case_documents(*)';

function relativeTime(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function daysSince(iso: string): number {
  return Math.floor(Math.max(0, Date.now() - new Date(iso).getTime()) / 86400000);
}

/* ── row → Case ────────────────────────────────────────────────────────────── */
export function rowToCase(row: CaseRow): Case {
  const riser: CaseParty = {
    name: row.riser_name,
    initials: row.riser_initials,
    stageKey: row.riser_stage_key ?? undefined,
    detail: row.riser_detail ?? undefined,
  };
  const patron: CaseParty | undefined = row.patron_name
    ? { name: row.patron_name, initials: row.patron_initials ?? '', detail: row.patron_detail ?? undefined }
    : undefined;

  const timeline: CaseTimelineEntry[] = (row.case_timeline ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((t) => ({ state: toWebStatus(t.state), date: t.occurred_on, note: t.note ?? undefined }));

  const activity: CaseActivityEntry[] = (row.case_activity ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((a) => ({ id: a.id, author: a.author, text: a.text, time: a.display_time ?? relativeTime(a.created_at), internal: a.internal }));

  const messages: CaseMessage[] = (row.case_messages ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((m) => ({ id: m.id, side: m.side, author: m.author, text: m.text, time: m.display_time ?? relativeTime(m.created_at) }));

  const documents: CaseDocument[] = (row.case_documents ?? [])
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((d) => ({ id: d.id, name: d.name, kind: d.kind, size: d.size, uploadedBy: d.uploaded_by, date: d.created_at.slice(0, 10) }));

  const consent: CaseConsent = {
    shareName: row.share_name,
    shareContact: row.share_contact,
    shareNeedDetails: row.share_need_details,
    shareLocation: row.share_location,
    shareDocuments: row.share_documents,
  };

  const outcome: CaseOutcome | undefined = row.outcome_result
    ? { result: row.outcome_result, note: row.outcome_note ?? '', recordedAt: (row.outcome_recorded_at ?? row.created_at).slice(0, 10) }
    : undefined;

  return {
    id: row.id,
    reference: row.reference,
    category: row.category,
    urgency: row.urgency,
    need: row.summary,
    riser,
    patron,
    status: toWebStatus(row.status),
    createdAt: row.created_at.slice(0, 10),
    daysInactive: daysSince(row.last_activity_at),
    timeline,
    activity,
    documents,
    messages,
    consent,
    matchDecision: row.match_decision ?? undefined,
    escalated: row.escalated || undefined,
    outcome,
  };
}

/* ── reads ─────────────────────────────────────────────────────────────────── */
export async function fetchCases(): Promise<Case[]> {
  const { data, error } = await supabase
    .from('cases')
    .select(SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CaseRow[]).map(rowToCase);
}

export async function fetchCaseById(id: string): Promise<Case | null> {
  const { data, error } = await supabase.from('cases').select(SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? rowToCase(data as CaseRow) : null;
}

/* ── writes ────────────────────────────────────────────────────────────────── */
/** Confirm a match: set patron + decision, advance to Matched, log timeline + activity. */
export async function confirmMatchWrite(caseId: string, decision: MatchDecision): Promise<void> {
  const { error } = await supabase
    .from('cases')
    .update({
      status: 'matched',
      patron_name: decision.patron.name,
      patron_initials: decision.patron.initials,
      patron_detail: decision.patron.detail ?? null,
      match_decision: decision,
    })
    .eq('id', caseId);
  if (error) throw error;
  await supabase.from('case_timeline').insert({
    case_id: caseId,
    state: 'matched',
    occurred_on: new Date().toISOString().slice(0, 10),
    note: `Matched with ${decision.patron.name} (${decision.score}% fit).`,
  });
  await supabase.from('case_activity').insert({
    case_id: caseId,
    author: decision.confirmedBy,
    text: `Confirmed match with ${decision.patron.name} (${decision.mode === 'ai-accepted' ? 'AI-accepted' : 'manual override'}).`,
    internal: true,
  });
}

/** Record the staff outcome: advance to Outcome Recorded, store result/note, log timeline. */
export async function recordOutcomeWrite(
  caseId: string,
  outcome: { result: CaseOutcomeResult; note: string },
): Promise<void> {
  const { error } = await supabase
    .from('cases')
    .update({
      status: 'outcome_recorded',
      outcome_result: outcome.result,
      outcome_note: outcome.note,
      outcome_recorded_at: new Date().toISOString(),
    })
    .eq('id', caseId);
  if (error) throw error;
  await supabase.from('case_timeline').insert({
    case_id: caseId,
    state: 'outcome_recorded',
    occurred_on: new Date().toISOString().slice(0, 10),
    note: `Outcome recorded as ${outcome.result}.`,
  });
}

/** Generic status advance (web stepper), with a timeline entry. */
export async function advanceStatusWrite(caseId: string, status: CaseStatus, note?: string): Promise<void> {
  const { error } = await supabase.from('cases').update({ status: toCanonicalFromWeb(status) }).eq('id', caseId);
  if (error) throw error;
  await supabase.from('case_timeline').insert({
    case_id: caseId,
    state: toCanonicalFromWeb(status),
    occurred_on: new Date().toISOString().slice(0, 10),
    note: note ?? null,
  });
}

export async function sendMessageWrite(
  caseId: string,
  msg: { side: 'riser' | 'patron'; author: string; text: string },
): Promise<void> {
  const { error } = await supabase.from('case_messages').insert({
    case_id: caseId,
    side: msg.side,
    author: msg.author,
    text: msg.text,
  });
  if (error) throw error;
}

/* ── audit (derived client-side from live cases) ───────────────────────────── */
const extraOrgAudit: AuditEntry[] = [
  { id: 'org-1', timestamp: '2026-06-14 16:20', actor: 'Funder Portal', action: 'data_access', target: 'Quarterly outcomes export', details: 'Board review — read-only' },
  { id: 'org-2', timestamp: '2026-06-12 09:05', actor: 'Case Manager', action: 'data_access', target: 'Impact dashboard', details: 'Exported funder report (PDF)' },
];

export function buildAuditFromCases(cases: Case[]): AuditEntry[] {
  return [...cases.flatMap(buildAuditForCase), ...extraOrgAudit].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

/* ── realtime ──────────────────────────────────────────────────────────────── */
export interface CaseChange {
  table: 'cases' | 'case_timeline' | 'case_messages' | 'case_documents';
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  caseId?: string;
}

export function subscribeToCases(onChange: (c: CaseChange) => void): () => void {
  const channel = supabase
    .channel('rise-cases-web')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, (p) =>
      onChange({ table: 'cases', eventType: p.eventType as CaseChange['eventType'], caseId: (p.new as { id?: string })?.id ?? (p.old as { id?: string })?.id }),
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'case_timeline' }, (p) =>
      onChange({ table: 'case_timeline', eventType: p.eventType as CaseChange['eventType'], caseId: (p.new as { case_id?: string })?.case_id ?? (p.old as { case_id?: string })?.case_id }),
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'case_messages' }, (p) =>
      onChange({ table: 'case_messages', eventType: p.eventType as CaseChange['eventType'], caseId: (p.new as { case_id?: string })?.case_id ?? (p.old as { case_id?: string })?.case_id }),
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'case_documents' }, (p) =>
      onChange({ table: 'case_documents', eventType: p.eventType as CaseChange['eventType'], caseId: (p.new as { case_id?: string })?.case_id ?? (p.old as { case_id?: string })?.case_id }),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
