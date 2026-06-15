import { useState } from 'react';
import { Link } from 'react-router';
import {
  ShieldCheck,
  PaperPlaneTilt,
  LinkSimple,
  ArrowsClockwise,
  FileText,
  Eye,
  ChatCircleText,
  SealCheck,
} from '@phosphor-icons/react';
import { orgAuditLog, auditActionLabel, type AuditAction } from '../data/cases';
import { useVertical } from '../context/VerticalContext';
import { cn } from '../components/ui/utils';

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

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

const FILTERS: { key: AuditAction | 'all'; label: string }[] = [
  { key: 'all', label: 'All events' },
  { key: 'matched', label: 'Matches' },
  { key: 'status_changed', label: 'Status changes' },
  { key: 'reassigned', label: 'Reassignments' },
  { key: 'consent_changed', label: 'Consent' },
  { key: 'data_access', label: 'Data access' },
  { key: 'outcome_recorded', label: 'Outcomes' },
];

export default function TrustAudit() {
  const { theme } = useVertical();
  const [filter, setFilter] = useState<AuditAction | 'all'>('all');

  const entries = filter === 'all' ? orgAuditLog : orgAuditLog.filter((e) => e.action === filter);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <ShieldCheck className="size-6" weight="fill" />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trust &amp; Audit</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            The audited record that powers funder and board trust — every match, status change,
            reassignment, consent update and data-access event for {theme.org.name}, with timestamp and actor.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground backdrop-blur-md hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Audited timeline */}
      <div className={cn(panel, 'p-6')}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Provenance timeline</h2>
          <span className="text-xs text-muted-foreground">{entries.length} events</span>
        </div>

        <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-border">
          {entries.map((e) => {
            const Icon = auditIcon[e.action];
            return (
              <li key={e.id} className="relative flex gap-3">
                <span className="z-10 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-foreground">{e.actor}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {auditActionLabel[e.action]}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{e.timestamp}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-foreground/90">
                    {e.caseId ? (
                      <Link to={`/cases/${e.caseId}`} className="hover:underline">
                        {e.target}
                      </Link>
                    ) : (
                      e.target
                    )}
                  </p>
                  {e.details && <p className="text-xs text-muted-foreground">{e.details}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
