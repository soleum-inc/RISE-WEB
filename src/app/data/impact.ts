/**
 * Impact / Insights datasets — vertical-aware (keyed by VerticalId) so the whole
 * Impact view reskins with the org-dropdown vertical switcher. Mock data for the
 * prototype; the "Insights-as-a-Service" tier.
 */
import { type VerticalId, type VerticalTheme } from '../config/verticals';
import { cases } from './cases';

export interface ImpactGoal {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export const impactGoals: Record<VerticalId, ImpactGoal[]> = {
  faith: [
    { label: 'Housing secured', current: 12, target: 20 },
    { label: 'Members reaching Growth', current: 8, target: 15 },
    { label: 'Crises de-escalated', current: 17, target: 18 },
    { label: 'Service hours contributed', current: 1270, target: 1500, unit: 'hrs' },
  ],
  foundation: [
    { label: 'Households stabilized', current: 34, target: 50 },
    { label: 'Beneficiaries reaching Thriving', current: 19, target: 40 },
    { label: 'Emergency needs met', current: 58, target: 60 },
    { label: 'Volunteer hours contributed', current: 2100, target: 2500, unit: 'hrs' },
  ],
  scholarship: [
    { label: 'Students enrolled', current: 42, target: 60 },
    { label: 'Students graduating', current: 11, target: 25 },
    { label: 'Scholarships awarded', current: 30, target: 35 },
    { label: 'Mentor hours contributed', current: 880, target: 1200, unit: 'hrs' },
  ],
  workforce: [
    { label: 'Candidates placed', current: 27, target: 50 },
    { label: 'Talent reaching Placed', current: 27, target: 45 },
    { label: 'Certifications earned', current: 33, target: 40 },
    { label: 'Coaching hours contributed', current: 1540, target: 2000, unit: 'hrs' },
  ],
};

export interface CohortPoint {
  period: string;
  crisis: number;
  stability: number;
  growth: number;
}

const PERIODS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

/** Deterministic cohort movement: crisis falls, growth rises as people progress. */
function genCohort(startCrisis: number, startStability: number, startGrowth: number): CohortPoint[] {
  return PERIODS.map((period, i) => ({
    period,
    crisis: Math.max(2, Math.round(startCrisis - i * 1.4)),
    stability: Math.round(startStability + Math.sin(i / 2) * 2),
    growth: Math.round(startGrowth + i * 2.1),
  }));
}

export const cohortMovement: Record<VerticalId, CohortPoint[]> = {
  faith: genCohort(14, 10, 4),
  foundation: genCohort(28, 18, 8),
  scholarship: genCohort(20, 14, 6),
  workforce: genCohort(24, 12, 5),
};

export interface DemandCell {
  category: string;
  count: number;
}

/**
 * Needs / demand by category for the active vertical. Seeds from real case
 * categories, then fills every theme category with a deterministic count so the
 * heat view is always populated (and reskins per vertical via theme.aidCategories).
 */
export function demandByCategory(theme: VerticalTheme): DemandCell[] {
  const seedCounts: Record<string, number> = {};
  for (const c of cases) seedCounts[c.category] = (seedCounts[c.category] ?? 0) + 1;
  return theme.aidCategories.map((category, i) => {
    const seed = seedCounts[category] ?? 0;
    const synth = ((i * 7 + category.length * 3) % 18) + 3;
    return { category, count: seed * 6 + synth };
  });
}
