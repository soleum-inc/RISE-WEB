import { useEffect } from 'react';
import { Link } from 'react-router';
import { Printer, ArrowLeft, ShieldCheck } from '@phosphor-icons/react';
import { useVertical } from '../context/VerticalContext';
import { impactGoals, cohortMovement } from '../data/impact';
import { cases, orgAuditLog } from '../data/cases';
import { PRODUCT_NAME } from '../config/verticals';

const REPORT_DATE = 'June 15, 2026';

export default function FunderReport() {
  const { verticalId, theme } = useVertical();
  const goals = impactGoals[verticalId];
  const cohort = cohortMovement[verticalId];

  const closed = cases.filter((c) => c.status === 'Outcome Recorded');
  const achieved = closed.filter((c) => c.outcome?.result === 'Achieved').length;
  const partial = closed.filter((c) => c.outcome?.result === 'Partially Achieved').length;
  const notAchieved = closed.filter((c) => c.outcome?.result === 'Not Achieved').length;
  const closureRate = cases.length ? Math.round((closed.length / cases.length) * 100) : 0;

  const first = cohort[0];
  const last = cohort[cohort.length - 1];

  // Hide app chrome while this report is mounted (see @media print in theme.css).
  useEffect(() => {
    document.body.classList.add('print-report');
    return () => document.body.classList.remove('print-report');
  }, []);

  return (
    <div className="p-8">
      {/* Controls — not printed */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link to="/impact" className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Impact
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
        >
          <Printer className="size-4" weight="fill" />
          Print / Save as PDF
        </button>
      </div>

      {/* Report sheet */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/40 bg-card p-10 shadow-sm backdrop-blur-xl print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none print:backdrop-blur-none">
        <header className="flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{PRODUCT_NAME}</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">Funder &amp; Board Report</h1>
            <p className="mt-1 text-muted-foreground">
              {theme.org.name} · {theme.org.location}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Generated {REPORT_DATE}</p>
            <p>Reporting period: this quarter</p>
          </div>
        </header>

        {/* Outcomes summary */}
        <section className="border-b border-border py-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Outcomes summary</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Achieved', value: achieved },
              { label: 'Partially', value: partial },
              { label: 'Not achieved', value: notAchieved },
              { label: 'Closure rate', value: `${closureRate}%` },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes against goals */}
        <section className="border-b border-border py-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Outcomes against goals</h2>
          <ul className="space-y-3">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <li key={g.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground">{g.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                      <span className="block h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-28 text-right text-muted-foreground">
                      {g.current.toLocaleString()} / {g.target.toLocaleString()}
                      {g.unit ? ` ${g.unit}` : ''}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Cohort movement */}
        <section className="border-b border-border py-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cohort movement</h2>
          <p className="text-sm text-foreground/90">
            Over the reporting window, {theme.personLabel.toLowerCase()} in {theme.stageNames.growth} rose from{' '}
            <strong>{first.growth}</strong> to <strong>{last.growth}</strong>, while {theme.stageNames.crisis} cases fell
            from <strong>{first.crisis}</strong> to <strong>{last.crisis}</strong> — evidence of sustained progression,
            not just activity.
          </p>
        </section>

        {/* Audit attestation */}
        <footer className="pt-6">
          <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-700" weight="fill" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Audited record.</strong> Every figure above is backed by an immutable
              provenance log of {orgAuditLog.length.toLocaleString()} timestamped events (matches, status changes,
              consent updates, data-access). Full audit trail available in Trust &amp; Audit.
            </p>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Prepared by {theme.user.name}, {theme.user.role} · {theme.org.name}
          </p>
        </footer>
      </div>
    </div>
  );
}
