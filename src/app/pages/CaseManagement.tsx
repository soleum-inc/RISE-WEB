import { useState } from 'react';
import { Link } from 'react-router';
import {
  WarningCircle as AlertCircle,
  Clock,
  CheckCircle as CheckCircle2,
  CaretRight,
} from '@phosphor-icons/react';
import { cases, type CaseStatus } from '../data/cases';
import { useVertical } from '../context/VerticalContext';
import { StatusBadge } from '../components/ui/status-badge';
import { NeedsAttentionQueue } from '../components/NeedsAttentionQueue';
import { cn } from '../components/ui/utils';

const INCOMING: CaseStatus[] = ['Requested', 'Matched'];

function statusTone(status: CaseStatus): 'neutral' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'Outcome Recorded':
      return 'success';
    case 'Delivered':
      return 'warning';
    default:
      return 'neutral';
  }
}

function isStalled(c: (typeof cases)[number]): boolean {
  return (
    (c.status === 'In Progress' || c.status === 'Accepted') && (c.daysInactive ?? 0) >= 4
  );
}

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

export default function CaseManagement() {
  const { theme } = useVertical();
  const [activeTab, setActiveTab] = useState<'incoming' | 'active'>('incoming');

  const incoming = cases.filter((c) => INCOMING.includes(c.status));
  const active = cases.filter((c) => !INCOMING.includes(c.status));
  const list = activeTab === 'incoming' ? incoming : active;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{theme.caseLabel}</h1>
        <p className="mt-1 text-muted-foreground">Intake &amp; matching — first contact to measured outcome</p>
      </div>

      <NeedsAttentionQueue className="mb-6" />

      <div className={cn(panel, 'overflow-hidden')}>
        {/* Tabs */}
        <div className="flex border-b border-border">
          {([
            { key: 'incoming', label: 'Incoming Requests', count: incoming.length, icon: AlertCircle },
            { key: 'active', label: 'Active Cases', count: active.length, icon: Clock },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 px-6 py-4 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-b-2 border-brand-500 text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="size-4" />
                {tab.label}
                <StatusBadge tone={tab.count > 0 ? (tab.key === 'incoming' ? 'danger' : 'neutral') : 'neutral'}>
                  {tab.count}
                </StatusBadge>
              </span>
            </button>
          ))}
        </div>

        {/* Card list */}
        <div className="space-y-4 p-6">
          {list.map((c) => (
            <Link
              key={c.id}
              to={`/cases/${c.id}`}
              className="block rounded-xl border border-border bg-card/60 p-4 backdrop-blur-md transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {c.urgency === 'acute' ? (
                    <AlertCircle className="size-5 text-destructive" weight="fill" />
                  ) : (
                    <Clock className="size-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {c.riser.name}
                        {c.patron ? <span className="text-muted-foreground"> → {c.patron.name}</span> : null}
                      </h3>
                      <StatusBadge tone={c.urgency === 'acute' ? 'danger' : 'neutral'}>
                        {c.urgency === 'acute' ? 'Acute' : 'Chronic'}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.category} · {c.reference}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-foreground/90">{c.need}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusBadge tone={statusTone(c.status)} dot>
                    {c.status}
                  </StatusBadge>
                  {isStalled(c) && <StatusBadge tone="warning">{c.daysInactive}d idle</StatusBadge>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Opened {c.createdAt}</span>
                <span className="flex items-center gap-1 text-foreground">
                  Open record <CaretRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}

          {list.length === 0 && (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto mb-3 size-12 text-success" weight="fill" />
              <p className="text-muted-foreground">
                {activeTab === 'incoming' ? 'All caught up! No incoming requests.' : 'No active cases.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
