import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { WarningCircle, ArrowUpRight, CaretRight } from '@phosphor-icons/react';
import { cases } from '../data/cases';
import { StatusBadge } from './ui/status-badge';
import { cn } from './ui/utils';

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

/**
 * Honest acute-case queue — replaces the old reassuring "In Crisis / Manageable"
 * pill. Lists open acute cases with a real escalation path, not a vanity stat.
 */
export function NeedsAttentionQueue({ className }: { className?: string }) {
  const acute = cases.filter((c) => c.urgency === 'acute' && c.status !== 'Outcome Recorded');
  const [escalated, setEscalated] = useState<Set<string>>(new Set());

  function escalate(id: string, ref: string) {
    setEscalated((prev) => new Set(prev).add(id));
    toast.success('Escalated to on-call lead', {
      description: `${ref} flagged for immediate same-day response.`,
    });
  }

  return (
    <div className={cn(panel, 'overflow-hidden border-l-4 border-l-destructive', className)}>
      <div className="flex items-center gap-2 px-5 pt-5">
        <WarningCircle className="size-5 text-destructive" weight="fill" />
        <h2 className="font-semibold text-foreground">Needs Immediate Attention</h2>
        <StatusBadge tone="danger">{acute.length}</StatusBadge>
      </div>
      <p className="px-5 pt-1 text-xs text-muted-foreground">
        Acute cases requiring a same-day escalation path.
      </p>

      <div className="space-y-2 p-5">
        {acute.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No acute cases open right now.</p>
        )}
        {acute.map((c) => {
          const isEsc = escalated.has(c.id);
          return (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{c.riser.name}</p>
                  <StatusBadge tone="danger">Acute</StatusBadge>
                  <span className="text-xs text-muted-foreground">{c.reference}</span>
                  {isEsc && <StatusBadge tone="warning" dot>Escalated</StatusBadge>}
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{c.need}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => escalate(c.id, c.reference)}
                  disabled={isEsc}
                  className="inline-flex items-center gap-1 rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-white transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <ArrowUpRight className="size-3.5" weight="bold" />
                  {isEsc ? 'Escalated' : 'Escalate'}
                </button>
                <Link
                  to={`/cases/${c.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                >
                  Open <CaretRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
