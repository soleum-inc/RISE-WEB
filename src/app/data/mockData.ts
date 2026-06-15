// Mock data for the Marketplace Web Admin

export type MemberRole = 'Giver' | 'Receiver' | 'Both';
export type MemberStatus = 'Verified' | 'Pending';
export type MemberStage = 'Crisis' | 'Stability' | 'Growth';
export type StatusColor = 'red' | 'yellow' | 'green';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
  stage: MemberStage;
  lastActive: string;
  onboardingContext?: string; // What brought them to the community
  acceptance: {
    status: StatusColor;
    vouchers: string[];
    vouchCount: number;
    eventsAttended: number; // Track event attendance
    communityPosts: number; // Community feed engagement
  };
  security: {
    status: StatusColor;
    housing: string;
    food: string;
    healthcare: string;
    needsMet: number; // Number of basic needs met
    crisisReduced: boolean; // Improvement from crisis
  };
  agency: {
    status: StatusColor;
    pasScore: number;
    completedQuests: string[];
    totalQuests: number;
    progress: number;
    skillsLearned: string[]; // Skills gained
    pathwaysCompleted: number; // Completed pathways
  };
  significance: {
    status: StatusColor;
    hoursGiven: number;
    livesImpacted: number;
    badges: string[];
    awardsEarned: number; // Recognition received
    timesAskedToHelp: number; // Times recruited for help
  };
  motivationalProfile?: {
    primaryMotivator: 'acceptance' | 'security' | 'agency' | 'significance' | 'unknown';
    engagementPattern: string; // Description of engagement behavior
    recommendations: string; // Admin-facing recommendations
  };
}

export type EventType = 'red' | 'yellow' | 'green';

export type EventCategory = 'event' | 'program' | 'micro-loan';
export type ScheduleType = 'repeating' | 'one-off' | 'ongoing';

export interface EligibilityCriteria {
  requiredCourses: string[];
  requiredValidations: string[];
  minimumEngagementLevel: EventType;
  minimumStage: MemberStage;
  description: string;
}

export interface EngagementMeta {
  level: EventType;
  label: string;
  targetAudience: string;
  expectedCommitment: string;
  skillsRequired: string[];
  skillsGained: string[];
  seedsReward: number;
  badgeUnlock?: string;
}

export interface Project {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  eventType: EventType;
  color: EventType;
  graduationStage: MemberStage;
  description: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  organizer?: string;
  category: EventCategory;
  scheduleType: ScheduleType;
  recurrence?: string;
  nextOccurrence?: string;
  programDuration?: string;
  engagementMeta: EngagementMeta;
  eligibility?: EligibilityCriteria;
  activeParticipants?: number;
  totalCapacity?: number;
  completionRate?: number;
}

export interface ModerationPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  flagReason?: string;
  urgency?: 'acute' | 'chronic';
  type?: string;
  submittedBy?: string;
  status?: 'pending' | 'approved' | 'flagged';
}

export interface InactiveMatch {
  id: string;
  giverName: string;
  receiverName: string;
  projectNeed: string;
  lastActivity: string;
  daysInactive: number;
  status: StatusColor;
  description?: string;
  matchedDate?: string;
  lastContact?: string;
  inactiveDays?: number;
}

export const members: Member[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Both',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '2 hours ago',
    onboardingContext: 'Joined seeking community support after divorce',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Marcus Lee'],
      vouchCount: 2,
      eventsAttended: 12,
      communityPosts: 8,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: true,
    },
    agency: {
      status: 'green',
      pasScore: 8,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building'],
      totalQuests: 5,
      progress: 60,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing'],
      pathwaysCompleted: 1,
    },
    significance: {
      status: 'green',
      hoursGiven: 47,
      livesImpacted: 12,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder'],
      awardsEarned: 3,
      timesAskedToHelp: 5,
    },
    motivationalProfile: {
      primaryMotivator: 'acceptance',
      engagementPattern: 'High engagement with social events and community posts; seeks connection',
      recommendations: 'Continue encouraging community leadership roles and peer mentorship opportunities',
    },
  },
  {
    id: '2',
    name: 'Marcus Lee',
    role: 'Giver',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '1 day ago',
    onboardingContext: 'Wants to give back after overcoming addiction',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Sarah Johnson', 'Elena Martinez'],
      vouchCount: 3,
      eventsAttended: 18,
      communityPosts: 5,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: true,
    },
    agency: {
      status: 'green',
      pasScore: 9,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building', 'Leadership'],
      totalQuests: 5,
      progress: 80,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing', 'Leadership Development'],
      pathwaysCompleted: 2,
    },
    significance: {
      status: 'green',
      hoursGiven: 126,
      livesImpacted: 34,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder', 'Top Contributor'],
      awardsEarned: 4,
      timesAskedToHelp: 12,
    },
    motivationalProfile: {
      primaryMotivator: 'significance',
      engagementPattern: 'Strong focus on service hours and helping others; motivated by making a difference',
      recommendations: 'Ideal for peer mentorship and leadership roles; consider creating opportunities for him to train others',
    },
  },
  {
    id: '3',
    name: 'Jamal Williams',
    role: 'Receiver',
    status: 'Pending',
    stage: 'Stability',
    lastActive: '3 hours ago',
    onboardingContext: 'Seeking stable housing and employment after job loss',
    acceptance: {
      status: 'yellow',
      vouchers: ['Pastor Tim'],
      vouchCount: 1,
      eventsAttended: 4,
      communityPosts: 2,
    },
    security: {
      status: 'yellow',
      housing: 'Transitional',
      food: 'Food Bank Access',
      healthcare: 'Emergency Only',
      needsMet: 1,
      crisisReduced: true,
    },
    agency: {
      status: 'yellow',
      pasScore: 5,
      completedQuests: ['Financial Literacy'],
      totalQuests: 5,
      progress: 20,
      skillsLearned: ['Financial Literacy'],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'yellow',
      hoursGiven: 8,
      livesImpacted: 2,
      badges: ['New Member'],
      awardsEarned: 1,
      timesAskedToHelp: 1,
    },
    motivationalProfile: {
      primaryMotivator: 'security',
      engagementPattern: 'Focused on meeting basic needs; limited engagement beyond crisis support',
      recommendations: 'Provide security-focused content and stable routines; gradually introduce skill-building once stability improves',
    },
  },
  {
    id: '4',
    name: 'Elena Martinez',
    role: 'Both',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '30 minutes ago',
    onboardingContext: 'Looking to develop leadership skills and mentor others',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Marcus Lee'],
      vouchCount: 2,
      eventsAttended: 15,
      communityPosts: 11,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 7,
      completedQuests: ['Financial Literacy', 'Digital Skills'],
      totalQuests: 5,
      progress: 40,
      skillsLearned: ['Financial Literacy', 'Digital Skills'],
      pathwaysCompleted: 1,
    },
    significance: {
      status: 'green',
      hoursGiven: 63,
      livesImpacted: 18,
      badges: ['Justice Warrior', 'Community Builder'],
      awardsEarned: 2,
      timesAskedToHelp: 7,
    },
    motivationalProfile: {
      primaryMotivator: 'agency',
      engagementPattern: 'Strong focus on skill-building and pathway completion; seeks growth opportunities',
      recommendations: 'Perfect candidate for advanced training and leadership development programs',
    },
  },
  {
    id: '5',
    name: 'David Chen',
    role: 'Receiver',
    status: 'Pending',
    stage: 'Crisis',
    lastActive: '5 hours ago',
    onboardingContext: 'Homeless and in immediate need of shelter and food',
    acceptance: {
      status: 'red',
      vouchers: [],
      vouchCount: 0,
      eventsAttended: 1,
      communityPosts: 0,
    },
    security: {
      status: 'red',
      housing: 'Homeless',
      food: 'Crisis',
      healthcare: 'None',
      needsMet: 0,
      crisisReduced: false,
    },
    agency: {
      status: 'red',
      pasScore: 2,
      completedQuests: [],
      totalQuests: 5,
      progress: 0,
      skillsLearned: [],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'red',
      hoursGiven: 0,
      livesImpacted: 0,
      badges: [],
      awardsEarned: 0,
      timesAskedToHelp: 0,
    },
    motivationalProfile: {
      primaryMotivator: 'unknown',
      engagementPattern: 'New member in crisis; minimal engagement due to immediate survival needs',
      recommendations: 'Focus on immediate crisis intervention and basic needs; provide low-barrier acceptance activities',
    },
  },
  {
    id: '6',
    name: 'Aisha Patel',
    role: 'Giver',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '4 hours ago',
    onboardingContext: 'Healthcare professional wanting to volunteer skills',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Sarah Johnson'],
      vouchCount: 2,
      eventsAttended: 16,
      communityPosts: 7,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 8,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building', 'Leadership'],
      totalQuests: 5,
      progress: 80,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing', 'Leadership Development'],
      pathwaysCompleted: 2,
    },
    significance: {
      status: 'green',
      hoursGiven: 89,
      livesImpacted: 23,
      badges: ['Justice Warrior', 'Verified Mentor', 'Top Contributor'],
      awardsEarned: 3,
      timesAskedToHelp: 9,
    },
    motivationalProfile: {
      primaryMotivator: 'significance',
      engagementPattern: 'Consistent volunteer; focuses on service hours and helping others with professional skills',
      recommendations: 'Excellent candidate for specialized skill-sharing workshops and professional mentorship programs',
    },
  },
  {
    id: '7',
    name: 'Tyler Brooks',
    role: 'Receiver',
    status: 'Verified',
    stage: 'Stability',
    lastActive: '1 day ago',
    onboardingContext: 'Transitioning from homelessness; needs job training',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Aisha Patel'],
      vouchCount: 2,
      eventsAttended: 6,
      communityPosts: 3,
    },
    security: {
      status: 'yellow',
      housing: 'Transitional',
      food: 'Stable',
      healthcare: 'Medicaid',
      needsMet: 2,
      crisisReduced: true,
    },
    agency: {
      status: 'yellow',
      pasScore: 6,
      completedQuests: ['Financial Literacy', 'Digital Skills'],
      totalQuests: 5,
      progress: 40,
      skillsLearned: ['Financial Literacy', 'Digital Skills'],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'yellow',
      hoursGiven: 15,
      livesImpacted: 4,
      badges: ['Community Builder'],
      awardsEarned: 1,
      timesAskedToHelp: 2,
    },
    motivationalProfile: {
      primaryMotivator: 'acceptance',
      engagementPattern: 'Attends events regularly; building social connections; gradually increasing participation',
      recommendations: 'Continue providing community-building opportunities; introduce skill-building when ready',
    },
  },
  {
    id: '8',
    name: 'Carmen Rodriguez',
    role: 'Both',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '6 hours ago',
    onboardingContext: 'Former recipient now giving back; passionate about social justice',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Marcus Lee', 'Elena Martinez'],
      vouchCount: 3,
      eventsAttended: 20,
      communityPosts: 14,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: true,
    },
    agency: {
      status: 'green',
      pasScore: 9,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building', 'Leadership'],
      totalQuests: 5,
      progress: 80,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing', 'Leadership Development'],
      pathwaysCompleted: 2,
    },
    significance: {
      status: 'green',
      hoursGiven: 103,
      livesImpacted: 29,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder', 'Top Contributor'],
      awardsEarned: 4,
      timesAskedToHelp: 11,
    },
    motivationalProfile: {
      primaryMotivator: 'acceptance',
      engagementPattern: 'Highly active in community posts and events; values social connection and belonging',
      recommendations: 'Natural community leader; ideal for peer support groups and social event coordination',
    },
  },
  {
    id: '9',
    name: 'Kevin O\'Connor',
    role: 'Receiver',
    status: 'Pending',
    stage: 'Crisis',
    lastActive: '2 days ago',
    onboardingContext: 'Experiencing homelessness; struggling with substance recovery',
    acceptance: {
      status: 'red',
      vouchers: [],
      vouchCount: 0,
      eventsAttended: 2,
      communityPosts: 0,
    },
    security: {
      status: 'red',
      housing: 'Homeless Shelter',
      food: 'Crisis',
      healthcare: 'Emergency Only',
      needsMet: 0,
      crisisReduced: false,
    },
    agency: {
      status: 'red',
      pasScore: 3,
      completedQuests: [],
      totalQuests: 5,
      progress: 0,
      skillsLearned: [],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'red',
      hoursGiven: 0,
      livesImpacted: 0,
      badges: [],
      awardsEarned: 0,
      timesAskedToHelp: 0,
    },
    motivationalProfile: {
      primaryMotivator: 'security',
      engagementPattern: 'Sporadic attendance; focused on immediate survival needs; building trust slowly',
      recommendations: 'Provide consistent, low-barrier opportunities; focus on safety and basic needs first',
    },
  },
  {
    id: '10',
    name: 'Lisa Thompson',
    role: 'Giver',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '8 hours ago',
    onboardingContext: 'Retired teacher wanting to mentor youth',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Sarah Johnson'],
      vouchCount: 2,
      eventsAttended: 13,
      communityPosts: 6,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 8,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building'],
      totalQuests: 5,
      progress: 60,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing'],
      pathwaysCompleted: 1,
    },
    significance: {
      status: 'green',
      hoursGiven: 71,
      livesImpacted: 19,
      badges: ['Justice Warrior', 'Verified Mentor'],
      awardsEarned: 2,
      timesAskedToHelp: 8,
    },
    motivationalProfile: {
      primaryMotivator: 'significance',
      engagementPattern: 'Dedicated mentor; consistent service hours; values making a difference in lives',
      recommendations: 'Perfect for mentorship programs and educational initiatives',
    },
  },
  {
    id: '11',
    name: 'Antonio Silva',
    role: 'Receiver',
    status: 'Verified',
    stage: 'Stability',
    lastActive: '12 hours ago',
    onboardingContext: 'Immigrant seeking community connections and job opportunities',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Carmen Rodriguez'],
      vouchCount: 2,
      eventsAttended: 5,
      communityPosts: 4,
    },
    security: {
      status: 'yellow',
      housing: 'Transitional',
      food: 'Stable',
      healthcare: 'Medicaid',
      needsMet: 2,
      crisisReduced: true,
    },
    agency: {
      status: 'yellow',
      pasScore: 5,
      completedQuests: ['Financial Literacy'],
      totalQuests: 5,
      progress: 20,
      skillsLearned: ['Financial Literacy'],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'yellow',
      hoursGiven: 12,
      livesImpacted: 3,
      badges: ['Community Builder'],
      awardsEarned: 1,
      timesAskedToHelp: 2,
    },
    motivationalProfile: {
      primaryMotivator: 'acceptance',
      engagementPattern: 'Building community connections; participates in social events; language learning interest',
      recommendations: 'Offer language support and cultural connection opportunities; encourage peer support groups',
    },
  },
  {
    id: '12',
    name: 'Rachel Kim',
    role: 'Both',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '1 hour ago',
    onboardingContext: 'Professional seeking work-life balance and community engagement',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Marcus Lee', 'Aisha Patel'],
      vouchCount: 3,
      eventsAttended: 17,
      communityPosts: 9,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 9,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building', 'Leadership'],
      totalQuests: 5,
      progress: 80,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing', 'Leadership Development'],
      pathwaysCompleted: 2,
    },
    significance: {
      status: 'green',
      hoursGiven: 94,
      livesImpacted: 26,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder'],
      awardsEarned: 3,
      timesAskedToHelp: 10,
    },
    motivationalProfile: {
      primaryMotivator: 'agency',
      engagementPattern: 'High achiever; completes pathways quickly; seeks skill mastery and growth challenges',
      recommendations: 'Provide advanced training and leadership opportunities; ideal for pathway development',
    },
  },
  {
    id: '13',
    name: 'Jerome Washington',
    role: 'Receiver',
    status: 'Pending',
    stage: 'Stability',
    lastActive: '15 hours ago',
    onboardingContext: 'Recovering from job loss; needs financial stability support',
    acceptance: {
      status: 'yellow',
      vouchers: ['Pastor Tim'],
      vouchCount: 1,
      eventsAttended: 3,
      communityPosts: 1,
    },
    security: {
      status: 'yellow',
      housing: 'Transitional',
      food: 'Food Bank Access',
      healthcare: 'Medicaid',
      needsMet: 1,
      crisisReduced: true,
    },
    agency: {
      status: 'yellow',
      pasScore: 4,
      completedQuests: ['Financial Literacy'],
      totalQuests: 5,
      progress: 20,
      skillsLearned: ['Financial Literacy'],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'yellow',
      hoursGiven: 6,
      livesImpacted: 1,
      badges: ['New Member'],
      awardsEarned: 1,
      timesAskedToHelp: 1,
    },
    motivationalProfile: {
      primaryMotivator: 'security',
      engagementPattern: 'Cautious participation; focused on financial stability; building confidence slowly',
      recommendations: 'Provide structured financial support and job readiness programs; celebrate small wins',
    },
  },
  {
    id: '14',
    name: 'Michelle Nguyen',
    role: 'Giver',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '3 days ago',
    onboardingContext: 'Business owner wanting to support local community development',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Sarah Johnson'],
      vouchCount: 2,
      eventsAttended: 11,
      communityPosts: 5,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 7,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building'],
      totalQuests: 5,
      progress: 60,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing'],
      pathwaysCompleted: 1,
    },
    significance: {
      status: 'green',
      hoursGiven: 52,
      livesImpacted: 14,
      badges: ['Justice Warrior', 'Community Builder'],
      awardsEarned: 2,
      timesAskedToHelp: 6,
    },
    motivationalProfile: {
      primaryMotivator: 'significance',
      engagementPattern: 'Professional giving back; values impact and contribution; less frequent but consistent',
      recommendations: 'Leverage business expertise for entrepreneurship programs and career development',
    },
  },
  {
    id: '15',
    name: 'Brandon Taylor',
    role: 'Receiver',
    status: 'Pending',
    stage: 'Crisis',
    lastActive: '1 day ago',
    onboardingContext: 'Urgent housing crisis; fleeing unsafe situation',
    acceptance: {
      status: 'red',
      vouchers: [],
      vouchCount: 0,
      eventsAttended: 1,
      communityPosts: 0,
    },
    security: {
      status: 'red',
      housing: 'Homeless',
      food: 'Crisis',
      healthcare: 'None',
      needsMet: 0,
      crisisReduced: false,
    },
    agency: {
      status: 'red',
      pasScore: 2,
      completedQuests: [],
      totalQuests: 5,
      progress: 0,
      skillsLearned: [],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'red',
      hoursGiven: 0,
      livesImpacted: 0,
      badges: [],
      awardsEarned: 0,
      timesAskedToHelp: 0,
    },
    motivationalProfile: {
      primaryMotivator: 'unknown',
      engagementPattern: 'Brand new in acute crisis; requires immediate intervention',
      recommendations: 'Priority: emergency housing and safety; connect with case manager immediately',
    },
  },
  {
    id: '16',
    name: 'Samantha Lee',
    role: 'Both',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '5 hours ago',
    onboardingContext: 'Artist seeking creative community and opportunities to teach',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Marcus Lee'],
      vouchCount: 2,
      eventsAttended: 14,
      communityPosts: 12,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 8,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building'],
      totalQuests: 5,
      progress: 60,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing'],
      pathwaysCompleted: 1,
    },
    significance: {
      status: 'green',
      hoursGiven: 78,
      livesImpacted: 21,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder'],
      awardsEarned: 3,
      timesAskedToHelp: 8,
    },
    motivationalProfile: {
      primaryMotivator: 'acceptance',
      engagementPattern: 'Highly engaged in community posts and creative events; values self-expression and belonging',
      recommendations: 'Facilitate arts-based programs and creative community events; encourage peer-led workshops',
    },
  },
  {
    id: '17',
    name: 'Robert Jackson',
    role: 'Receiver',
    status: 'Verified',
    stage: 'Stability',
    lastActive: '9 hours ago',
    onboardingContext: 'Veteran transitioning to civilian life; needs career support',
    acceptance: {
      status: 'green',
      vouchers: ['Pastor Tim', 'Lisa Thompson'],
      vouchCount: 2,
      eventsAttended: 7,
      communityPosts: 3,
    },
    security: {
      status: 'yellow',
      housing: 'Subsidized',
      food: 'Stable',
      healthcare: 'Medicaid',
      needsMet: 2,
      crisisReduced: true,
    },
    agency: {
      status: 'yellow',
      pasScore: 6,
      completedQuests: ['Financial Literacy', 'Digital Skills'],
      totalQuests: 5,
      progress: 40,
      skillsLearned: ['Financial Literacy', 'Digital Skills'],
      pathwaysCompleted: 0,
    },
    significance: {
      status: 'yellow',
      hoursGiven: 19,
      livesImpacted: 5,
      badges: ['Community Builder'],
      awardsEarned: 1,
      timesAskedToHelp: 3,
    },
    motivationalProfile: {
      primaryMotivator: 'agency',
      engagementPattern: 'Focused on skill-building and career development; values structure and achievement',
      recommendations: 'Provide veterans-specific resources and clear pathway progression; honor service background',
    },
  },
  {
    id: '18',
    name: 'Pastor Tim',
    role: 'Giver',
    status: 'Verified',
    stage: 'Growth',
    lastActive: '20 minutes ago',
    onboardingContext: 'Community leader committed to serving and empowering others',
    acceptance: {
      status: 'green',
      vouchers: ['Community Leader', 'Ordained Minister'],
      vouchCount: 2,
      eventsAttended: 35,
      communityPosts: 22,
    },
    security: {
      status: 'green',
      housing: 'Secured',
      food: 'Stable',
      healthcare: 'Insured',
      needsMet: 3,
      crisisReduced: false,
    },
    agency: {
      status: 'green',
      pasScore: 10,
      completedQuests: ['Financial Literacy', 'Digital Skills', 'Resume Building', 'Leadership', 'Community Organizing'],
      totalQuests: 5,
      progress: 100,
      skillsLearned: ['Financial Planning', 'Digital Literacy', 'Resume Writing', 'Leadership Development', 'Community Organizing'],
      pathwaysCompleted: 3,
    },
    significance: {
      status: 'green',
      hoursGiven: 487,
      livesImpacted: 156,
      badges: ['Justice Warrior', 'Verified Mentor', 'Community Builder', 'Top Contributor', 'Community Leader'],
      awardsEarned: 5,
      timesAskedToHelp: 45,
    },
    motivationalProfile: {
      primaryMotivator: 'significance',
      engagementPattern: 'Exceptional leader and mentor; consistent high-impact service; highly trusted by community',
      recommendations: 'Key community anchor; involve in major initiatives and strategic planning',
    },
  },
];

export const projects: Project[] = [
  // ─── EVENTS ───────────────────────────────────────────────
  {
    id: '1',
    title: 'Weekly Food Bank',
    date: '2026-02-26',
    time: '9:00 AM - 1:00 PM',
    location: 'Grace Community Center - Warehouse',
    eventType: 'red',
    color: 'red',
    graduationStage: 'Crisis',
    description: 'Weekly food distribution serving 150+ families. Volunteers sort, pack, and distribute fresh produce, canned goods, and essentials. Open to all community members regardless of stage.',
    volunteersNeeded: 25,
    volunteersSignedUp: 21,
    organizer: 'Pastor Tim',
    category: 'event',
    scheduleType: 'repeating',
    recurrence: 'Every Wednesday',
    nextOccurrence: '2026-03-04',
    engagementMeta: {
      level: 'red',
      label: 'Community Gathering',
      targetAudience: 'All members — low barrier entry point',
      expectedCommitment: '4 hours/week',
      skillsRequired: [],
      skillsGained: ['Teamwork', 'Food Safety Basics', 'Community Service'],
      seedsReward: 30,
      badgeUnlock: 'Nourisher',
    },
    activeParticipants: 21,
    totalCapacity: 25,
  },
  {
    id: '2',
    title: 'Community Breakfast',
    date: '2026-03-08',
    time: '8:30 AM - 11:00 AM',
    location: 'Fellowship Hall - Main Campus',
    eventType: 'red',
    color: 'red',
    graduationStage: 'Crisis',
    description: 'One-time community breakfast bringing together new and existing members. Free meal, welcome orientation, and resource table with information about all available programs.',
    volunteersNeeded: 12,
    volunteersSignedUp: 9,
    organizer: 'Pastor Tim',
    category: 'event',
    scheduleType: 'one-off',
    engagementMeta: {
      level: 'red',
      label: 'Community Gathering',
      targetAudience: 'New members & anyone seeking connection',
      expectedCommitment: '2.5 hours (one-time)',
      skillsRequired: [],
      skillsGained: ['Community Awareness', 'Social Connection'],
      seedsReward: 20,
    },
    activeParticipants: 9,
    totalCapacity: 12,
  },

  // ─── COMMUNITY SUPPORT PROGRAMS ───────────────────────────
  {
    id: '3',
    title: 'Wrap Around Grandparenting',
    date: '2026-01-15',
    time: 'Flexible — matched schedules',
    location: 'Various homes & Community Center',
    eventType: 'yellow',
    color: 'yellow',
    graduationStage: 'Stability',
    description: 'Pairs experienced grandparent-figure volunteers with single-parent families or at-risk youth. Provides mentorship, after-school support, and a stable intergenerational relationship. Matches meet weekly.',
    volunteersNeeded: 20,
    volunteersSignedUp: 14,
    organizer: 'Lisa Thompson',
    category: 'program',
    scheduleType: 'ongoing',
    programDuration: '6 months (renewable)',
    engagementMeta: {
      level: 'yellow',
      label: 'Service & Mentorship',
      targetAudience: 'Stability-stage families & experienced Givers',
      expectedCommitment: '3-5 hours/week',
      skillsRequired: ['Background Check Cleared', 'Mentorship Training'],
      skillsGained: ['Mentorship', 'Childcare Support', 'Intergenerational Bonding'],
      seedsReward: 75,
      badgeUnlock: 'Community Elder',
    },
    activeParticipants: 14,
    totalCapacity: 20,
    completionRate: 82,
  },
  {
    id: '4',
    title: 'Small Renovations',
    date: '2026-02-01',
    time: '8:00 AM - 4:00 PM (project days)',
    location: 'Various residential locations',
    eventType: 'green',
    color: 'green',
    graduationStage: 'Growth',
    description: 'Skilled volunteers perform small home repairs and renovations for elderly and disabled community members — plumbing fixes, wheelchair ramps, painting, weatherproofing, and minor electrical work.',
    volunteersNeeded: 15,
    volunteersSignedUp: 11,
    organizer: 'Marcus Lee',
    category: 'program',
    scheduleType: 'ongoing',
    programDuration: 'Ongoing — project-based',
    engagementMeta: {
      level: 'green',
      label: 'Skilled Service',
      targetAudience: 'Growth-stage members with trade skills or willing to learn',
      expectedCommitment: '6-8 hours per project (1-2x/month)',
      skillsRequired: ['Basic Tool Proficiency'],
      skillsGained: ['Home Repair', 'Plumbing Basics', 'Carpentry', 'Project Management'],
      seedsReward: 120,
      badgeUnlock: 'Master Builder',
    },
    activeParticipants: 11,
    totalCapacity: 15,
    completionRate: 91,
  },
  {
    id: '5',
    title: 'Logistic Support',
    date: '2026-01-20',
    time: 'On-demand — matched as needed',
    location: 'Greater Austin Area',
    eventType: 'yellow',
    color: 'yellow',
    graduationStage: 'Stability',
    description: 'Provides transportation, moving help, and delivery assistance to community members in need. Covers medical appointments, grocery runs, furniture donations, and emergency relocations.',
    volunteersNeeded: 30,
    volunteersSignedUp: 22,
    organizer: 'Carmen Rodriguez',
    category: 'program',
    scheduleType: 'ongoing',
    programDuration: 'Ongoing — request-based',
    engagementMeta: {
      level: 'yellow',
      label: 'Practical Service',
      targetAudience: 'Any member with reliable transportation or physical ability',
      expectedCommitment: '2-4 hours per request',
      skillsRequired: ['Valid Driver\'s License (for transport tasks)'],
      skillsGained: ['Coordination', 'Logistics Planning', 'Community Navigation'],
      seedsReward: 50,
      badgeUnlock: 'Lifeline',
    },
    activeParticipants: 22,
    totalCapacity: 30,
    completionRate: 78,
  },

  // ─── MICRO-LOAN PROGRAM ───────────────────────────────────
  {
    id: '6',
    title: 'Community Micro-Loan Program',
    date: '2026-02-01',
    time: 'Application-based — rolling admissions',
    location: 'RISE Resource Office & Online',
    eventType: 'green',
    color: 'green',
    graduationStage: 'Growth',
    description: 'Interest-free micro-loans ($250 - $2,500) for qualified community members. Funds can be used for business start-up costs, certification fees, emergency auto repair, or security deposits. Requires completion of financial literacy coursework and community validation.',
    volunteersNeeded: 5,
    volunteersSignedUp: 5,
    organizer: 'Pastor Tim',
    category: 'micro-loan',
    scheduleType: 'ongoing',
    programDuration: 'Ongoing — quarterly cohorts',
    engagementMeta: {
      level: 'green',
      label: 'Financial Empowerment',
      targetAudience: 'Growth-stage members who have completed required coursework',
      expectedCommitment: 'Pre-work: ~20 hours coursework; Post-loan: monthly check-ins for 6 months',
      skillsRequired: ['Financial Literacy Certification', 'Budgeting 101 Completion', 'Community Validation (2+ vouches)'],
      skillsGained: ['Financial Planning', 'Credit Building', 'Business Basics', 'Accountability'],
      seedsReward: 200,
      badgeUnlock: 'Micro-Entrepreneur',
    },
    eligibility: {
      requiredCourses: ['Financial Literacy', 'Budgeting 101', 'Building Credit from Scratch'],
      requiredValidations: ['2+ Community Vouches', 'Case Manager Approval', 'Financial Coach Sign-off'],
      minimumEngagementLevel: 'green',
      minimumStage: 'Growth',
      description: 'Applicants must complete all three financial courses, receive at least 2 community vouches, and get approval from both their case manager and a certified financial coach.',
    },
    activeParticipants: 8,
    totalCapacity: 12,
    completionRate: 94,
  },
  {
    id: '7',
    title: 'Emergency Micro-Grant',
    date: '2026-02-15',
    time: 'Application-based — emergency turnaround',
    location: 'RISE Resource Office',
    eventType: 'yellow',
    color: 'yellow',
    graduationStage: 'Stability',
    description: 'Small emergency grants ($50 - $500) for members facing acute financial crises — utility shutoffs, medication costs, or emergency travel. Faster approval process with fewer prerequisites than the full micro-loan.',
    volunteersNeeded: 3,
    volunteersSignedUp: 3,
    organizer: 'Pastor Tim',
    category: 'micro-loan',
    scheduleType: 'ongoing',
    programDuration: 'Ongoing — as-needed basis',
    engagementMeta: {
      level: 'yellow',
      label: 'Crisis Financial Support',
      targetAudience: 'Stability-stage members facing acute financial emergencies',
      expectedCommitment: 'Application + 1 follow-up session',
      skillsRequired: [],
      skillsGained: ['Emergency Financial Planning', 'Resource Navigation'],
      seedsReward: 50,
    },
    eligibility: {
      requiredCourses: ['Financial Literacy'],
      requiredValidations: ['1+ Community Vouch', 'Case Manager Approval'],
      minimumEngagementLevel: 'yellow',
      minimumStage: 'Stability',
      description: 'Must have completed Financial Literacy course and received at least 1 community vouch plus case manager approval.',
    },
    activeParticipants: 3,
    totalCapacity: 10,
    completionRate: 88,
  },
];

export const moderationQueue: ModerationPost[] = [
  {
    id: '1',
    author: 'Brandon Taylor',
    submittedBy: 'Brandon Taylor',
    type: 'Housing Assistance',
    content: 'I need help finding emergency housing. Current situation is not safe. Please contact me ASAP.',
    timestamp: '2 hours ago',
    urgency: 'acute',
    status: 'pending',
  },
  {
    id: '2',
    author: 'Kevin O\'Connor',
    submittedBy: 'Kevin O\'Connor',
    type: 'Career Guidance',
    content: 'Does anyone know where I can get help with my resume? I\'ve been applying but not getting any responses.',
    timestamp: '5 hours ago',
    urgency: 'chronic',
    status: 'pending',
  },
  {
    id: '3',
    author: 'Tyler Brooks',
    submittedBy: 'Tyler Brooks',
    type: 'Moving Help',
    content: 'Looking for someone to help me move some furniture this weekend. Can trade labor for labor!',
    timestamp: '1 day ago',
    urgency: 'chronic',
    status: 'approved',
  },
  {
    id: '4',
    author: 'Chloe Martinez',
    submittedBy: 'Chloe Martinez',
    type: 'Carpentry Mentorship',
    content: 'Looking for someone with carpentry skills to teach me basic home repairs. Willing to volunteer in exchange.',
    timestamp: '1 day ago',
    urgency: 'chronic',
    status: 'approved',
  },
  {
    id: '5',
    author: 'David Chen',
    submittedBy: 'David Chen',
    type: 'Food Assistance',
    content: 'Need help accessing food resources. Haven\'t had a proper meal in days.',
    timestamp: '3 hours ago',
    urgency: 'acute',
    status: 'pending',
  },
];

export const inactiveMatches: InactiveMatch[] = [
  {
    id: '1',
    giverName: 'Michelle Nguyen',
    receiverName: 'Kevin O\'Connor',
    projectNeed: 'Resume Building Workshop',
    description: 'Help with resume writing and job application strategies',
    lastActivity: '3 days ago',
    matchedDate: 'Feb 10, 2026',
    lastContact: '3 days ago',
    daysInactive: 3,
    inactiveDays: 3,
    status: 'yellow',
  },
  {
    id: '2',
    giverName: 'Marcus Lee',
    receiverName: 'Brandon Taylor',
    projectNeed: 'Housing Search Assistance',
    description: 'Emergency housing search and application support',
    lastActivity: '5 days ago',
    matchedDate: 'Feb 8, 2026',
    lastContact: '5 days ago',
    daysInactive: 5,
    inactiveDays: 5,
    status: 'red',
  },
  {
    id: '3',
    giverName: 'Lisa Thompson',
    receiverName: 'Jerome Washington',
    projectNeed: 'Job Interview Prep',
    description: 'Mock interviews and professional development coaching',
    lastActivity: '4 days ago',
    matchedDate: 'Feb 9, 2026',
    lastContact: '4 days ago',
    daysInactive: 4,
    inactiveDays: 4,
    status: 'yellow',
  },
  {
    id: '4',
    giverName: 'Aisha Patel',
    receiverName: 'Jamal Williams',
    projectNeed: 'Computer Skills Training',
    lastActivity: '6 days ago',
    daysInactive: 6,
    status: 'red',
  },
  {
    id: '5',
    giverName: 'Carmen Rodriguez',
    receiverName: 'Antonio Silva',
    projectNeed: 'Transportation to Medical Appointments',
    lastActivity: '3 days ago',
    daysInactive: 3,
    status: 'yellow',
  },
  {
    id: '6',
    giverName: 'Sarah Johnson',
    receiverName: 'Tyler Brooks',
    projectNeed: 'Apartment Furnishing',
    lastActivity: '7 days ago',
    daysInactive: 7,
    status: 'red',
  },
];

// Historical ASSA Data for Trends
export interface ASSAHistoricalData {
  week: string;
  month: string;
  acceptance: number; // Percentage with 2+ vouches
  security: number; // Percentage not in crisis
  agency: number; // Average PAS score (1-10)
  significance: number; // Average service hours per member
}

// Weekly data (last 12 weeks)
export const weeklyASSAData: ASSAHistoricalData[] = [
  { week: 'Week 1', month: 'Nov W4', acceptance: 45, security: 62, agency: 5.2, significance: 18 },
  { week: 'Week 2', month: 'Dec W1', acceptance: 48, security: 64, agency: 5.4, significance: 19 },
  { week: 'Week 3', month: 'Dec W2', acceptance: 52, security: 66, agency: 5.6, significance: 21 },
  { week: 'Week 4', month: 'Dec W3', acceptance: 55, security: 68, agency: 5.8, significance: 23 },
  { week: 'Week 5', month: 'Dec W4', acceptance: 58, security: 70, agency: 6.0, significance: 25 },
  { week: 'Week 6', month: 'Jan W1', acceptance: 62, security: 72, agency: 6.2, significance: 27 },
  { week: 'Week 7', month: 'Jan W2', acceptance: 65, security: 74, agency: 6.4, significance: 29 },
  { week: 'Week 8', month: 'Jan W3', acceptance: 68, security: 76, agency: 6.6, significance: 31 },
  { week: 'Week 9', month: 'Jan W4', acceptance: 70, security: 78, agency: 6.8, significance: 33 },
  { week: 'Week 10', month: 'Feb W1', acceptance: 72, security: 80, agency: 7.0, significance: 35 },
  { week: 'Week 11', month: 'Feb W2', acceptance: 74, security: 81, agency: 7.1, significance: 37 },
  { week: 'Week 12', month: 'Feb W3', acceptance: 75, security: 83, agency: 7.2, significance: 39 },
];

// Monthly data (last 6 months)
export const monthlyASSAData: ASSAHistoricalData[] = [
  { week: 'Sep', month: 'Sep 2025', acceptance: 38, security: 55, agency: 4.8, significance: 12 },
  { week: 'Oct', month: 'Oct 2025', acceptance: 42, security: 58, agency: 5.0, significance: 15 },
  { week: 'Nov', month: 'Nov 2025', acceptance: 48, security: 62, agency: 5.4, significance: 19 },
  { week: 'Dec', month: 'Dec 2025', acceptance: 56, security: 68, agency: 5.9, significance: 24 },
  { week: 'Jan', month: 'Jan 2026', acceptance: 66, security: 75, agency: 6.5, significance: 30 },
  { week: 'Feb', month: 'Feb 2026', acceptance: 75, security: 83, agency: 7.2, significance: 39 },
];

// Individual Member Historical Data
export interface MemberHistoricalData {
  week: string;
  month: string;
  acceptance: number; // Vouch count (0-3+)
  security: number; // Status score: red=0-33, yellow=34-66, green=67-100
  agency: number; // PAS score (1-10)
  significance: number; // Service hours given
}

// Generate historical data for individual members
export const memberHistoricalData: { [memberId: string]: MemberHistoricalData[] } = {
  // Sarah Johnson - Growth trajectory
  '1': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 1, security: 55, agency: 6.0, significance: 15 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 1, security: 65, agency: 6.5, significance: 20 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 75, agency: 7.0, significance: 28 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 85, agency: 7.5, significance: 35 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 90, agency: 8.0, significance: 42 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 95, agency: 8.0, significance: 47 },
  ],
  // Marcus Lee - Consistent high performer
  '2': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 3, security: 95, agency: 8.5, significance: 98 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 3, security: 95, agency: 8.5, significance: 105 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 3, security: 95, agency: 9.0, significance: 112 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 3, security: 95, agency: 9.0, significance: 118 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 3, security: 95, agency: 9.0, significance: 122 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 3, security: 95, agency: 9.0, significance: 126 },
  ],
  // Jamal Williams - Stability phase
  '3': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 0, security: 40, agency: 3.5, significance: 2 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 1, security: 45, agency: 4.0, significance: 3 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 1, security: 50, agency: 4.5, significance: 4 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 1, security: 55, agency: 4.8, significance: 6 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 1, security: 60, agency: 5.0, significance: 7 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 1, security: 65, agency: 5.0, significance: 8 },
  ],
  // Elena Martinez - Strong growth
  '4': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 2, security: 85, agency: 6.0, significance: 42 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 2, security: 88, agency: 6.3, significance: 48 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 90, agency: 6.5, significance: 53 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 92, agency: 6.8, significance: 57 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 94, agency: 7.0, significance: 60 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 95, agency: 7.0, significance: 63 },
  ],
  // David Chen - Crisis recovery
  '5': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 0, security: 15, agency: 1.5, significance: 0 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 0, security: 18, agency: 1.8, significance: 0 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 0, security: 20, agency: 2.0, significance: 0 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 0, security: 20, agency: 2.0, significance: 0 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 0, security: 22, agency: 2.0, significance: 0 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 0, security: 25, agency: 2.0, significance: 0 },
  ],
  // Aisha Patel - High achiever
  '6': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 2, security: 92, agency: 7.5, significance: 68 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 2, security: 94, agency: 7.6, significance: 73 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 95, agency: 7.8, significance: 78 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 95, agency: 7.9, significance: 82 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 95, agency: 8.0, significance: 86 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 95, agency: 8.0, significance: 89 },
  ],
  // Tyler Brooks - Steady improvement
  '7': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 1, security: 52, agency: 5.0, significance: 8 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 2, security: 56, agency: 5.2, significance: 10 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 58, agency: 5.5, significance: 11 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 62, agency: 5.8, significance: 13 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 64, agency: 6.0, significance: 14 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 65, agency: 6.0, significance: 15 },
  ],
  // Carmen Rodriguez - Top contributor
  '8': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 3, security: 92, agency: 8.5, significance: 82 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 3, security: 93, agency: 8.7, significance: 88 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 3, security: 94, agency: 8.8, significance: 93 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 3, security: 95, agency: 9.0, significance: 97 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 3, security: 95, agency: 9.0, significance: 100 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 3, security: 95, agency: 9.0, significance: 103 },
  ],
  // Kevin O'Connor - Early crisis stage
  '9': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 0, security: 18, agency: 2.5, significance: 0 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 0, security: 20, agency: 2.8, significance: 0 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 0, security: 22, agency: 3.0, significance: 0 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 0, security: 22, agency: 3.0, significance: 0 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 0, security: 25, agency: 3.0, significance: 0 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 0, security: 28, agency: 3.0, significance: 0 },
  ],
  // Lisa Thompson - Solid giver
  '10': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 2, security: 90, agency: 7.2, significance: 55 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 2, security: 91, agency: 7.5, significance: 59 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 92, agency: 7.6, significance: 63 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 93, agency: 7.8, significance: 66 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 94, agency: 8.0, significance: 69 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 95, agency: 8.0, significance: 71 },
  ],
  // Pastor Tim - Community leader (always high)
  '18': [
    { week: 'Week 7', month: 'Jan W2', acceptance: 2, security: 98, agency: 10, significance: 465 },
    { week: 'Week 8', month: 'Jan W3', acceptance: 2, security: 98, agency: 10, significance: 470 },
    { week: 'Week 9', month: 'Jan W4', acceptance: 2, security: 98, agency: 10, significance: 475 },
    { week: 'Week 10', month: 'Feb W1', acceptance: 2, security: 98, agency: 10, significance: 479 },
    { week: 'Week 11', month: 'Feb W2', acceptance: 2, security: 98, agency: 10, significance: 483 },
    { week: 'Week 12', month: 'Feb W3', acceptance: 2, security: 98, agency: 10, significance: 487 },
  ],
};

// Resources & Programs Data
export type ResourceType = 'video' | 'pdf' | 'event' | 'quiz';
export type PathwayStage = 'crisis' | 'stabilization' | 'growth';
export type EngagementLevel = 'red' | 'yellow' | 'green';
export type ResourcePillar = 'finance' | 'health' | 'nutrition' | 'education';
export type CompletionMethod = 'passive' | 'qr-scan' | 'quiz';
export type ResourceStatus = 'active' | 'draft';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'checkbox' | 'text';
  options?: string[];
  correctAnswer?: string | string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  contentUrl?: string;
  stage: PathwayStage;
  pillar: ResourcePillar;
  engagementLevel: EngagementLevel;
  status: ResourceStatus;
  completionMethod: CompletionMethod;
  seedsValue: number;
  badgeUnlock?: string;
  prerequisiteFor?: string;
  quizQuestions?: QuizQuestion[];
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: 'How to Read a Lease',
    description: 'Learn the basics of understanding rental agreements and your rights as a tenant.',
    type: 'pdf',
    contentUrl: 'https://example.com/lease-guide.pdf',
    stage: 'stabilization',
    pillar: 'finance',
    engagementLevel: 'green',
    status: 'active',
    completionMethod: 'passive',
    seedsValue: 50,
    badgeUnlock: 'Lease Literate',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Budgeting 101',
    description: 'Master the fundamentals of personal budgeting and expense tracking.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/sVKQn2Ml2Qs',
    stage: 'stabilization',
    pillar: 'finance',
    engagementLevel: 'green',
    status: 'active',
    completionMethod: 'quiz',
    seedsValue: 75,
    badgeUnlock: 'Budget Boss',
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the 50/30/20 rule?',
        type: 'multiple-choice',
        options: [
          '50% needs, 30% wants, 20% savings',
          '50% savings, 30% needs, 20% wants',
          '50% wants, 30% savings, 20% needs',
        ],
        correctAnswer: '50% needs, 30% wants, 20% savings',
      },
      {
        id: 'q2',
        question: 'Name one essential expense category',
        type: 'text',
      },
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-02-01',
  },
  {
    id: '3',
    title: 'Community Potluck',
    description: 'Join us for a neighborhood gathering to build connections and share a meal.',
    type: 'event',
    stage: 'crisis',
    pillar: 'nutrition',
    engagementLevel: 'red',
    status: 'active',
    completionMethod: 'qr-scan',
    seedsValue: 25,
    qrCode: 'QR-POTLUCK-2026',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-10',
  },
  {
    id: '4',
    title: 'Nutrition Basics: Eating on a Budget',
    description: 'Learn how to prepare healthy meals with limited resources.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/RuqAPFdTGhw',
    stage: 'stabilization',
    pillar: 'nutrition',
    engagementLevel: 'yellow',
    status: 'active',
    completionMethod: 'passive',
    seedsValue: 40,
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
  },
  {
    id: '5',
    title: 'Emergency Food Resources Guide',
    description: 'Quick reference for finding food assistance in your area.',
    type: 'pdf',
    contentUrl: 'https://example.com/food-resources.pdf',
    stage: 'crisis',
    pillar: 'nutrition',
    engagementLevel: 'red',
    status: 'active',
    completionMethod: 'passive',
    seedsValue: 20,
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
  {
    id: '6',
    title: 'Resume Building Workshop',
    description: 'One-on-one mentorship to create a professional resume.',
    type: 'event',
    stage: 'growth',
    pillar: 'education',
    engagementLevel: 'green',
    status: 'active',
    completionMethod: 'qr-scan',
    seedsValue: 100,
    badgeUnlock: 'Career Ready',
    qrCode: 'QR-RESUME-2026',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-05',
  },
  {
    id: '7',
    title: 'Understanding Healthcare Options',
    description: 'Navigate health insurance, Medicaid, and free clinic options.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/example',
    stage: 'stabilization',
    pillar: 'health',
    engagementLevel: 'yellow',
    status: 'active',
    completionMethod: 'quiz',
    seedsValue: 60,
    quizQuestions: [
      {
        id: 'q1',
        question: 'What does Medicaid cover?',
        type: 'checkbox',
        options: ['Doctor visits', 'Prescriptions', 'Emergency care', 'All of the above'],
        correctAnswer: ['All of the above'],
      },
    ],
    createdAt: '2026-01-25',
    updatedAt: '2026-01-25',
  },
  {
    id: '8',
    title: 'Mental Health Check-In Circle',
    description: 'Weekly group session for emotional support and peer connection.',
    type: 'event',
    stage: 'crisis',
    pillar: 'health',
    engagementLevel: 'red',
    status: 'active',
    completionMethod: 'qr-scan',
    seedsValue: 30,
    qrCode: 'QR-MENTAL-HEALTH-2026',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-12',
  },
  {
    id: '9',
    title: 'Financial Coaching Sessions',
    description: 'One-on-one mentorship with a certified financial coach.',
    type: 'event',
    stage: 'growth',
    pillar: 'finance',
    engagementLevel: 'green',
    status: 'active',
    completionMethod: 'qr-scan',
    seedsValue: 150,
    badgeUnlock: 'Money Master',
    prerequisiteFor: 'Rent Assistance Application',
    qrCode: 'QR-FIN-COACHING-2026',
    createdAt: '2026-01-18',
    updatedAt: '2026-02-08',
  },
  {
    id: '10',
    title: 'Introduction to Digital Literacy',
    description: 'Basic computer skills for job searching and communication.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/example2',
    stage: 'growth',
    pillar: 'education',
    engagementLevel: 'yellow',
    status: 'active',
    completionMethod: 'passive',
    seedsValue: 45,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
  },
  {
    id: '11',
    title: 'Neighborhood Cleanup Day',
    description: 'Volunteer to beautify our community and meet neighbors.',
    type: 'event',
    stage: 'stabilization',
    pillar: 'education',
    engagementLevel: 'yellow',
    status: 'active',
    completionMethod: 'qr-scan',
    seedsValue: 35,
    qrCode: 'QR-CLEANUP-2026',
    createdAt: '2026-02-03',
    updatedAt: '2026-02-03',
  },
  {
    id: '12',
    title: 'Crisis Hotline Directory',
    description: 'Emergency contact numbers for immediate assistance.',
    type: 'pdf',
    contentUrl: 'https://example.com/crisis-hotlines.pdf',
    stage: 'crisis',
    pillar: 'health',
    engagementLevel: 'red',
    status: 'active',
    completionMethod: 'passive',
    seedsValue: 10,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '13',
    title: 'Building Credit from Scratch',
    description: 'Step-by-step guide to establishing and improving your credit score.',
    type: 'pdf',
    contentUrl: 'https://example.com/credit-guide.pdf',
    stage: 'growth',
    pillar: 'finance',
    engagementLevel: 'green',
    status: 'draft',
    completionMethod: 'quiz',
    seedsValue: 80,
    badgeUnlock: 'Credit Champion',
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is a good credit score range?',
        type: 'multiple-choice',
        options: ['300-500', '500-650', '670-850'],
        correctAnswer: '670-850',
      },
    ],
    createdAt: '2026-02-10',
    updatedAt: '2026-02-14',
  },
];

// Community Feed Posts
export type PostType = 'video' | 'audio' | 'article' | 'event';
export type PostStatus = 'published' | 'scheduled' | 'draft';
export type ASSADimension = 'acceptance' | 'security' | 'agency' | 'significance' | '';

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  type: PostType;
  status: PostStatus;
  primaryASSA: ASSADimension;
  mediaUrl?: string;
  thumbnailUrl?: string;
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  seedsReward: number;
  badgeUnlock?: string;
  author: string;
  publishedDate?: string;
  scheduledDate?: string;
  views: number;
  interactions: number;
  createdAt: string;
  updatedAt: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Welcome to Our Community',
    description: 'A warm welcome message from our community leaders sharing what makes our community special.',
    type: 'video',
    status: 'published',
    primaryASSA: 'acceptance',
    mediaUrl: 'https://www.youtube.com/embed/example1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    seedsReward: 25,
    author: 'Pastor Tim',
    publishedDate: '2026-02-10',
    views: 142,
    interactions: 38,
    createdAt: '2026-02-08',
    updatedAt: '2026-02-10',
  },
  {
    id: 'post-2',
    title: 'Understanding Your Rights as a Tenant',
    description: 'Essential information about rental agreements, eviction protection, and tenant rights.',
    type: 'article',
    status: 'published',
    primaryASSA: 'security',
    seedsReward: 50,
    badgeUnlock: 'Housing Hero',
    author: 'Sarah Chen',
    publishedDate: '2026-02-12',
    views: 89,
    interactions: 24,
    createdAt: '2026-02-11',
    updatedAt: '2026-02-12',
  },
  {
    id: 'post-3',
    title: 'Financial Literacy Podcast: Building Your First Budget',
    description: 'Step-by-step audio guide to creating a realistic budget that actually works.',
    type: 'audio',
    status: 'published',
    primaryASSA: 'agency',
    mediaUrl: 'https://example.com/audio/budget-podcast.mp3',
    seedsReward: 60,
    badgeUnlock: 'Budget Builder',
    author: 'Marcus Johnson',
    publishedDate: '2026-02-14',
    views: 67,
    interactions: 19,
    createdAt: '2026-02-13',
    updatedAt: '2026-02-14',
  },
  {
    id: 'post-4',
    title: 'Community Garden Kickoff',
    description: 'Join us for the launch of our community garden! Learn to grow food and connect with neighbors.',
    type: 'event',
    status: 'published',
    primaryASSA: 'acceptance',
    eventId: '1',
    eventTitle: 'Community Garden Kickoff',
    eventDate: '2026-02-20',
    seedsReward: 40,
    author: 'Jennifer Wong',
    publishedDate: '2026-02-05',
    views: 156,
    interactions: 52,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-05',
  },
  {
    id: 'post-5',
    title: 'Navigating Healthcare: A Video Guide',
    description: 'Understanding insurance, Medicaid, and free clinics in our area.',
    type: 'video',
    status: 'published',
    primaryASSA: 'security',
    mediaUrl: 'https://www.youtube.com/embed/example2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    seedsReward: 55,
    author: 'Dr. Emily Rodriguez',
    publishedDate: '2026-02-09',
    views: 93,
    interactions: 31,
    createdAt: '2026-02-07',
    updatedAt: '2026-02-09',
  },
  {
    id: 'post-6',
    title: 'Career Pathways Workshop',
    description: 'Explore career options and map your path to employment in growing industries.',
    type: 'event',
    status: 'scheduled',
    primaryASSA: 'agency',
    eventId: '6',
    eventTitle: 'Financial Literacy Workshop',
    eventDate: '2026-02-27',
    seedsReward: 75,
    badgeUnlock: 'Career Explorer',
    author: 'David Chen',
    scheduledDate: '2026-02-25',
    views: 0,
    interactions: 0,
    createdAt: '2026-02-15',
    updatedAt: '2026-02-15',
  },
  {
    id: 'post-7',
    title: 'Member Success Story: From Crisis to Career',
    description: 'Hear how Maria went from housing crisis to stable employment in just 8 months.',
    type: 'video',
    status: 'published',
    primaryASSA: 'significance',
    mediaUrl: 'https://www.youtube.com/embed/example3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    seedsReward: 30,
    author: 'Maria Garcia',
    publishedDate: '2026-02-11',
    views: 178,
    interactions: 64,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-11',
  },
  {
    id: 'post-8',
    title: 'Meditation for Stress Relief',
    description: 'Daily guided meditation practice to manage anxiety and find inner peace.',
    type: 'audio',
    status: 'published',
    primaryASSA: 'security',
    mediaUrl: 'https://example.com/audio/meditation.mp3',
    seedsReward: 20,
    author: 'Lisa Park',
    publishedDate: '2026-02-13',
    views: 112,
    interactions: 28,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-13',
  },
  {
    id: 'post-9',
    title: 'How to Use the Seed Economy',
    description: 'Complete guide to earning, tracking, and redeeming your community seeds.',
    type: 'article',
    status: 'published',
    primaryASSA: 'agency',
    seedsReward: 35,
    author: 'Admin Team',
    publishedDate: '2026-02-08',
    views: 201,
    interactions: 47,
    createdAt: '2026-02-07',
    updatedAt: '2026-02-08',
  },
  {
    id: 'post-10',
    title: 'Volunteer Spotlight: Meet Our Champions',
    description: 'Celebrating members who have given back 100+ hours to the community.',
    type: 'article',
    status: 'published',
    primaryASSA: 'significance',
    seedsReward: 25,
    author: 'Admin Team',
    publishedDate: '2026-02-15',
    views: 134,
    interactions: 56,
    createdAt: '2026-02-14',
    updatedAt: '2026-02-15',
  },
  {
    id: 'post-11',
    title: 'Job Interview Skills Masterclass',
    description: 'Learn how to ace your next interview with proven techniques from hiring managers.',
    type: 'video',
    status: 'draft',
    primaryASSA: 'agency',
    mediaUrl: 'https://www.youtube.com/embed/example4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
    seedsReward: 70,
    badgeUnlock: 'Interview Pro',
    author: 'Marcus Johnson',
    views: 0,
    interactions: 0,
    createdAt: '2026-02-16',
    updatedAt: '2026-02-16',
  },
  {
    id: 'post-12',
    title: 'Community Potluck Dinner',
    description: 'Bring a dish and share stories! All community members welcome.',
    type: 'event',
    status: 'scheduled',
    primaryASSA: 'acceptance',
    eventId: '8',
    eventTitle: 'Welcome Breakfast',
    eventDate: '2026-02-19',
    seedsReward: 30,
    author: 'Pastor Tim',
    scheduledDate: '2026-02-18',
    views: 0,
    interactions: 0,
    createdAt: '2026-02-14',
    updatedAt: '2026-02-14',
  },
  {
    id: 'post-13',
    title: 'Crisis Resources: Emergency Contacts',
    description: 'Important phone numbers and resources for immediate help.',
    type: 'article',
    status: 'published',
    primaryASSA: 'security',
    seedsReward: 15,
    author: 'Admin Team',
    publishedDate: '2026-02-01',
    views: 267,
    interactions: 43,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
  },
  {
    id: 'post-14',
    title: 'Podcast: Building Resilience in Hard Times',
    description: 'Stories and strategies from community members who overcame adversity.',
    type: 'audio',
    status: 'draft',
    primaryASSA: 'significance',
    mediaUrl: 'https://example.com/audio/resilience.mp3',
    seedsReward: 45,
    author: 'Sarah Chen',
    views: 0,
    interactions: 0,
    createdAt: '2026-02-17',
    updatedAt: '2026-02-17',
  },
];
