/**
 * Case records — the audited engagement between a RISER (person requesting help/
 * opportunity) and a PATRON (provider), tracked first-contact → measured outcome.
 *
 * Mock data for the prototype; no backend. The CaseDetail view seeds local state
 * from these and lets the operator advance the timeline / record an outcome.
 */

export type CaseStatus =
  | 'Requested'
  | 'Matched'
  | 'Accepted'
  | 'In Progress'
  | 'Delivered'
  | 'Outcome Recorded';

/** Canonical left→right order of the lifecycle (drives the status timeline). */
export const caseStates: CaseStatus[] = [
  'Requested',
  'Matched',
  'Accepted',
  'In Progress',
  'Delivered',
  'Outcome Recorded',
];

export type CaseOutcomeResult = 'Achieved' | 'Partially Achieved' | 'Not Achieved';

export interface CaseParty {
  name: string;
  initials: string;
  /** RISER: lifecycle stage key. */
  stageKey?: 'crisis' | 'stability' | 'growth';
  /** RISER: short descriptor · PATRON: skills / role. */
  detail?: string;
}

export interface CaseTimelineEntry {
  state: CaseStatus;
  date: string;
  note?: string;
}

export interface CaseActivityEntry {
  id: string;
  author: string;
  text: string;
  time: string;
  /** Internal admin notes are hidden when viewing the record as the RISER. */
  internal: boolean;
}

export interface CaseDocument {
  id: string;
  name: string;
  kind: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface CaseMessage {
  id: string;
  side: 'riser' | 'patron';
  author: string;
  text: string;
  time: string;
}

/** Exactly what the RISER chose to share with the PATRON. */
export interface CaseConsent {
  shareName: boolean;
  shareContact: boolean;
  shareNeedDetails: boolean;
  shareLocation: boolean;
  shareDocuments: boolean;
}

export interface CaseOutcome {
  result: CaseOutcomeResult;
  note: string;
  recordedAt: string;
}

/** Provenance / audit trail — the audited record that powers funder & board trust. */
export type AuditAction =
  | 'created'
  | 'matched'
  | 'status_changed'
  | 'reassigned'
  | 'consent_changed'
  | 'document_uploaded'
  | 'data_access'
  | 'message_sent'
  | 'outcome_recorded';

export const auditActionLabel: Record<AuditAction, string> = {
  created: 'Case created',
  matched: 'Match made',
  status_changed: 'Status changed',
  reassigned: 'Reassigned',
  consent_changed: 'Consent updated',
  document_uploaded: 'Document uploaded',
  data_access: 'Data accessed',
  message_sent: 'Message sent',
  outcome_recorded: 'Outcome recorded',
};

export interface AuditEntry {
  id: string;
  timestamp: string; // 'YYYY-MM-DD HH:mm'
  actor: string;
  action: AuditAction;
  target: string;
  caseId?: string;
  caseRef?: string;
  details?: string;
}

/** Recorded when a match is confirmed — who, the score, why, by whom, AI vs override. */
export interface MatchDecision {
  patron: CaseParty;
  score: number;
  reasons: string[];
  confirmedBy: string;
  mode: 'ai-accepted' | 'manual-override';
  timestamp: string;
}

export interface Case {
  id: string;
  reference: string;
  category: string;
  urgency: 'acute' | 'chronic';
  need: string;
  riser: CaseParty;
  patron?: CaseParty;
  status: CaseStatus;
  createdAt: string;
  /** Days since last activity — used to flag stalled cases. */
  daysInactive?: number;
  timeline: CaseTimelineEntry[];
  activity: CaseActivityEntry[];
  documents: CaseDocument[];
  messages: CaseMessage[];
  consent: CaseConsent;
  matchDecision?: MatchDecision;
  escalated?: boolean;
  outcome?: CaseOutcome;
}

export const cases: Case[] = [
  {
    id: 'c1',
    reference: 'RISE-1042',
    category: 'Housing',
    urgency: 'acute',
    need: 'Needs emergency housing — current situation is not safe. Requesting help finding a placement this week.',
    riser: { name: 'Brandon Taylor', initials: 'BT', stageKey: 'crisis', detail: 'New intake · flagged acute' },
    status: 'Requested',
    createdAt: '2026-06-13',
    daysInactive: 0,
    timeline: [{ state: 'Requested', date: '2026-06-13', note: 'Request submitted via intake form.' }],
    activity: [
      { id: 'a1', author: 'Intake Bot', text: 'Auto-triaged as acute (housing + safety keywords).', time: '2 hours ago', internal: true },
      { id: 'a2', author: 'Pastor Tim', text: 'Reviewed — prioritising for same-day match.', time: '1 hour ago', internal: true },
    ],
    documents: [
      { id: 'd1', name: 'Intake form.pdf', kind: 'PDF', size: '184 KB', uploadedBy: 'Brandon Taylor', date: '2026-06-13' },
    ],
    messages: [],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: false, shareDocuments: false },
  },
  {
    id: 'c2',
    reference: 'RISE-1039',
    category: 'Job Training',
    urgency: 'chronic',
    need: 'Looking for resume help and interview practice — has been applying without responses.',
    riser: { name: "Kevin O'Connor", initials: 'KO', stageKey: 'stability', detail: 'Career guidance' },
    patron: { name: 'Michelle Nguyen', initials: 'MN', detail: 'Career coach · 120 service hrs' },
    matchDecision: {
      patron: { name: 'Michelle Nguyen', initials: 'MN', detail: 'Career coach · 120 service hrs' },
      score: 92,
      reasons: [
        'Career-coaching specialty matches the need',
        '120 service hours — proven reliability',
        'High agency (PAS 8) — strong track record',
      ],
      confirmedBy: 'Pastor Tim',
      mode: 'ai-accepted',
      timestamp: '2026-06-11 10:45',
    },
    status: 'Matched',
    createdAt: '2026-06-10',
    daysInactive: 1,
    timeline: [
      { state: 'Requested', date: '2026-06-10', note: 'Request submitted.' },
      { state: 'Matched', date: '2026-06-11', note: 'AI-matched to Michelle Nguyen (92% fit).' },
    ],
    activity: [
      { id: 'a1', author: 'AI Match', text: 'Top match: Michelle Nguyen — career coaching, 92% compatibility.', time: '2 days ago', internal: true },
      { id: 'a2', author: 'Pastor Tim', text: 'Confirmed match, awaiting patron acceptance.', time: '1 day ago', internal: true },
    ],
    documents: [
      { id: 'd1', name: 'Current resume.docx', kind: 'DOCX', size: '42 KB', uploadedBy: "Kevin O'Connor", date: '2026-06-10' },
    ],
    messages: [
      { id: 'm1', side: 'patron', author: 'Michelle Nguyen', text: "Happy to help — I'll review your resume before we talk.", time: '1 day ago' },
    ],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: false, shareDocuments: true },
  },
  {
    id: 'c3',
    reference: 'RISE-1031',
    category: 'Youth Programs',
    urgency: 'chronic',
    need: 'Single parent needs after-school childcare two days a week to keep a new job.',
    riser: { name: 'Aisha Patel', initials: 'AP', stageKey: 'stability', detail: 'Childcare support' },
    patron: { name: 'Carmen Rodriguez', initials: 'CR', detail: 'Volunteer · childcare' },
    status: 'Accepted',
    createdAt: '2026-06-05',
    daysInactive: 2,
    timeline: [
      { state: 'Requested', date: '2026-06-05' },
      { state: 'Matched', date: '2026-06-06' },
      { state: 'Accepted', date: '2026-06-08', note: 'Both sides accepted the match.' },
    ],
    activity: [
      { id: 'a1', author: 'Pastor Tim', text: 'Background check on file confirmed before introduction.', time: '5 days ago', internal: true },
    ],
    documents: [],
    messages: [
      { id: 'm1', side: 'riser', author: 'Aisha Patel', text: 'Thank you so much — Tuesdays and Thursdays would be perfect.', time: '4 days ago' },
      { id: 'm2', side: 'patron', author: 'Carmen Rodriguez', text: 'That works for me. See you Tuesday!', time: '4 days ago' },
    ],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: true, shareDocuments: false },
  },
  {
    id: 'c4',
    reference: 'RISE-1024',
    category: 'Emergency Aid',
    urgency: 'chronic',
    need: 'Needs help moving apartments this month — heavy furniture, no vehicle.',
    riser: { name: 'Tyler Brooks', initials: 'TB', stageKey: 'growth', detail: 'Moving help' },
    patron: { name: 'Jerome Washington', initials: 'JW', detail: 'Volunteer · logistics' },
    status: 'In Progress',
    createdAt: '2026-05-28',
    daysInactive: 6,
    timeline: [
      { state: 'Requested', date: '2026-05-28' },
      { state: 'Matched', date: '2026-05-29' },
      { state: 'Accepted', date: '2026-05-30' },
      { state: 'In Progress', date: '2026-06-02', note: 'Move scheduled for the 15th.' },
    ],
    activity: [
      { id: 'a1', author: 'Pastor Tim', text: 'No activity in 6 days — flagged as stalled, sending a nudge.', time: '6 days ago', internal: true },
    ],
    documents: [
      { id: 'd1', name: 'Inventory list.pdf', kind: 'PDF', size: '96 KB', uploadedBy: 'Tyler Brooks', date: '2026-06-01' },
    ],
    messages: [
      { id: 'm1', side: 'patron', author: 'Jerome Washington', text: "I can bring a truck. What time on the 15th?", time: '6 days ago' },
    ],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: true, shareDocuments: true },
  },
  {
    id: 'c5',
    reference: 'RISE-1018',
    category: 'Mental Health',
    urgency: 'chronic',
    need: 'Wants a mentor for budgeting and financial-literacy coaching over a few sessions.',
    riser: { name: 'Rachel Kim', initials: 'RK', stageKey: 'stability', detail: 'Financial literacy' },
    patron: { name: 'Pastor Tim', initials: 'PT', detail: 'Mentor · finance' },
    status: 'Delivered',
    createdAt: '2026-05-20',
    daysInactive: 1,
    timeline: [
      { state: 'Requested', date: '2026-05-20' },
      { state: 'Matched', date: '2026-05-21' },
      { state: 'Accepted', date: '2026-05-22' },
      { state: 'In Progress', date: '2026-05-25', note: 'Four coaching sessions scheduled.' },
      { state: 'Delivered', date: '2026-06-12', note: 'All sessions completed — awaiting outcome.' },
    ],
    activity: [
      { id: 'a1', author: 'Pastor Tim', text: 'Completed final session. Recommend recording outcome as Achieved.', time: '1 day ago', internal: true },
    ],
    documents: [
      { id: 'd1', name: 'Budget worksheet.xlsx', kind: 'XLSX', size: '28 KB', uploadedBy: 'Pastor Tim', date: '2026-06-01' },
      { id: 'd2', name: 'Session notes.pdf', kind: 'PDF', size: '110 KB', uploadedBy: 'Pastor Tim', date: '2026-06-12' },
    ],
    messages: [
      { id: 'm1', side: 'riser', author: 'Rachel Kim', text: 'This changed how I think about money. Thank you!', time: '1 day ago' },
    ],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: false, shareDocuments: true },
  },
  {
    id: 'c6',
    reference: 'RISE-0997',
    category: 'Job Training',
    urgency: 'chronic',
    need: 'Needed help preparing for a CDL certification to qualify for warehouse driving roles.',
    riser: { name: 'Marcus Lee', initials: 'ML', stageKey: 'growth', detail: 'Job training' },
    patron: { name: 'Lisa Thompson', initials: 'LT', detail: 'Mentor · trades' },
    status: 'Outcome Recorded',
    createdAt: '2026-04-30',
    timeline: [
      { state: 'Requested', date: '2026-04-30' },
      { state: 'Matched', date: '2026-05-01' },
      { state: 'Accepted', date: '2026-05-02' },
      { state: 'In Progress', date: '2026-05-06' },
      { state: 'Delivered', date: '2026-05-28' },
      { state: 'Outcome Recorded', date: '2026-05-30', note: 'Outcome recorded as Achieved.' },
    ],
    activity: [
      { id: 'a1', author: 'Lisa Thompson', text: 'Marcus passed the CDL exam and starts work Monday.', time: '2 weeks ago', internal: false },
    ],
    documents: [
      { id: 'd1', name: 'CDL certificate.pdf', kind: 'PDF', size: '220 KB', uploadedBy: 'Marcus Lee', date: '2026-05-29' },
    ],
    messages: [
      { id: 'm1', side: 'riser', author: 'Marcus Lee', text: 'Passed! I start Monday. Could not have done it without you.', time: '2 weeks ago' },
      { id: 'm2', side: 'patron', author: 'Lisa Thompson', text: 'So proud of you. Go get it.', time: '2 weeks ago' },
    ],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: false, shareDocuments: true },
    outcome: { result: 'Achieved', note: 'Earned CDL certification and secured a warehouse driving role.', recordedAt: '2026-05-30' },
  },
  {
    id: 'c7',
    reference: 'RISE-0985',
    category: 'Food Assistance',
    urgency: 'acute',
    need: 'Requested a short-term grocery stipend after a sudden loss of income.',
    riser: { name: 'Samantha Lee', initials: 'SL', stageKey: 'crisis', detail: 'Emergency aid' },
    patron: { name: 'Robert Jackson', initials: 'RJ', detail: 'Donor · emergency fund' },
    status: 'Outcome Recorded',
    createdAt: '2026-05-02',
    timeline: [
      { state: 'Requested', date: '2026-05-02' },
      { state: 'Matched', date: '2026-05-02' },
      { state: 'Accepted', date: '2026-05-03' },
      { state: 'In Progress', date: '2026-05-04' },
      { state: 'Delivered', date: '2026-05-18' },
      { state: 'Outcome Recorded', date: '2026-05-20', note: 'Outcome recorded as Partially Achieved.' },
    ],
    activity: [
      { id: 'a1', author: 'Pastor Tim', text: 'Stipend delivered for 3 weeks; income not yet fully stabilised.', time: '3 weeks ago', internal: true },
    ],
    documents: [],
    messages: [
      { id: 'm1', side: 'riser', author: 'Samantha Lee', text: 'The grocery help got us through the worst of it. Thank you.', time: '3 weeks ago' },
    ],
    consent: { shareName: true, shareContact: false, shareNeedDetails: true, shareLocation: false, shareDocuments: false },
    outcome: { result: 'Partially Achieved', note: 'Immediate food need met; longer-term income support still in progress.', recordedAt: '2026-05-20' },
  },
  {
    id: 'c8',
    reference: 'RISE-1051',
    category: 'Emergency Aid',
    urgency: 'acute',
    need: 'Utility shut-off notice — power will be cut in 48 hours with a newborn in the home.',
    riser: { name: 'Denise Hooper', initials: 'DH', stageKey: 'crisis', detail: 'New intake · flagged acute' },
    status: 'Requested',
    createdAt: '2026-06-14',
    daysInactive: 0,
    timeline: [{ state: 'Requested', date: '2026-06-14', note: 'Request submitted via intake form.' }],
    activity: [
      { id: 'a1', author: 'Intake Bot', text: 'Auto-triaged as acute (utility shut-off + dependent keywords).', time: '40 minutes ago', internal: true },
    ],
    documents: [
      { id: 'd1', name: 'Shut-off notice.pdf', kind: 'PDF', size: '96 KB', uploadedBy: 'Denise Hooper', date: '2026-06-14' },
    ],
    messages: [],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: true, shareDocuments: true },
  },
  {
    id: 'c9',
    reference: 'RISE-1050',
    category: 'Mental Health',
    urgency: 'acute',
    need: 'In acute distress and asking for someone to talk to today — not safe to wait for a weekly slot.',
    riser: { name: 'Omar Haddad', initials: 'OH', stageKey: 'crisis', detail: 'New intake · flagged acute' },
    status: 'Requested',
    createdAt: '2026-06-14',
    daysInactive: 0,
    timeline: [{ state: 'Requested', date: '2026-06-14', note: 'Request submitted via crisis line.' }],
    activity: [
      { id: 'a1', author: 'Intake Bot', text: 'Auto-triaged as acute (crisis + same-day keywords).', time: '20 minutes ago', internal: true },
      { id: 'a2', author: 'Case Manager', text: 'Holding for immediate same-day match.', time: '10 minutes ago', internal: true },
    ],
    documents: [],
    messages: [],
    consent: { shareName: true, shareContact: true, shareNeedDetails: true, shareLocation: false, shareDocuments: false },
  },
];

/** Deterministic 'HH:mm' from an index so audit rows order within a day. */
function tstamp(date: string, i: number): string {
  const mins = 8 * 60 + 5 + i * 43; // start 08:05, step 43min
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${date} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Derive a structured audit trail from a case's own lifecycle data so the log
 * always matches the record (and reflects in-session outcome changes).
 */
export function buildAuditForCase(c: Case): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const ref = c.reference;
  const push = (
    date: string,
    idx: number,
    actor: string,
    action: AuditAction,
    target: string,
    details?: string,
  ) =>
    entries.push({
      id: `${c.id}-au${entries.length + 1}`,
      timestamp: tstamp(date, idx),
      actor,
      action,
      target,
      caseId: c.id,
      caseRef: ref,
      details,
    });

  c.timeline.forEach((t, i) => {
    if (t.state === 'Requested') push(t.date, i, 'Intake Bot', 'created', `${ref} · ${c.riser.name}`, c.need);
    else if (t.state === 'Matched')
      push(t.date, i, 'AI Matcher', 'matched', `${ref} · ${c.riser.name} ↔ ${c.patron?.name ?? 'patron'}`, t.note);
    else if (t.state === 'Outcome Recorded')
      push(t.date, i, 'Case Manager', 'outcome_recorded', `${ref}${c.outcome ? ` · ${c.outcome.result}` : ''}`, c.outcome?.note ?? t.note);
    else push(t.date, i, 'Case Manager', 'status_changed', `${ref} → ${t.state}`, t.note);
  });

  const sharedCount = Object.values(c.consent).filter(Boolean).length;
  push(c.createdAt, 1, c.riser.name, 'consent_changed', `${ref} · consent set`, `Sharing ${sharedCount} of 5 fields`);

  c.documents.forEach((d, i) => push(d.date, i + 2, d.uploadedBy, 'document_uploaded', `${ref} · ${d.name}`));

  if ((c.daysInactive ?? 0) >= 6 && c.patron) {
    const lastDate = c.timeline[c.timeline.length - 1].date;
    push(lastDate, 6, 'Case Manager', 'reassigned', `${ref} · ${c.patron.name}`, 'Flagged inactive — reassignment reviewed');
  }

  if (c.status === 'Outcome Recorded') {
    push(c.outcome?.recordedAt ?? c.createdAt, 7, 'Funder Portal', 'data_access', `${ref} · outcome record`, 'Read-only review by funder');
  }

  return entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

/** A couple of org-level events not tied to a single case. */
const extraOrgAudit: AuditEntry[] = [
  { id: 'org-1', timestamp: '2026-06-14 16:20', actor: 'Funder Portal', action: 'data_access', target: 'Quarterly outcomes export', details: 'Board review — read-only' },
  { id: 'org-2', timestamp: '2026-06-12 09:05', actor: 'Case Manager', action: 'data_access', target: 'Impact dashboard', details: 'Exported funder report (PDF)' },
];

/** Org-wide audited record — every case event, newest first. */
export const orgAuditLog: AuditEntry[] = [
  ...cases.flatMap(buildAuditForCase),
  ...extraOrgAudit,
].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
