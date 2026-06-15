import { useState, Fragment } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  PaperPlaneTilt,
  LinkSimple,
  Handshake,
  Pulse,
  Package,
  SealCheck,
  FileText,
  ChatCircleText,
  ShieldCheck,
  Eye,
  DownloadSimple,
  CheckCircle,
  ProhibitInset,
  Sparkle,
  ClockCounterClockwise,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import {
  cases,
  caseStates,
  buildAuditForCase,
  auditActionLabel,
  type Case,
  type CaseStatus,
  type CaseOutcomeResult,
  type AuditAction,
  type MatchDecision,
} from '../data/cases';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { useVertical } from '../context/VerticalContext';
import { StatusBadge } from '../components/ui/status-badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { cn } from '../components/ui/utils';

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

const stateIcon: Record<CaseStatus, React.ComponentType<{ className?: string; weight?: 'regular' | 'fill' }>> = {
  Requested: PaperPlaneTilt,
  Matched: LinkSimple,
  Accepted: Handshake,
  'In Progress': Pulse,
  Delivered: Package,
  'Outcome Recorded': SealCheck,
};

const outcomeTone: Record<CaseOutcomeResult, 'success' | 'warning' | 'danger'> = {
  Achieved: 'success',
  'Partially Achieved': 'warning',
  'Not Achieved': 'danger',
};

/** Header status pill tone — progressing states read green/positive. */
const STATUS_TONE: Record<CaseStatus, 'neutral' | 'success' | 'warning'> = {
  Requested: 'neutral',
  Matched: 'success',
  Accepted: 'success',
  'In Progress': 'success',
  Delivered: 'success',
  'Outcome Recorded': 'success',
};

const outcomeOptions: CaseOutcomeResult[] = ['Achieved', 'Partially Achieved', 'Not Achieved'];

const auditIcon: Record<AuditAction, React.ComponentType<{ className?: string }>> = {
  created: PaperPlaneTilt,
  matched: LinkSimple,
  status_changed: ArrowsClockwise,
  reassigned: ArrowsClockwise,
  consent_changed: ShieldCheck,
  document_uploaded: FileText,
  data_access: Eye,
  message_sent: ChatCircleText,
  outcome_recorded: SealCheck,
};

/** Horizontal status timeline — completed states filled coral, current highlighted. */
function CaseTimeline({ status }: { status: CaseStatus }) {
  const currentIdx = caseStates.indexOf(status);
  return (
    <div className="flex items-start">
      {caseStates.map((state, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        const Icon = stateIcon[state];
        return (
          <Fragment key={state}>
            <div className="flex w-[88px] shrink-0 flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  'grid size-10 place-items-center rounded-full border-2 transition-colors',
                  done && 'border-brand-500 bg-brand-500 text-white',
                  current && 'border-brand-500 bg-brand-50 text-brand-700',
                  !done && !current && 'border-border bg-card text-muted-foreground',
                )}
              >
                <Icon className="size-5" weight={done || current ? 'fill' : 'regular'} />
              </div>
              <span
                className={cn(
                  'text-[11px] leading-tight',
                  current ? 'font-semibold text-foreground' : 'text-muted-foreground',
                )}
              >
                {state}
              </span>
            </div>
            {i < caseStates.length - 1 && (
              <div className={cn('mt-5 h-0.5 flex-1 rounded', done ? 'bg-brand-500' : 'bg-border')} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function Avatar({ initials, tone = 'neutral' }: { initials: string; tone?: 'neutral' | 'brand' }) {
  return (
    <span
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold',
        tone === 'brand' ? 'bg-brand-50 text-brand-700' : 'bg-secondary text-foreground',
      )}
    >
      {initials}
    </span>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const found = cases.find((c) => c.id === id);
  const { theme } = useVertical();

  const [record, setRecord] = useState<Case | undefined>(found);
  const [viewAs, setViewAs] = useState<'patron' | 'riser'>('patron');
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [outcomeResult, setOutcomeResult] = useState<CaseOutcomeResult | null>(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [draft, setDraft] = useState('');
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  if (!record) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Case not found</h2>
        <Link to="/members/case-management" className="mt-4 inline-block text-brand-700 hover:underline">
          Back to {theme.caseLabel}
        </Link>
      </div>
    );
  }

  const isRiserView = viewAs === 'riser';
  const stageLabel = record.riser.stageKey ? theme.stageNames[record.riser.stageKey] : undefined;
  const visibleActivity = isRiserView ? record.activity.filter((a) => !a.internal) : record.activity;
  const canSeeDocuments = !isRiserView || record.consent.shareDocuments;
  const auditEntries = buildAuditForCase(record);

  function recordOutcome() {
    if (!outcomeResult || !outcomeNote.trim()) return;
    setRecord((prev) =>
      prev && {
        ...prev,
        status: 'Outcome Recorded',
        outcome: { result: outcomeResult, note: outcomeNote.trim(), recordedAt: 'Just now' },
        timeline: [
          ...prev.timeline.filter((t) => t.state !== 'Outcome Recorded'),
          { state: 'Outcome Recorded', date: 'Today', note: `Outcome recorded as ${outcomeResult}.` },
        ],
      },
    );
    setOutcomeOpen(false);
  }

  function confirmMatch(decision: MatchDecision) {
    setRecord((prev) =>
      prev && {
        ...prev,
        status: 'Matched',
        patron: decision.patron,
        matchDecision: decision,
        timeline: [
          ...prev.timeline,
          {
            state: 'Matched',
            date: 'Today',
            note: `${decision.mode === 'ai-accepted' ? 'AI suggestion accepted' : 'Manual override'} · ${decision.patron.name} (${decision.score}%)`,
          },
        ],
      },
    );
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setRecord((prev) =>
      prev && {
        ...prev,
        messages: [
          ...prev.messages,
          { id: `m${prev.messages.length + 1}`, side: 'patron', author: record!.patron?.name ?? 'Patron', text, time: 'Just now' },
        ],
      },
    );
    setDraft('');
  }

  const consentRows: { key: keyof Case['consent']; label: string }[] = [
    { key: 'shareName', label: 'Name' },
    { key: 'shareContact', label: 'Contact details' },
    { key: 'shareNeedDetails', label: 'Full need details' },
    { key: 'shareLocation', label: 'Location' },
    { key: 'shareDocuments', label: 'Documents' },
  ];

  return (
    <div className="p-8">
      <Link
        to="/members/case-management"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>Back to {theme.caseLabel}</span>
      </Link>

      {/* Header */}
      <div className={cn(panel, 'relative mb-6 p-6')}>
        {/* Current status — pinned to the top-right corner so the case's state stays prominent. */}
        {record.outcome ? (
          <StatusBadge tone={outcomeTone[record.outcome.result]} dot className="absolute right-6 top-6 px-3 py-1 text-sm shadow-sm">
            {record.outcome.result}
          </StatusBadge>
        ) : (
          <StatusBadge tone={STATUS_TONE[record.status]} dot className="absolute right-6 top-6 px-3 py-1 text-sm shadow-sm">
            {record.status}
          </StatusBadge>
        )}

        <div className="pr-40">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{record.reference}</span>
            <StatusBadge tone={record.urgency === 'acute' ? 'danger' : 'neutral'}>
              {record.urgency === 'acute' ? 'Acute' : 'Chronic'}
            </StatusBadge>
            <StatusBadge tone="neutral">{record.category}</StatusBadge>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{record.need}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Avatar initials={record.riser.initials} />
            <div className="text-sm">
              <p className="font-semibold text-foreground">{record.riser.name}</p>
              <p className="text-muted-foreground">Riser{stageLabel ? ` · ${stageLabel}` : ''}</p>
            </div>
            <ArrowLeft className="size-4 rotate-180 text-muted-foreground" />
            {record.patron ? (
              <>
                <Avatar initials={record.patron.initials} tone="brand" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{record.patron.name}</p>
                  <p className="text-muted-foreground">Patron{record.patron.detail ? ` · ${record.patron.detail}` : ''}</p>
                </div>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Awaiting patron</span>
            )}
          </div>

          {/* View-as toggle — the record is conceptually viewable by both sides. */}
          <div className="mt-4 flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1 backdrop-blur-md">
            <Eye className="ml-2 size-4 text-muted-foreground" />
            {(['patron', 'riser'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewAs(v)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                  viewAs === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v} view
              </button>
            ))}
          </div>
        </div>

        {isRiserView && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            <Eye className="size-4" />
            Viewing as the Riser — internal notes are hidden and only consent-shared details appear.
          </p>
        )}

        {/* Status timeline */}
        <div className="mt-6 overflow-x-auto">
          <CaseTimeline status={record.status} />
        </div>
      </div>

      {/* Match decision — written when a match is confirmed */}
      {record.matchDecision && (
        <div className={cn(panel, 'mb-6 p-6')}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar initials={record.matchDecision.patron.initials} tone="brand" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">Match decision</h3>
                  <StatusBadge tone={record.matchDecision.mode === 'ai-accepted' ? 'success' : 'warning'} dot>
                    {record.matchDecision.mode === 'ai-accepted' ? 'AI suggestion accepted' : 'Manual override'}
                  </StatusBadge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Matched to <span className="font-medium text-foreground">{record.matchDecision.patron.name}</span>
                  {record.matchDecision.patron.detail ? ` · ${record.matchDecision.patron.detail}` : ''}
                </p>
                <ul className="mt-3 space-y-1">
                  {record.matchDecision.reasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/90">
                      <CheckCircle className="size-4 shrink-0 text-success" weight="fill" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Confirmed by {record.matchDecision.confirmedBy} · {record.matchDecision.timestamp}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{record.matchDecision.score}%</div>
              <div className="text-xs text-muted-foreground">match score</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Need + match */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-3 font-semibold text-foreground">The need</h3>
            <p className="text-sm text-foreground/90">{record.need}</p>

            {!record.patron && !isRiserView && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
                <div className="text-sm">
                  <p className="font-medium text-foreground">No patron matched yet</p>
                  <p className="text-muted-foreground">Run the matcher to find a {theme.giverLabel.replace(/s$/, '')}.</p>
                </div>
                <Button onClick={() => setMatchModalOpen(true)}>
                  <Sparkle className="size-4" weight="fill" />
                  Find a Patron
                </Button>
              </div>
            )}
          </div>

          {/* Message thread */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <ChatCircleText className="size-5 text-muted-foreground" />
              Messages
            </h3>
            <div className="space-y-3">
              {record.messages.length === 0 && (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )}
              {record.messages.map((m) => (
                <div key={m.id} className={cn('flex', m.side === 'patron' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm',
                      m.side === 'patron' ? 'bg-brand-50 text-foreground' : 'bg-secondary text-foreground',
                    )}
                  >
                    <p className="mb-0.5 text-xs font-semibold text-muted-foreground">
                      {m.author} · {m.side === 'patron' ? 'Patron' : 'Riser'}
                    </p>
                    <p>{m.text}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="min-h-10 flex-1 resize-none"
                rows={1}
              />
              <Button onClick={sendMessage} disabled={!draft.trim()}>
                Send
              </Button>
            </div>
          </div>

          {/* Documents */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <FileText className="size-5 text-muted-foreground" />
              Documents
            </h3>
            {!canSeeDocuments ? (
              <p className="text-sm text-muted-foreground">Documents were not shared under the consent settings.</p>
            ) : record.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents attached.</p>
            ) : (
              <ul className="space-y-2">
                {record.documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-card text-muted-foreground">
                      <FileText className="size-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.kind} · {d.size} · {d.uploadedBy} · {d.date}
                      </p>
                    </div>
                    <button className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Download">
                      <DownloadSimple className="size-[18px]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Audit Log — the audited provenance record */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
              <ClockCounterClockwise className="size-5 text-muted-foreground" />
              Audit Log
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              The audited record — timestamp · actor · action → target. Powers funder &amp; board trust.
            </p>
            <ol className="space-y-4">
              {auditEntries.map((e) => {
                const Icon = auditIcon[e.action];
                return (
                  <li key={e.id} className="flex gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{e.actor}</span> · {auditActionLabel[e.action]}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{e.target}</p>
                      {e.details && <p className="text-xs text-muted-foreground/80">{e.details}</p>}
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{e.timestamp}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Outcome / Record Outcome */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
              <SealCheck className="size-5 text-muted-foreground" />
              Outcome
            </h3>
            {record.outcome ? (
              <div className="space-y-2">
                <StatusBadge tone={outcomeTone[record.outcome.result]} dot>
                  {record.outcome.result}
                </StatusBadge>
                <p className="text-sm text-foreground/90">{record.outcome.note}</p>
                <p className="text-xs text-muted-foreground">Recorded {record.outcome.recordedAt}</p>
              </div>
            ) : isRiserView ? (
              <p className="text-sm text-muted-foreground">No outcome recorded yet.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Close this {theme.caseLabel.replace(/s$/, '').toLowerCase()} by recording a measured outcome.
                </p>
                <Button className="w-full" onClick={() => setOutcomeOpen(true)}>
                  Record Outcome
                </Button>
              </div>
            )}
          </div>

          {/* Consent panel */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="size-5 text-muted-foreground" />
              Consent
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              What {isRiserView ? 'you' : record.riser.name.split(' ')[0]} chose to share with the patron.
            </p>
            <ul className="space-y-2.5">
              {consentRows.map((row) => {
                const shared = record.consent[row.key];
                return (
                  <li key={row.key} className="flex items-center gap-2.5 text-sm">
                    {shared ? (
                      <CheckCircle className="size-[18px] text-success" weight="fill" />
                    ) : (
                      <ProhibitInset className="size-[18px] text-muted-foreground" />
                    )}
                    <span className={shared ? 'text-foreground' : 'text-muted-foreground line-through'}>{row.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{shared ? 'Shared' : 'Not shared'}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Activity / notes */}
          <div className={cn(panel, 'p-6')}>
            <h3 className="mb-4 font-semibold text-foreground">Case Notes</h3>
            <ol className="space-y-4">
              {visibleActivity.length === 0 && (
                <li className="text-sm text-muted-foreground">No notes yet.</li>
              )}
              {visibleActivity.map((a) => (
                <li key={a.id} className="relative pl-5">
                  <span className="absolute left-0 top-1.5 size-2 rounded-full bg-brand-500" />
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.author} · {a.time}
                    {a.internal && <span className="ml-1 text-brand-700">· internal</span>}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Record Outcome dialog */}
      <Dialog open={outcomeOpen} onOpenChange={setOutcomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Outcome</DialogTitle>
            <DialogDescription>
              Every {theme.caseLabel.replace(/s$/, '').toLowerCase()} closes with a measured result. Choose an outcome and add a short note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {outcomeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setOutcomeResult(opt)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors',
                  outcomeResult === opt ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-300',
                )}
              >
                <span className="font-medium text-foreground">{opt}</span>
                {outcomeResult === opt && <CheckCircle className="size-5 text-brand-600" weight="fill" />}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Result note</label>
            <Textarea
              value={outcomeNote}
              onChange={(e) => setOutcomeNote(e.target.value)}
              placeholder="Briefly describe the result…"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOutcomeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={recordOutcome} disabled={!outcomeResult || !outcomeNote.trim()}>
              Record Outcome
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI match modal — writes a structured match decision back to the case */}
      <MatchDetailModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        onConfirm={confirmMatch}
        riserName={record.riser.name}
        need={record.need}
        category={record.category}
        urgency={record.urgency}
      />
    </div>
  );
}
