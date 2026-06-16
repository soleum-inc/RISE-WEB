import { Link } from 'react-router';
import { WarningCircle, CaretRight } from '@phosphor-icons/react';
import { useCases } from '../context/CasesContext';
import { StatusBadge } from './ui/status-badge';
import { cn } from './ui/utils';

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

/**
 * Honest acute-case queue — replaces the old reassuring "In Crisis / Manageable"
 * pill. Lists open acute cases; the whole row opens the case for action.
 */
export function NeedsAttentionQueue({ className }: { className?: string }) {
  const { cases } = useCases();
  const acute = cases.filter((c) => c.urgency === 'acute' && c.status !== 'Outcome Recorded');

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
        {acute.map((c) => (
          <Link
            key={c.id}
            to={`/cases/${c.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{c.riser.name}</p>
                <StatusBadge tone="danger">Acute</StatusBadge>
                <span className="text-xs text-muted-foreground">{c.reference}</span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-sm text-foreground/70">{c.need}</p>
            </div>
            <CaretRight className="size-4 shrink-0 text-muted-foreground" weight="bold" />
          </Link>
        ))}
      </div>
    </div>
  );
}
