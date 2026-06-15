import { Link } from 'react-router';
import { ChartLineUp, Target, Fire, FileArrowDown } from '@phosphor-icons/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useVertical } from '../context/VerticalContext';
import { impactGoals, cohortMovement, demandByCategory } from '../data/impact';
import { cn } from '../components/ui/utils';

const panel = 'rounded-2xl border border-white/40 bg-card shadow-sm backdrop-blur-xl';

export default function Impact() {
  const { verticalId, theme } = useVertical();
  const goals = impactGoals[verticalId];
  const cohort = cohortMovement[verticalId];
  const demand = demandByCategory(theme);
  const maxDemand = Math.max(...demand.map((d) => d.count), 1);

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
            <ChartLineUp className="size-6" weight="fill" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Impact</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">
              Insights-as-a-Service — outcomes against goals, cohort movement across stages, and live
              demand for {theme.org.name}.
            </p>
          </div>
        </div>
        <Link
          to="/impact/report"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
        >
          <FileArrowDown className="size-4" weight="fill" />
          Export funder report
        </Link>
      </div>

      {/* Outcomes vs goals */}
      <div className={cn(panel, 'mb-6 p-6')}>
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
          <Target className="size-5 text-muted-foreground" />
          Outcomes against goals
        </h2>
        <p className="mb-5 text-xs text-muted-foreground">Progress toward this period's targets.</p>
        <div className="space-y-5">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div key={g.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{g.label}</span>
                  <span className="text-muted-foreground">
                    {g.current.toLocaleString()} of {g.target.toLocaleString()}
                    {g.unit ? ` ${g.unit}` : ''} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cohort movement */}
        <div className={cn(panel, 'p-6')}>
          <h2 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
            <ChartLineUp className="size-5 text-muted-foreground" />
            Cohort movement across stages
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            {theme.personLabel} moving {theme.stageNames.crisis} → {theme.stageNames.stability} →{' '}
            {theme.stageNames.growth} over time.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cohort} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebdfd3" />
                <XAxis dataKey="period" stroke="#a89b91" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a89b91" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fbf6ef',
                    border: '1px solid #ebdfd3',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '12px' }} />
                <Area type="monotone" dataKey="crisis" stackId="1" name={theme.stageNames.crisis} stroke="#e8533f" fill="#e8533f" fillOpacity={0.7} />
                <Area type="monotone" dataKey="stability" stackId="1" name={theme.stageNames.stability} stroke="#d98e4a" fill="#d98e4a" fillOpacity={0.7} />
                <Area type="monotone" dataKey="growth" stackId="1" name={theme.stageNames.growth} stroke="#4f9d69" fill="#4f9d69" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Needs / demand heat */}
        <div className={cn(panel, 'p-6')}>
          <h2 className="mb-1 flex items-center gap-2 font-semibold text-foreground">
            <Fire className="size-5 text-muted-foreground" />
            Needs &amp; demand by category
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">Open requests per category — darker is hotter.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {demand.map((d) => {
              const intensity = d.count / maxDemand;
              return (
                <div
                  key={d.category}
                  className="rounded-xl border border-white/40 p-4"
                  style={{ backgroundColor: `rgba(232, 83, 63, ${0.05 + intensity * 0.15})` }}
                >
                  <p className="text-sm font-medium text-foreground">{d.category}</p>
                  <p className="text-2xl font-bold text-foreground">{d.count}</p>
                  <p className="text-xs text-foreground/60">open requests</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.round(intensity * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
