/**
 * Vertical theme config — vocabulary & taxonomy for SOLEUM™ RISE.
 *
 * RISE is vertical-agnostic: the SAME UI reskins for faith, foundation,
 * scholarship and workforce instances by swapping the labels below. Components
 * read these via `useVertical()` instead of hardcoding copy. The underlying data
 * enums (stages 'Crisis'|'Stability'|'Growth', roles 'Giver'|'Receiver') stay
 * stable keys — only the DISPLAY labels change here.
 */

/** The platform brand — constant across every vertical. */
export const PRODUCT_NAME = "SOLEUM™ RISE";
export const PRODUCT_SUBTITLE = "PATRON Console";

export type VerticalId = "faith" | "foundation" | "scholarship" | "workforce";

export interface VerticalTheme {
  id: VerticalId;
  /** Display name in the org-switcher menu. */
  label: string;
  /** Tenant identity shown in the top-right org pill. */
  org: { name: string; location: string; initials: string; domain: string };
  /** The signed-in PATRON-console operator (sidebar footer). */
  user: { name: string; role: string; initials: string };
  /** The person receiving help/opportunity (RISER). */
  personLabel: string; // plural, e.g. "Members"
  personSingular: string; // e.g. "Member"
  /** The person providing help/opportunity (PATRON). */
  giverLabel: string; // plural, e.g. "Givers"
  /** What a tracked engagement is called. */
  caseLabel: string; // plural, e.g. "Cases"
  /** The contribution metric (faith: "Service Hours"). */
  contributionLabel: string;
  /** Display labels for the three lifecycle stages (keyed by the data enum). */
  stageNames: { crisis: string; stability: string; growth: string };
  /** Aid / support categories offered in this vertical. */
  aidCategories: string[];
}

export const verticals: Record<VerticalId, VerticalTheme> = {
  faith: {
    id: "faith",
    label: "Faith Community",
    org: { name: "Retirement Reformation", location: "Greater Austin Chapter", initials: "RR", domain: "retirementreformation.org" },
    user: { name: "Pastor Tim", role: "Community Manager", initials: "PT" },
    personLabel: "Members",
    personSingular: "Member",
    giverLabel: "Givers",
    caseLabel: "Cases",
    contributionLabel: "Service Hours",
    stageNames: { crisis: "Crisis Entry", stability: "Stabilization", growth: "Growth/Skill Building" },
    aidCategories: ["Food Assistance", "Housing", "Job Training", "Mental Health", "Youth Programs", "Emergency Aid"],
  },
  foundation: {
    id: "foundation",
    label: "Foundation / Social Services",
    org: { name: "Cornerstone Foundation", location: "Bay Area Region", initials: "CF", domain: "cornerstonefoundation.org" },
    user: { name: "Dana Reyes", role: "Program Director", initials: "DR" },
    personLabel: "Beneficiaries",
    personSingular: "Beneficiary",
    giverLabel: "Donors",
    caseLabel: "Cases",
    contributionLabel: "Volunteer Hours",
    stageNames: { crisis: "Intake", stability: "Stabilizing", growth: "Thriving" },
    aidCategories: ["Housing", "Food Security", "Healthcare", "Childcare", "Utilities", "Emergency Aid"],
  },
  scholarship: {
    id: "scholarship",
    label: "Scholarship Fund",
    org: { name: "Horizon Scholars Fund", location: "National Program", initials: "HS", domain: "horizonscholars.org" },
    user: { name: "Dr. Alan Pierce", role: "Fund Administrator", initials: "AP" },
    personLabel: "Students",
    personSingular: "Student",
    giverLabel: "Sponsors",
    caseLabel: "Awards",
    contributionLabel: "Mentor Hours",
    stageNames: { crisis: "Applicant", stability: "Enrolled", growth: "Graduating" },
    aidCategories: ["Tuition", "Books & Supplies", "Living Stipend", "Mentorship", "Test Prep", "Emergency Grant"],
  },
  workforce: {
    id: "workforce",
    label: "Workforce Program",
    org: { name: "Ascend Workforce", location: "Midwest Hub", initials: "AW", domain: "ascendworkforce.org" },
    user: { name: "Maria Gomez", role: "Workforce Lead", initials: "MG" },
    personLabel: "Talent",
    personSingular: "Candidate",
    giverLabel: "Employers",
    caseLabel: "Placements",
    contributionLabel: "Coaching Hours",
    stageNames: { crisis: "Intake", stability: "Training", growth: "Placed" },
    aidCategories: ["Job Training", "Certifications", "Job Placement", "Coaching", "Equipment", "Transportation"],
  },
};

/** Order shown in the switcher. */
export const verticalOrder: VerticalId[] = ["faith", "foundation", "scholarship", "workforce"];

export const defaultVerticalId: VerticalId = "faith";
