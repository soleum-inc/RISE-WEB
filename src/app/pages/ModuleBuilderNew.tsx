import { useState, useEffect, useRef } from 'react';
import { Plus, MagnifyingGlass as Search, Funnel as Filter, VideoCamera as Video, FileText, Link as LinkIcon, Sparkle as Sparkles, CaretRight as ChevronRight, CaretDown as ChevronDown, PencilSimple as Edit2, FloppyDisk as Save, PaperPlaneTilt as Send, ArrowUp, ArrowDown, DotsThreeVertical as MoreVertical, Eye, X, Trash as Trash2, CalendarBlank as Calendar, CheckSquare, TextT as Type, Question as HelpCircle, GridFour as Grid, ListBullets as LayoutList, UploadSimple as Upload, Globe, FileArrowUp as FileUp, Tag, MagicWand as Wand2, BookOpen, Stack as Layers, Image as ImageIcon } from "@phosphor-icons/react";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { StatusBadge } from '../components/ui/status-badge';
import { resources, type Resource } from '../data/mockData';
import { toast } from 'sonner';
import { useFramework } from '../context/FrameworkContext';

type GraduationStage = 'crisis' | 'stabilization' | 'growth';
type Pillar = 'nutrition' | 'health' | 'education' | 'finance' | '';
type BlockType = 'media' | 'multiple-choice' | 'text-input' | 'checkbox' | 'event';
type ModuleStatus = 'draft' | 'published';
type EngagementLevel = 'red' | 'yellow' | 'green';
type FilterType = 'all' | 'crisis' | 'stabilization' | 'growth' | 'untagged';
type TabMode = 'library' | 'builder';
type ViewLayout = 'grid' | 'table';

interface ContentBlock {
  id: string;
  type: BlockType;
  question?: string;
  options?: string[];
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';
  eventId?: string;
  eventTitle?: string;
  eventEngagement?: EngagementLevel;
}

interface SubModule {
  id: string;
  title: string;
  description: string;
  contentBlocks: ContentBlock[];
}

interface ModuleItem {
  id: string;
  itemType: 'submodule' | 'event' | 'resource';
  order: number;
  subModule?: SubModule;
  eventBlock?: ContentBlock;
  resource?: Resource;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  stage: GraduationStage | '';
  pillar: Pillar;
  seedsReward: number;
  badgeUnlock: string;
  headerImage?: string;
  moduleItems: ModuleItem[];
  status: ModuleStatus;
  createdAt: Date;
  publishedAt?: Date;
}

// Import source types for library
interface ImportedItem {
  id: string;
  title: string;
  description: string;
  sourceUrl?: string;
  sourceType: 'url' | 'file' | 'manual';
  contentType: 'course' | 'video' | 'document' | 'quiz' | 'other';
  stage: GraduationStage | '';
  pillar: Pillar;
  importedAt: Date;
  fileName?: string;
}

// Mock events data
const mockEvents = [
  { id: 'e1', title: 'Community Potluck Dinner', engagement: 'red' as EngagementLevel, type: 'Social Gathering' },
  { id: 'e2', title: 'Park Cleanup Day', engagement: 'red' as EngagementLevel, type: 'Community Service' },
  { id: 'e3', title: 'Financial Literacy Workshop', engagement: 'yellow' as EngagementLevel, type: 'Educational Workshop' },
  { id: 'e4', title: 'Resume Building Clinic', engagement: 'yellow' as EngagementLevel, type: 'Skills Training' },
  { id: 'e5', title: 'Career Mentorship Program', engagement: 'green' as EngagementLevel, type: 'Professional Development' },
  { id: 'e6', title: 'Leadership Development Series', engagement: 'green' as EngagementLevel, type: 'Advanced Training' },
];

// Module Library - Pre-built modules and sub-modules
const moduleLibrary: Record<string, Array<{ title: string; description: string; subModules: Array<{ title: string; description: string }> }>> = {
  crisis: [
    {
      title: 'Emergency Assistance Navigation',
      description: 'Learn how to access immediate help for food, shelter, and safety',
      subModules: [
        { title: 'Food Resources', description: 'Finding food banks and meal programs in your area' },
        { title: 'Emergency Shelter', description: 'Understanding shelter options and how to access them' },
        { title: 'Safety Planning', description: 'Creating a personal safety plan' },
      ]
    },
    {
      title: 'Crisis Support Systems',
      description: 'Build your support network during difficult times',
      subModules: [
        { title: 'Hotline Resources', description: 'When and how to use crisis hotlines' },
        { title: 'Community Support', description: 'Connecting with local support groups' },
        { title: 'Emergency Contacts', description: 'Building your emergency contact list' },
      ]
    },
    {
      title: 'Immediate Health & Safety',
      description: 'Essential health and safety information for crisis situations',
      subModules: [
        { title: 'Medical Assistance', description: 'Accessing emergency medical care' },
        { title: 'Mental Health First Aid', description: 'Immediate mental health support resources' },
        { title: 'Basic Safety Skills', description: 'Essential safety knowledge for daily life' },
      ]
    },
  ],
  stabilization: [
    {
      title: 'Financial Stability Basics',
      description: 'Build a foundation for managing your money and expenses',
      subModules: [
        { title: 'Budgeting Fundamentals', description: 'Creating and maintaining a simple budget' },
        { title: 'Banking Basics', description: 'Opening and using a bank account' },
        { title: 'Expense Tracking', description: 'Tools and habits for tracking spending' },
      ]
    },
    {
      title: 'Housing Stability',
      description: 'Secure and maintain safe, affordable housing',
      subModules: [
        { title: 'Rental Basics', description: 'Understanding leases and tenant rights' },
        { title: 'Housing Assistance Programs', description: 'Accessing housing support services' },
        { title: 'Home Maintenance', description: 'Basic skills for maintaining your living space' },
      ]
    },
    {
      title: 'Employment Readiness',
      description: 'Prepare for and secure stable employment',
      subModules: [
        { title: 'Resume Writing', description: 'Creating an effective resume' },
        { title: 'Interview Skills', description: 'Preparing for and succeeding in job interviews' },
        { title: 'Workplace Success', description: 'Thriving in your new job' },
      ]
    },
    {
      title: 'Health & Wellness Routine',
      description: 'Establish healthy habits for physical and mental wellbeing',
      subModules: [
        { title: 'Nutrition Basics', description: 'Planning healthy meals on a budget' },
        { title: 'Exercise Fundamentals', description: 'Starting a simple fitness routine' },
        { title: 'Mental Health Practices', description: 'Daily habits for emotional wellbeing' },
      ]
    },
  ],
  growth: [
    {
      title: 'Advanced Career Development',
      description: 'Take your career to the next level with strategic planning',
      subModules: [
        { title: 'Career Path Planning', description: 'Mapping your professional future' },
        { title: 'Skill Development', description: 'Identifying and building key competencies' },
        { title: 'Professional Network Building', description: 'Expanding your professional connections' },
      ]
    },
    {
      title: 'Financial Growth & Investment',
      description: 'Build wealth and plan for your financial future',
      subModules: [
        { title: 'Savings Strategies', description: 'Building an emergency fund and beyond' },
        { title: 'Investment Basics', description: 'Understanding investment options' },
        { title: 'Retirement Planning', description: 'Planning for long-term financial security' },
      ]
    },
    {
      title: 'Leadership & Community Engagement',
      description: 'Develop leadership skills and give back to your community',
      subModules: [
        { title: 'Leadership Fundamentals', description: 'Core principles of effective leadership' },
        { title: 'Volunteer & Mentorship', description: 'Giving back through service and guidance' },
        { title: 'Community Building', description: 'Creating positive change in your community' },
      ]
    },
    {
      title: 'Education & Lifelong Learning',
      description: 'Continue your educational journey and personal development',
      subModules: [
        { title: 'Higher Education Options', description: 'Exploring college and training programs' },
        { title: 'Professional Certifications', description: 'Advancing through specialized training' },
        { title: 'Learning Resources', description: 'Finding and using educational resources' },
      ]
    },
  ]
};

// Smart suggestion helpers
const suggestDescription = (title: string, stage: string): string => {
  const t = title.toLowerCase();
  const stageLabel = stage || 'general';
  
  const descriptionMap: Record<string, string> = {
    'financial': `A comprehensive module covering financial literacy fundamentals designed for members in the ${stageLabel} stage. Covers budgeting, saving strategies, and practical money management skills.`,
    'health': `An interactive health and wellness module tailored for ${stageLabel}-stage members. Includes guidance on physical health, mental wellbeing, and accessing healthcare resources.`,
    'housing': `A practical guide to housing stability for ${stageLabel}-stage members. Covers finding, securing, and maintaining safe and affordable housing.`,
    'career': `A career development pathway for ${stageLabel}-stage members. Includes resume building, interview prep, and professional growth strategies.`,
    'leadership': `A leadership development module empowering ${stageLabel}-stage members to take on community roles, mentor peers, and drive positive change.`,
    'education': `An educational pathway module for ${stageLabel}-stage members focused on building knowledge, accessing learning resources, and skill development.`,
    'nutrition': `A nutrition and food security module for ${stageLabel}-stage members. Covers meal planning, accessing food resources, and building healthy eating habits.`,
    'safety': `A safety and crisis planning module for ${stageLabel}-stage members. Covers emergency preparedness, personal safety, and building support networks.`,
    'community': `A community building module for ${stageLabel}-stage members. Focuses on social connection, peer support, and meaningful engagement.`,
    'mental': `A mental health and emotional wellbeing module for ${stageLabel}-stage members. Includes coping strategies, self-care practices, and access to support.`,
  };

  for (const [keyword, desc] of Object.entries(descriptionMap)) {
    if (t.includes(keyword)) return desc;
  }

  return `A structured learning module for ${stageLabel}-stage members covering key concepts and practical skills related to "${title}". Designed to support member growth through interactive content and real-world application.`;
};

const suggestSeeds = (stage: string, itemCount: number): number => {
  const base = stage === 'crisis' ? 25 : stage === 'stabilization' ? 50 : 75;
  return base + (itemCount * 10);
};

const suggestBadge = (title: string, stage: string): string => {
  const t = title.toLowerCase();
  if (t.includes('financial') || t.includes('budget') || t.includes('money')) return 'Budget Champion';
  if (t.includes('health') || t.includes('wellness')) return 'Wellness Warrior';
  if (t.includes('housing') || t.includes('home')) return 'Home Builder';
  if (t.includes('career') || t.includes('job') || t.includes('employ')) return 'Career Trailblazer';
  if (t.includes('leadership') || t.includes('leader')) return 'Community Leader';
  if (t.includes('education') || t.includes('learning')) return 'Knowledge Seeker';
  if (t.includes('nutrition') || t.includes('food')) return 'Nutrition Navigator';
  if (t.includes('safety') || t.includes('crisis')) return 'Safety Star';
  if (t.includes('community')) return 'Community Builder';
  
  const stageLabels = { crisis: 'Resilience', stabilization: 'Foundation', growth: 'Mastery' };
  return `${stageLabels[stage as keyof typeof stageLabels] || 'Achievement'} Badge`;
};

// Suggested header images by keyword
const suggestHeaderImage = (title: string, stage: string): string => {
  const t = title.toLowerCase();
  if (t.includes('financial') || t.includes('budget') || t.includes('money') || t.includes('investment'))
    return 'https://images.unsplash.com/photo-1769311482669-7124a4bc9293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBsaXRlcmFjeSUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjA4MDcxOXww&ixlib=rb-4.1.0&q=80&w=1080';
  if (t.includes('career') || t.includes('job') || t.includes('employ') || t.includes('resume'))
    return 'https://images.unsplash.com/photo-1758876019673-704b039d405c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBkZXZlbG9wbWVudCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzIwMzUyNjN8MA&ixlib=rb-4.1.0&q=80&w=1080';
  if (t.includes('nutrition') || t.includes('food') || t.includes('meal') || t.includes('healthy eating'))
    return 'https://images.unsplash.com/photo-1760445529233-ff4bd543270e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb24lMjBoZWFsdGh5JTIwbWVhbCUyMHByZXBhcmF0aW9ufGVufDF8fHx8MTc3MjA4MDcyMHww&ixlib=rb-4.1.0&q=80&w=1080';
  if (t.includes('leadership') || t.includes('mentor') || t.includes('community'))
    return 'https://images.unsplash.com/photo-1770240366949-75c25d6eb6fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwbWVudG9yc2hpcCUyMGdyb3d0aHxlbnwxfHx8fDE3NzIwODA3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080';
  if (t.includes('crisis') || t.includes('emergency') || t.includes('safety') || t.includes('support'))
    return 'https://images.unsplash.com/photo-1763355873417-1e0926397851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwaGVscGluZyUyMGhhbmRzfGVufDF8fHx8MTc3MjA4MDcxOXww&ixlib=rb-4.1.0&q=80&w=1080';
  if (t.includes('health') || t.includes('mental') || t.includes('wellness'))
    return 'https://images.unsplash.com/photo-1763355873417-1e0926397851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwaGVscGluZyUyMGhhbmRzfGVufDF8fHx8MTc3MjA4MDcxOXww&ixlib=rb-4.1.0&q=80&w=1080';
  // Default: generic education image
  return 'https://images.unsplash.com/photo-1768595701593-c84fd8143aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE5OTkyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
};

// Wizard templates
const wizardTemplates = [
  { title: 'Financial Literacy Fundamentals', stage: 'stabilization' as GraduationStage, pillar: 'finance' as Pillar,
    description: 'Build a strong financial foundation with budgeting, saving, and money management skills.',
    subModules: ['Understanding Income & Expenses', 'Creating a Budget', 'Building Savings Habits', 'Navigating Banking'] },
  { title: 'Emergency Resource Navigation', stage: 'crisis' as GraduationStage, pillar: 'health' as Pillar,
    description: 'Navigate immediate support resources for food, shelter, healthcare, and safety.',
    subModules: ['Finding Food Resources', 'Emergency Shelter Options', 'Healthcare Access', 'Crisis Hotlines & Support'] },
  { title: 'Job Readiness Bootcamp', stage: 'stabilization' as GraduationStage, pillar: 'education' as Pillar,
    description: 'Prepare for employment with resume building, interview skills, and workplace readiness.',
    subModules: ['Resume & Cover Letter', 'Interview Preparation', 'Workplace Communication', 'First 90 Days Success'] },
  { title: 'Community Leadership Pathway', stage: 'growth' as GraduationStage, pillar: 'education' as Pillar,
    description: 'Develop leadership skills to mentor others and drive community impact.',
    subModules: ['Leadership Foundations', 'Mentorship Skills', 'Community Organizing', 'Measuring Your Impact'] },
  { title: 'Nutrition & Healthy Living', stage: 'stabilization' as GraduationStage, pillar: 'nutrition' as Pillar,
    description: 'Learn to plan healthy meals on a budget and build sustainable nutrition habits.',
    subModules: ['Meal Planning Basics', 'Budget-Friendly Shopping', 'Simple Healthy Recipes', 'Reading Nutrition Labels'] },
  { title: 'Mental Health & Resilience', stage: 'crisis' as GraduationStage, pillar: 'health' as Pillar,
    description: 'Build emotional resilience with coping strategies, self-care, and support resources.',
    subModules: ['Understanding Stress', 'Coping Strategies', 'Self-Care Practices', 'When to Seek Help'] },
];

type ViewMode = 'module-list' | 'module-detail' | 'submodule-detail';

// Global storage for modules
export const STORAGE_KEY = 'module-builder-data';
const LIBRARY_STORAGE_KEY = 'module-library-imports';

export const loadModulesFromStorage = (): Module[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt),
        publishedAt: m.publishedAt ? new Date(m.publishedAt) : undefined,
      }));
    }
  } catch (e) {
    console.error('Error loading modules:', e);
  }
  return [];
};

export const saveModulesToStorage = (modules: Module[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    window.dispatchEvent(new Event('modules-updated'));
  } catch (e) {
    console.error('Error saving modules:', e);
  }
};

const loadImportsFromStorage = (): ImportedItem[] => {
  try {
    const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((i: any) => ({ ...i, importedAt: new Date(i.importedAt) }));
    }
  } catch (e) { console.error('Error loading imports:', e); }
  return [];
};

const saveImportsToStorage = (items: ImportedItem[]) => {
  try { localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items)); }
  catch (e) { console.error('Error saving imports:', e); }
};

// Pre-seeded imported items to demonstrate the library
const defaultImportedItems: ImportedItem[] = [
  { id: 'imp-1', title: 'Financial Literacy 101 - Complete Course', description: 'A 12-module course covering budgeting, saving, credit, and debt management', sourceUrl: 'https://courses.example.org/financial-literacy-101', sourceType: 'url', contentType: 'course', stage: 'stabilization', pillar: 'finance', importedAt: new Date('2025-12-15') },
  { id: 'imp-2', title: 'Healthy Eating on a Budget', description: 'Video series on meal planning, grocery shopping strategies, and simple recipes', sourceType: 'file', contentType: 'video', stage: 'stabilization', pillar: 'nutrition', importedAt: new Date('2025-12-20'), fileName: 'healthy-eating-series.zip' },
  { id: 'imp-3', title: 'Crisis De-escalation Training', description: 'Staff training materials for crisis intervention and support', sourceUrl: 'https://training.example.org/crisis-deescalation', sourceType: 'url', contentType: 'document', stage: 'crisis', pillar: 'health', importedAt: new Date('2026-01-05') },
  { id: 'imp-4', title: 'Resume Workshop Materials', description: 'Slide deck and worksheets for resume writing workshops', sourceType: 'file', contentType: 'document', stage: '', pillar: '', importedAt: new Date('2026-01-10'), fileName: 'resume-workshop-2026.pdf' },
  { id: 'imp-5', title: 'Community Leadership Handbook', description: 'Comprehensive guide for community leaders and mentors', sourceType: 'manual', contentType: 'document', stage: 'growth', pillar: 'education', importedAt: new Date('2026-01-18') },
  { id: 'imp-6', title: 'Housing Rights & Resources Guide', description: 'Tenant rights, housing assistance programs, and landlord communication', sourceUrl: 'https://docs.example.org/housing-guide', sourceType: 'url', contentType: 'document', stage: '', pillar: '', importedAt: new Date('2026-02-01') },
  { id: 'imp-7', title: 'Mental Health First Aid Certification', description: 'Online certification course for mental health awareness and first response', sourceType: 'url', contentType: 'course', stage: 'crisis', pillar: 'health', importedAt: new Date('2026-02-10'), sourceUrl: 'https://mhfa.example.org/certification' },
];

export default function ModuleBuilder() {
  const [activeTab, setActiveTab] = useState<TabMode>('builder');
  
  // Library tab state
  const [stageFilter, setStageFilter] = useState<FilterType>('all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importMode, setImportMode] = useState<'url' | 'file' | 'manual'>('url');
  const [importUrl, setImportUrl] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [importDesc, setImportDesc] = useState('');
  const [importContentType, setImportContentType] = useState<ImportedItem['contentType']>('course');
  const [isImporting, setIsImporting] = useState(false);
  const [libraryView, setLibraryView] = useState<ViewLayout>('table');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Builder tab state
  const [viewMode, setViewMode] = useState<ViewMode>('module-list');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);
  const [isNewSubModule, setIsNewSubModule] = useState(false);
  const [showEventSelector, setShowEventSelector] = useState<boolean>(false);
  const [eventFilterEngagement, setEventFilterEngagement] = useState<EngagementLevel | ''>('');
  const [showAddContentMenu, setShowAddContentMenu] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showModuleLibrary, setShowModuleLibrary] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [builderStageFilter, setBuilderStageFilter] = useState<FilterType>('all');
  const [builderSearch, setBuilderSearch] = useState('');
  const [moduleListView, setModuleListView] = useState<ViewLayout>('table');

  // Load data
  useEffect(() => {
    const loaded = loadModulesFromStorage();
    setModules(loaded);
    const imports = loadImportsFromStorage();
    setImportedItems(imports.length > 0 ? imports : defaultImportedItems);
  }, []);

  // Save modules
  useEffect(() => {
    if (modules.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveModulesToStorage(modules);
    }
  }, [modules]);

  // Save imports
  useEffect(() => {
    if (importedItems.length > 0) {
      saveImportsToStorage(importedItems);
    }
  }, [importedItems]);

  const getEngagementColor = (engagement: string | undefined) => {
    if (!engagement) return 'bg-gray-500';
    switch (engagement.toLowerCase()) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'crisis': return 'bg-red-100 text-red-700';
      case 'stabilization': return 'bg-yellow-100 text-yellow-700';
      case 'growth': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getStageTone = (stage: string): 'neutral' | 'success' | 'warning' | 'danger' => {
    switch (stage.toLowerCase()) {
      case 'crisis': return 'danger';
      case 'stabilization': return 'warning';
      case 'growth': return 'success';
      default: return 'neutral';
    }
  };

  const getStageLabel = (stage: string) => {
    if (!stage) return 'Untagged';
    switch (stage) {
      case 'crisis': return 'Stage 1: Crisis Entry';
      case 'stabilization': return 'Stage 2: Stabilization';
      case 'growth': return 'Stage 3: Growth/Skill Building';
      default: return stage.charAt(0).toUpperCase() + stage.slice(1);
    }
  };

  const getStageShortLabel = (stage: string) => {
    if (!stage) return 'Untagged';
    switch (stage) {
      case 'crisis': return 'S1: Crisis';
      case 'stabilization': return 'S2: Stabilization';
      case 'growth': return 'S3: Growth';
      default: return stage.charAt(0).toUpperCase() + stage.slice(1);
    }
  };

  // === IMPORT HANDLERS ===
  const handleImportFromUrl = () => {
    if (!importUrl.trim()) { toast.error('Please enter a URL'); return; }
    setIsImporting(true);
    // Simulate scraping delay
    setTimeout(() => {
      const newItem: ImportedItem = {
        id: `imp-${Date.now()}`,
        title: importTitle || `Imported from ${new URL(importUrl).hostname}`,
        description: importDesc || 'Content imported from external URL. Review and tag to organize.',
        sourceUrl: importUrl,
        sourceType: 'url',
        contentType: importContentType,
        stage: '',
        pillar: '',
        importedAt: new Date(),
      };
      setImportedItems(prev => [newItem, ...prev]);
      setImportUrl(''); setImportTitle(''); setImportDesc('');
      setIsImporting(false);
      toast.success('Content imported!', { description: 'Review and tag the imported item to organize it.' });
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImportedItem[] = Array.from(files).map((file, i) => ({
      id: `imp-${Date.now()}-${i}`,
      title: importTitle || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      description: importDesc || `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      sourceType: 'file' as const,
      contentType: importContentType,
      stage: '' as GraduationStage | '',
      pillar: '' as Pillar,
      importedAt: new Date(),
      fileName: file.name,
    }));

    setImportedItems(prev => [...newItems, ...prev]);
    setImportTitle(''); setImportDesc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success(`${newItems.length} file(s) imported!`, { description: 'Review and tag to organize.' });
  };

  const handleManualAdd = () => {
    if (!importTitle.trim()) { toast.error('Please enter a title'); return; }
    const newItem: ImportedItem = {
      id: `imp-${Date.now()}`,
      title: importTitle,
      description: importDesc || 'Manually added content item.',
      sourceType: 'manual',
      contentType: importContentType,
      stage: '',
      pillar: '',
      importedAt: new Date(),
    };
    setImportedItems(prev => [newItem, ...prev]);
    setImportTitle(''); setImportDesc('');
    toast.success('Item added to library!');
  };

  const handleTagItem = (itemId: string, stage: GraduationStage | '', pillar?: Pillar) => {
    setImportedItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, stage, ...(pillar !== undefined ? { pillar } : {}) } : item
    ));
    toast.success('Tag updated');
  };

  const handleDeleteImport = (itemId: string) => {
    setImportedItems(prev => prev.filter(i => i.id !== itemId));
    toast.success('Item removed from library');
  };

  // === MODULE HANDLERS ===
  const handleCreateNewModule = (template?: typeof wizardTemplates[0]) => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: template?.title || '',
      description: template?.description || '',
      stage: template?.stage || '',
      pillar: template?.pillar || '',
      seedsReward: template ? suggestSeeds(template.stage, template.subModules.length) : 0,
      badgeUnlock: template ? suggestBadge(template.title, template.stage) : '',
      headerImage: template ? suggestHeaderImage(template.title, template.stage) : '',
      moduleItems: template
        ? template.subModules.map((sm, i) => ({
            id: `item-${Date.now()}-${i}`,
            itemType: 'submodule' as const,
            order: i,
            subModule: { id: `sub-${Date.now()}-${i}`, title: sm, description: '', contentBlocks: [] },
          }))
        : [],
      status: 'draft',
      createdAt: new Date(),
    };

    setSelectedModule(newModule);
    setViewMode('module-detail');
    setShowWizard(false);
    if (template) {
      toast.success('Module created from template!', { description: 'Customize the details and add content.' });
    }
  };

  const handleSaveModule = () => {
    if (!selectedModule) return;
    if (!selectedModule.title.trim()) { toast.error('Module title is required'); return; }

    const isNew = !modules.find(m => m.id === selectedModule.id);
    if (isNew) {
      setModules([...modules, selectedModule]);
      toast.success('Module created!', { description: `"${selectedModule.title}" has been saved as a draft` });
    } else {
      setModules(modules.map(m => m.id === selectedModule.id ? selectedModule : m));
      toast.success('Module updated!', { description: `Changes to "${selectedModule.title}" have been saved` });
    }
  };

  const handlePublishModule = () => {
    if (!selectedModule) return;
    const publishedModule = { ...selectedModule, status: 'published' as ModuleStatus, publishedAt: new Date() };
    setModules(modules.map(m => m.id === selectedModule.id ? publishedModule : m));
    setSelectedModule(publishedModule);
    toast.success('Module published!', { description: `"${publishedModule.title}" is now available in the Pathway` });
  };

  const handleDeleteModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    setModules(modules.filter(m => m.id !== moduleId));
    if (selectedModule?.id === moduleId) { setSelectedModule(null); setViewMode('module-list'); }
    toast.success('Module deleted', { description: `"${module?.title}" has been removed` });
  };

  const handleAddSubModule = () => {
    if (!selectedModule) return;
    const newSubModule: SubModule = { id: `submodule-${Date.now()}`, title: '', description: '', contentBlocks: [] };
    setSelectedSubModule(newSubModule);
    setIsNewSubModule(true);
    setViewMode('submodule-detail');
  };

  const handleSaveSubModule = () => {
    if (!selectedModule || !selectedSubModule) return;
    if (!selectedSubModule.title.trim()) { toast.error('Sub-module title is required'); return; }

    const newItem: ModuleItem = {
      id: `item-${Date.now()}`,
      itemType: 'submodule',
      order: selectedModule.moduleItems.length,
      subModule: selectedSubModule,
    };

    if (isNewSubModule) {
      const updatedModule = { ...selectedModule, moduleItems: [...selectedModule.moduleItems, newItem] };
      setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
      setSelectedModule(updatedModule);
      toast.success('Sub-module added!');
    } else {
      const updatedModule = {
        ...selectedModule,
        moduleItems: selectedModule.moduleItems.map(item =>
          item.subModule?.id === selectedSubModule.id ? { ...item, subModule: selectedSubModule } : item
        ),
      };
      setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
      setSelectedModule(updatedModule);
      toast.success('Sub-module updated!');
    }

    setViewMode('module-detail');
    setSelectedSubModule(null);
    setIsNewSubModule(false);
  };

  const handleAddEvent = (event: typeof mockEvents[0]) => {
    if (!selectedModule) return;
    const eventBlock: ContentBlock = { id: `block-${Date.now()}`, type: 'event', eventId: event.id, eventTitle: event.title, eventEngagement: event.engagement };
    const newItem: ModuleItem = { id: `item-${Date.now()}`, itemType: 'event', order: selectedModule.moduleItems.length, eventBlock };
    const updatedModule = { ...selectedModule, moduleItems: [...selectedModule.moduleItems, newItem] };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    setSelectedModule(updatedModule);
    setShowEventSelector(false);
    toast.success('Event added to module!');
  };

  const addResourceToModule = (resource: Resource) => {
    if (!selectedModule) { toast.error('Please select a module first'); return; }
    const newItem: ModuleItem = { id: `item-${Date.now()}`, itemType: 'resource', order: selectedModule.moduleItems.length, resource };
    const updatedModule = { ...selectedModule, moduleItems: [...selectedModule.moduleItems, newItem] };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    setSelectedModule(updatedModule);
    toast.success('Resource added to module!');
  };

  const handleAddLibrarySubModule = (_libModule: any, subModule: any) => {
    if (!selectedModule) return;
    const newSubModule: SubModule = { id: `submodule-${Date.now()}`, title: subModule.title, description: subModule.description, contentBlocks: [] };
    const newItem: ModuleItem = { id: `item-${Date.now()}`, itemType: 'submodule', order: selectedModule.moduleItems.length, subModule: newSubModule };
    const updatedModule = { ...selectedModule, moduleItems: [...selectedModule.moduleItems, newItem] };
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    setSelectedModule(updatedModule);
    toast.success('Sub-module added from library!');
  };

  const handleAddContentBlock = (type: BlockType) => {
    if (!selectedSubModule) return;
    const newBlock: ContentBlock = { id: `block-${Date.now()}`, type, question: '', options: type === 'multiple-choice' ? ['', '', '', ''] : undefined };
    setSelectedSubModule({ ...selectedSubModule, contentBlocks: [...selectedSubModule.contentBlocks, newBlock] });
    setShowAddContentMenu(false);
    toast.success('Lesson added!');
  };

  const handleUpdateContentBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    if (!selectedSubModule) return;
    setSelectedSubModule({ ...selectedSubModule, contentBlocks: selectedSubModule.contentBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b) });
  };

  const handleDeleteContentBlock = (blockId: string) => {
    if (!selectedSubModule) return;
    setSelectedSubModule({ ...selectedSubModule, contentBlocks: selectedSubModule.contentBlocks.filter(b => b.id !== blockId) });
    toast.success('Lesson removed');
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!selectedModule) return;
    const newItems = [...selectedModule.moduleItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    newItems.forEach((item, i) => item.order = i);
    const updatedModule = { ...selectedModule, moduleItems: newItems };
    setSelectedModule(updatedModule);
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedModule) return;
    const updatedModule = { ...selectedModule, moduleItems: selectedModule.moduleItems.filter(item => item.id !== itemId) };
    setSelectedModule(updatedModule);
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    toast.success('Item removed from module');
  };

  // Auto-suggest description on title change
  const handleTitleBlur = () => {
    if (selectedModule && selectedModule.title.trim() && !selectedModule.description.trim()) {
      const suggested = suggestDescription(selectedModule.title, selectedModule.stage);
      setSelectedModule({ ...selectedModule, description: suggested });
    }
  };

  // Filter library items
  const filteredImports = importedItems.filter(item => {
    const matchesStage = stageFilter === 'all' ? true : stageFilter === 'untagged' ? !item.stage : item.stage === stageFilter;
    const matchesSearch = !librarySearch || item.title.toLowerCase().includes(librarySearch.toLowerCase()) || item.description.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesStage && matchesSearch;
  });

  // Also include existing resources in the library view
  const filteredResources = resources.filter(resource => {
    const matchesStage = stageFilter === 'all' || stageFilter === 'untagged' ? stageFilter === 'all' : resource.stage.toLowerCase() === stageFilter;
    const matchesSearch = !librarySearch || resource.title.toLowerCase().includes(librarySearch.toLowerCase()) || resource.description.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesStage && matchesSearch;
  });

  // Filter builder modules
  const filteredModules = modules.filter(m => {
    const matchesStage = builderStageFilter === 'all' ? true : builderStageFilter === 'untagged' ? !m.stage : m.stage === builderStageFilter;
    const matchesSearch = !builderSearch || m.title.toLowerCase().includes(builderSearch.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Module Builder</h1>
        <p className="text-gray-500 mt-1">Import, organize, and build learning pathways from your content library</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('builder')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'builder' ? 'border-border text-foreground' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Module Builder
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'library' ? 'border-border text-foreground' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content Library
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'library' ? (
          /* ====================== LIBRARY TAB ====================== */
          <div className="p-8">
            {/* Import Panel Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Content Library</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {importedItems.length} imported items + {resources.length} existing resources
                </p>
              </div>
              <button
                onClick={() => setShowImportPanel(!showImportPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  showImportPanel ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <Upload className="w-4 h-4" />
                {showImportPanel ? 'Close Import' : 'Import Content'}
              </button>
            </div>

            {/* Import Panel */}
            {showImportPanel && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Import Content</h3>
                
                {/* Import Mode Tabs */}
                <div className="flex gap-2 mb-5">
                  {([
                    { key: 'url' as const, icon: Globe, label: 'From URL' },
                    { key: 'file' as const, icon: FileUp, label: 'Upload File' },
                    { key: 'manual' as const, icon: Type, label: 'Manual Entry' },
                  ]).map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => setImportMode(mode.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        importMode === mode.key ? 'bg-secondary text-foreground border border-border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* URL Import */}
                {importMode === 'url' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL to scrape</label>
                      <input
                        type="url"
                        value={importUrl}
                        onChange={e => setImportUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="https://courses.example.org/financial-literacy"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional, auto-detected)</label>
                        <input type="text" value={importTitle} onChange={e => setImportTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                          placeholder="Will auto-detect from page" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select value={importContentType} onChange={e => setImportContentType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm">
                          <option value="course">Course</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                          <option value="quiz">Quiz</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                      <textarea value={importDesc} onChange={e => setImportDesc(e.target.value)} rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="Brief description of the content" />
                    </div>
                    <button onClick={handleImportFromUrl} disabled={isImporting}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium">
                      {isImporting ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scraping...</>
                      ) : (
                        <><Globe className="w-4 h-4" /> Import from URL</>
                      )}
                    </button>
                  </div>
                )}

                {/* File Upload */}
                {importMode === 'file' && (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-border transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}>
                      <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, CSV, JSON, ZIP, MP4, DOCX</p>
                      <input ref={fileInputRef} type="file" multiple accept=".pdf,.csv,.json,.zip,.mp4,.docx,.xlsx,.pptx" className="hidden" onChange={handleFileUpload} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                        <input type="text" value={importTitle} onChange={e => setImportTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                          placeholder="Will use filename if blank" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select value={importContentType} onChange={e => setImportContentType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm">
                          <option value="course">Course</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                          <option value="quiz">Quiz</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Entry */}
                {importMode === 'manual' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input type="text" value={importTitle} onChange={e => setImportTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                          placeholder="Content title" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select value={importContentType} onChange={e => setImportContentType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm">
                          <option value="course">Course</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                          <option value="quiz">Quiz</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={importDesc} onChange={e => setImportDesc(e.target.value)} rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="Describe this content" />
                    </div>
                    <button onClick={handleManualAdd}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" /> Add to Library
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={librarySearch} onChange={e => setLibrarySearch(e.target.value)}
                    placeholder="Search library..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Stage:</span>
                  <div className="flex gap-1.5">
                    {(['all', 'crisis', 'stabilization', 'growth', 'untagged'] as FilterType[]).map(stage => (
                      <button key={stage} onClick={() => setStageFilter(stage)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          stageFilter === stage ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        {stage === 'all' ? 'All' : getStageShortLabel(stage)}
                      </button>
                    ))}
                  </div>
                  <div className="ml-3 flex items-center bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setLibraryView('table')}
                      className={`p-1.5 rounded transition-colors ${libraryView === 'table' ? 'bg-white text-foreground shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button onClick={() => setLibraryView('grid')}
                      className={`p-1.5 rounded transition-colors ${libraryView === 'grid' ? 'bg-white text-foreground shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Imported Items Section */}
            {filteredImports.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Imported Content ({filteredImports.length})
                </h3>
                {libraryView === 'table' ? (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Imported</th>
                          <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredImports.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{item.description}</div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium capitalize">{item.contentType}</span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                {item.sourceType === 'url' && <Globe className="w-3.5 h-3.5" />}
                                {item.sourceType === 'file' && <FileUp className="w-3.5 h-3.5" />}
                                {item.sourceType === 'manual' && <Type className="w-3.5 h-3.5" />}
                                <span className="capitalize">{item.sourceType}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <select
                                value={item.stage}
                                onChange={e => handleTagItem(item.id, e.target.value as GraduationStage | '')}
                                className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${getStageBadgeColor(item.stage || 'untagged')}`}
                              >
                                <option value="">Untagged</option>
                                <option value="crisis">S1: Crisis Entry</option>
                                <option value="stabilization">S2: Stabilization</option>
                                <option value="growth">S3: Growth/Skill Building</option>
                              </select>
                            </td>
                            <td className="px-5 py-3 text-xs text-gray-500">
                              {new Date(item.importedAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button onClick={() => handleDeleteImport(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredImports.map(item => (
                      <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium capitalize">{item.contentType}</span>
                          <select value={item.stage} onChange={e => handleTagItem(item.id, e.target.value as GraduationStage | '')}
                            className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${getStageBadgeColor(item.stage || 'untagged')}`}>
                            <option value="">Untagged</option>
                            <option value="crisis">S1: Crisis Entry</option>
                            <option value="stabilization">S2: Stabilization</option>
                            <option value="growth">S3: Growth/Skill Building</option>
                          </select>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            {item.sourceType === 'url' && <Globe className="w-3 h-3" />}
                            {item.sourceType === 'file' && <FileUp className="w-3 h-3" />}
                            {item.sourceType === 'manual' && <Type className="w-3 h-3" />}
                            <span className="capitalize">{item.sourceType}</span>
                          </div>
                          <button onClick={() => handleDeleteImport(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Existing Resources Section */}
            {filteredResources.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Existing Resources ({filteredResources.length})
                </h3>
                {libraryView === 'table' ? (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pillar</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Seeds</th>
                          <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredResources.map(resource => (
                          <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-medium text-gray-900 text-sm">{resource.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{resource.description}</div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium capitalize">{resource.type}</span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600 capitalize">{resource.pillar}</td>
                            <td className="px-5 py-3">
                              <StatusBadge tone={getStageTone(resource.stage)}>
                                {resource.stage}
                              </StatusBadge>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">{resource.seedsValue}</td>
                            <td className="px-5 py-3 text-right">
                              <button onClick={() => addResourceToModule(resource)}
                                className="text-foreground hover:text-foreground text-xs font-medium">
                                + Add to Module
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map(resource => (
                      <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium capitalize">{resource.type}</span>
                          <StatusBadge tone={getStageTone(resource.stage)}>{resource.stage}</StatusBadge>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{resource.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">{resource.seedsValue} Seeds</span>
                          <button onClick={() => addResourceToModule(resource)}
                            className="text-foreground hover:text-foreground text-xs font-medium">+ Add to Module</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {filteredImports.length === 0 && filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No content found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          /* ====================== BUILDER TAB ====================== */
          <div className="p-8">
            {viewMode === 'module-list' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">All Modules</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{modules.length} total modules across all stages</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowWizard(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      <Wand2 className="w-4 h-4" /> Module Wizard
                    </button>
                    <button onClick={() => handleCreateNewModule()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" /> New Module
                    </button>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={builderSearch} onChange={e => setBuilderSearch(e.target.value)}
                        placeholder="Search modules..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Stage:</span>
                      <div className="flex gap-1.5">
                        {(['all', 'crisis', 'stabilization', 'growth', 'untagged'] as FilterType[]).map(stage => (
                          <button key={stage} onClick={() => setBuilderStageFilter(stage)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              builderStageFilter === stage ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>
                            {stage === 'all' ? 'All' : getStageShortLabel(stage)}
                          </button>
                        ))}
                      </div>
                      <div className="ml-3 flex items-center bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setModuleListView('table')}
                          className={`p-1.5 rounded transition-colors ${moduleListView === 'table' ? 'bg-white text-foreground shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                          <LayoutList className="w-4 h-4" />
                        </button>
                        <button onClick={() => setModuleListView('grid')}
                          className={`p-1.5 rounded transition-colors ${moduleListView === 'grid' ? 'bg-white text-foreground shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                          <Grid className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module List */}
                {filteredModules.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                    <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">{modules.length === 0 ? 'No modules yet' : 'No modules match your filters'}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      {modules.length === 0 ? 'Create your first module or use the wizard to get started' : 'Try adjusting your search or stage filter'}
                    </p>
                    {modules.length === 0 && (
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setShowWizard(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                          <Wand2 className="w-4 h-4" /> Use Wizard
                        </button>
                        <button onClick={() => handleCreateNewModule()}
                          className="text-foreground hover:text-foreground font-medium text-sm">
                          Create blank module
                        </button>
                      </div>
                    )}
                  </div>
                ) : moduleListView === 'table' ? (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredModules.map(module => (
                          <tr key={module.id}
                            onClick={() => { setSelectedModule(module); setViewMode('module-detail'); }}
                            className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-5 py-3">
                              <div className="font-medium text-gray-900 text-sm">{module.title || 'Untitled Module'}</div>
                              <div className="text-xs text-gray-500 mt-0.5 max-w-sm truncate">{module.description || 'No description'}</div>
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge tone={getStageTone(module.stage || 'untagged')}>
                                {getStageLabel(module.stage)}
                              </StatusBadge>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">{module.moduleItems.length}</td>
                            <td className="px-5 py-3">
                              <StatusBadge tone={module.status === 'published' ? 'success' : 'neutral'}>{module.status}</StatusBadge>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">{new Date(module.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-3 text-right" onClick={e => e.stopPropagation()}>
                              <button onClick={() => { if (window.confirm(`Delete "${module.title || 'Untitled'}"?`)) handleDeleteModule(module.id); }}
                                className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredModules.map(module => (
                      <div key={module.id}
                        onClick={() => { setSelectedModule(module); setViewMode('module-detail'); }}
                        className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        {module.headerImage && (
                          <div className="h-28 w-full overflow-hidden bg-gray-100">
                            <ImageWithFallback src={module.headerImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <StatusBadge tone={getStageTone(module.stage || 'untagged')}>
                            {getStageLabel(module.stage)}
                          </StatusBadge>
                          <StatusBadge tone={module.status === 'published' ? 'success' : 'neutral'}>{module.status}</StatusBadge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{module.title || 'Untitled Module'}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{module.description || 'No description'}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                          <span>{module.moduleItems.length} items</span>
                          <span>{new Date(module.createdAt).toLocaleDateString()}</span>
                        </div>
                        </div>{/* close p-5 */}
                      </div>
                    ))}
                  </div>
                )}

                {/* Wizard Modal */}
                {showWizard && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                              <Wand2 className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Module Wizard</h3>
                              <p className="text-sm text-gray-500">Choose a template to get started quickly</p>
                            </div>
                          </div>
                          <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {wizardTemplates.map((template, i) => (
                            <button key={i} onClick={() => handleCreateNewModule(template)}
                              className="text-left p-5 border-2 border-gray-200 rounded-lg hover:border-border hover:bg-accent/30 transition-all group">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusBadge tone={getStageTone(template.stage)}>
                                  {template.stage}
                                </StatusBadge>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">{template.pillar}</span>
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-foreground transition-colors">{template.title}</h4>
                              <p className="text-xs text-gray-500 mb-3">{template.description}</p>
                              <div className="text-xs text-gray-400">
                                {template.subModules.length} sub-modules: {template.subModules.join(', ')}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <p className="text-sm text-gray-600 mb-2">Want to start from scratch?</p>
                          <button onClick={() => { handleCreateNewModule(); setShowWizard(false); }}
                            className="text-foreground hover:text-foreground font-medium text-sm">
                            Create blank module
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {viewMode === 'module-detail' && selectedModule && (
              <ModuleDetail
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                modules={modules}
                setModules={setModules}
                setViewMode={setViewMode}
                handleSaveModule={handleSaveModule}
                handlePublishModule={handlePublishModule}
                handleAddSubModule={handleAddSubModule}
                handleAddEvent={handleAddEvent}
                handleMoveItem={handleMoveItem}
                handleDeleteItem={handleDeleteItem}
                showEventSelector={showEventSelector}
                setShowEventSelector={setShowEventSelector}
                eventFilterEngagement={eventFilterEngagement}
                setEventFilterEngagement={setEventFilterEngagement}
                mockEvents={mockEvents}
                getEngagementColor={getEngagementColor}
                setSelectedSubModule={setSelectedSubModule}
                setIsNewSubModule={setIsNewSubModule}
                showAddMenu={showAddMenu}
                setShowAddMenu={setShowAddMenu}
                showModuleLibrary={showModuleLibrary}
                setShowModuleLibrary={setShowModuleLibrary}
                handleAddLibrarySubModule={handleAddLibrarySubModule}
                moduleLibrary={moduleLibrary}
                addResourceToModule={addResourceToModule}
                resources={resources}
                getStageBadgeColor={getStageBadgeColor}
                getStageLabel={getStageLabel}
                handleTitleBlur={handleTitleBlur}
              />
            )}

            {viewMode === 'submodule-detail' && selectedSubModule && (
              <SubModuleDetail
                selectedSubModule={selectedSubModule}
                setSelectedSubModule={setSelectedSubModule}
                isNewSubModule={isNewSubModule}
                setViewMode={setViewMode}
                handleSaveSubModule={handleSaveSubModule}
                showAddContentMenu={showAddContentMenu}
                setShowAddContentMenu={setShowAddContentMenu}
                handleAddContentBlock={handleAddContentBlock}
                handleUpdateContentBlock={handleUpdateContentBlock}
                handleDeleteContentBlock={handleDeleteContentBlock}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ====================== MODULE DETAIL COMPONENT ======================
function ModuleDetail({
  selectedModule, setSelectedModule, modules, setModules,
  setViewMode, handleSaveModule, handlePublishModule,
  handleAddSubModule, handleAddEvent, handleMoveItem, handleDeleteItem,
  showEventSelector, setShowEventSelector,
  eventFilterEngagement, setEventFilterEngagement,
  mockEvents, getEngagementColor,
  setSelectedSubModule, setIsNewSubModule,
  showAddMenu, setShowAddMenu,
  showModuleLibrary, setShowModuleLibrary,
  handleAddLibrarySubModule, moduleLibrary,
  addResourceToModule, resources,
  getStageBadgeColor, getStageLabel,
  handleTitleBlur,
}: any) {
  const { showASSA } = useFramework();
  const [showSmartSuggest, setShowSmartSuggest] = useState(false);

  const getStageTone = (stage: string): 'neutral' | 'success' | 'warning' | 'danger' => {
    switch ((stage || '').toLowerCase()) {
      case 'crisis': return 'danger';
      case 'stabilization': return 'warning';
      case 'growth': return 'success';
      default: return 'neutral';
    }
  };

  const stageASSAInfo: Record<string, { primary: string; tips: string[] }> = {
    crisis: {
      primary: 'Security & Belonging',
      tips: [
        'Focus on immediate safety and basic needs (Security)',
        'Low-barrier content to build trust (Belonging)',
        'Simple, clear steps — avoid overwhelming complexity',
      ],
    },
    stabilization: {
      primary: 'Security & Agency',
      tips: [
        'Maintain stability with structured routines (Security)',
        'Introduce skill-building content (Agency)',
        'Set achievable milestones to build confidence',
      ],
    },
    growth: {
      primary: 'Agency & Importance',
      tips: [
        'Advanced skills and leadership training (Agency)',
        'Opportunities to mentor and give back (Importance)',
        'Challenge members with real-world application',
      ],
    },
  };

  const currentASSA = selectedModule.stage ? stageASSAInfo[selectedModule.stage] : null;

  // Smart suggestion for the current module
  const getStageSuggestions = () => {
    if (!selectedModule.stage) return [];
    const stageLib = moduleLibrary[selectedModule.stage];
    if (!stageLib) return [];
    return stageLib.flatMap((m: any) => m.subModules.map((sm: any) => ({ ...sm, parentTitle: m.title })));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setViewMode('module-list')} className="text-gray-600 hover:text-gray-900 text-sm">
          ← Back to Modules
        </button>
        <div className="flex items-center gap-3">
          <StatusBadge tone={selectedModule.status === 'published' ? 'success' : 'neutral'} className="text-sm px-3 py-1">
            {selectedModule.status === 'published' ? 'Published' : 'Draft'}
          </StatusBadge>
          <button onClick={handleSaveModule}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <Save className="w-4 h-4" /> Save
          </button>
          {selectedModule.status !== 'published' && (
            <button onClick={handlePublishModule}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
              <Send className="w-4 h-4" /> Publish
            </button>
          )}
        </div>
      </div>

      {/* BIAS Framework Tip (contextual) */}
      {showASSA && currentASSA && (
        <div className={`mb-4 p-4 rounded-lg border ${
          selectedModule.stage === 'crisis' ? 'bg-red-50 border-red-200' :
          selectedModule.stage === 'stabilization' ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">BIAS Focus: {currentASSA.primary}</span>
          </div>
          <ul className="space-y-1">
            {currentASSA.tips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="mt-0.5">-</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Module Details Form */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        {/* Header Image */}
        <div className="relative group">
          {selectedModule.headerImage ? (
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={selectedModule.headerImage}
                alt="Module header"
                className="w-full h-full object-cover"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    const url = prompt('Enter image URL:', selectedModule.headerImage);
                    if (url !== null) setSelectedModule({ ...selectedModule, headerImage: url });
                  }}
                  className="px-3 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Change
                </button>
                <button
                  onClick={() => {
                    const suggested = suggestHeaderImage(selectedModule.title || '', selectedModule.stage || '');
                    setSelectedModule({ ...selectedModule, headerImage: suggested });
                    toast.success('Header image suggested!');
                  }}
                  className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Suggest
                </button>
                <button
                  onClick={() => setSelectedModule({ ...selectedModule, headerImage: '' })}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-lg flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="h-36 w-full bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) setSelectedModule({ ...selectedModule, headerImage: url });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" /> Add Header Image
                </button>
                <button
                  onClick={() => {
                    const suggested = suggestHeaderImage(selectedModule.title || '', selectedModule.stage || '');
                    setSelectedModule({ ...selectedModule, headerImage: suggested });
                    toast.success('Header image suggested!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Suggest Image
                </button>
              </div>
              <p className="text-xs text-gray-400">Displayed as the module cover in member-facing views</p>
            </div>
          )}
        </div>

        <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Module Details</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
            <input type="text" value={selectedModule.title}
              onChange={e => setSelectedModule({ ...selectedModule, title: e.target.value })}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="e.g., Financial Literacy Fundamentals" />
          </div>

          {/* Description with auto-fill note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              {selectedModule.title && !selectedModule.description && (
                <span className="text-xs text-foreground italic">Auto-fills when you enter a title</span>
              )}
            </div>
            <textarea value={selectedModule.description}
              onChange={e => setSelectedModule({ ...selectedModule, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="What will members learn?" />
          </div>

          {/* Stage & Pillar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Stage</label>
              <select value={selectedModule.stage}
                onChange={e => setSelectedModule({ ...selectedModule, stage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option value="">Untagged</option>
                <option value="crisis">Stage 1: Crisis Entry</option>
                <option value="stabilization">Stage 2: Stabilization</option>
                <option value="growth">Stage 3: Growth/Skill Building</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pillar</label>
              <select value={selectedModule.pillar}
                onChange={e => setSelectedModule({ ...selectedModule, pillar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                <option value="">None</option>
                <option value="finance">Finance</option>
                <option value="health">Health</option>
                <option value="nutrition">Nutrition</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          {/* Seeds & Badge with Suggest buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Seeds Reward</label>
                <button onClick={() => {
                  const suggested = suggestSeeds(selectedModule.stage, selectedModule.moduleItems.length);
                  setSelectedModule({ ...selectedModule, seedsReward: suggested });
                  toast.success(`Suggested ${suggested} seeds`);
                }}
                  className="flex items-center gap-1 text-xs text-foreground hover:text-foreground font-medium">
                  <Sparkles className="w-3 h-3" /> Suggest
                </button>
              </div>
              <input type="number" value={selectedModule.seedsReward}
                onChange={e => setSelectedModule({ ...selectedModule, seedsReward: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Badge Unlock</label>
                <button onClick={() => {
                  const suggested = suggestBadge(selectedModule.title || 'Module', selectedModule.stage);
                  setSelectedModule({ ...selectedModule, badgeUnlock: suggested });
                  toast.success(`Suggested: ${suggested}`);
                }}
                  className="flex items-center gap-1 text-xs text-foreground hover:text-foreground font-medium">
                  <Sparkles className="w-3 h-3" /> Suggest
                </button>
              </div>
              <input type="text" value={selectedModule.badgeUnlock}
                onChange={e => setSelectedModule({ ...selectedModule, badgeUnlock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="e.g., Budget Master" />
            </div>
          </div>
        </div>
        </div>{/* close p-6 wrapper */}
      </div>

      {/* Module Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Module Content ({selectedModule.moduleItems.length} items)</h3>
          <div className="flex items-center gap-2">
            {/* Smart Suggest Toggle */}
            <button onClick={() => setShowSmartSuggest(!showSmartSuggest)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showSmartSuggest ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground hover:bg-accent'
              }`}>
              <Sparkles className="w-4 h-4" /> Smart Suggest
            </button>

            {/* Unified Add Button */}
            <div className="relative">
              <button onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" /> Add
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showAddMenu && (
                <>
                  <div className="fixed inset-0 z-[100]" onClick={() => setShowAddMenu(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-[101]">
                    <button onClick={() => { handleAddSubModule(); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                      <Layers className="w-4 h-4 text-foreground" /> Sub-module
                    </button>
                    <button onClick={() => { setShowEventSelector(true); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-foreground" /> Event
                    </button>
                    <button onClick={() => { setShowModuleLibrary(true); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                      <BookOpen className="w-4 h-4 text-foreground" /> From Template Library
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Smart Suggestions Panel */}
        {showSmartSuggest && (
          <div className="mb-4 p-4 bg-secondary border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-foreground" />
                <h4 className="font-medium text-foreground text-sm">
                  Suggested content for {selectedModule.stage ? `${getStageLabel(selectedModule.stage)} stage` : 'this module'}
                </h4>
              </div>
              <button onClick={() => setShowSmartSuggest(false)} className="text-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedModule.stage ? (
              <div className="space-y-2 max-h-48 overflow-auto">
                {getStageSuggestions().slice(0, 8).map((sm: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-border">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-sm font-medium text-gray-900">{sm.title}</div>
                      <div className="text-xs text-gray-500 truncate">{sm.description}</div>
                    </div>
                    <button onClick={() => handleAddLibrarySubModule({ title: sm.parentTitle }, sm)}
                      className="px-2.5 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors shrink-0">
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground">Select a graduation stage above to get contextual suggestions.</p>
            )}
          </div>
        )}

        {/* Content Items */}
        {selectedModule.moduleItems.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Layers className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No content added yet</p>
            <p className="text-sm text-gray-400">Click <span className="font-medium">+ Add</span> to start building your module</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedModule.moduleItems.map((item: ModuleItem, index: number) => (
              <div key={item.id}
                onClick={() => {
                  if (item.itemType === 'submodule' && item.subModule) {
                    setSelectedSubModule(item.subModule);
                    setIsNewSubModule(false);
                    setViewMode('submodule-detail');
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 transition-all ${
                  item.itemType === 'submodule' ? 'cursor-pointer hover:bg-gray-100 hover:border-gray-300' : ''
                }`}>
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={e => { e.stopPropagation(); handleMoveItem(index, 'up'); }} disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleMoveItem(index, 'down'); }}
                    disabled={index === selectedModule.moduleItems.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-xs font-medium text-gray-400 w-6 text-center">{index + 1}</span>

                {/* Type Badge & Info */}
                <div className="flex-1 min-w-0">
                  {item.itemType === 'submodule' && item.subModule && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-secondary text-foreground rounded text-xs font-medium shrink-0">Sub-module</span>
                      <span className="font-medium text-gray-900 text-sm truncate">{item.subModule.title || 'Untitled'}</span>
                      <span className="text-xs text-gray-400 shrink-0">{item.subModule.contentBlocks.length} lessons</span>
                    </div>
                  )}
                  {item.itemType === 'event' && item.eventBlock && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium shrink-0">Event</span>
                      <span className="font-medium text-gray-900 text-sm truncate">{item.eventBlock.eventTitle}</span>
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getEngagementColor(item.eventBlock.eventEngagement)}`} />
                    </div>
                  )}
                  {item.itemType === 'resource' && item.resource && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-secondary text-foreground rounded text-xs font-medium shrink-0">Resource</span>
                      <span className="font-medium text-gray-900 text-sm truncate">{item.resource.title}</span>
                      <span className="text-xs text-gray-400 shrink-0">{item.resource.seedsValue} seeds</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.itemType === 'submodule' && (
                    <button onClick={e => { e.stopPropagation(); setSelectedSubModule(item.subModule!); setIsNewSubModule(false); setViewMode('submodule-detail'); }}
                      className="p-1.5 text-foreground hover:text-foreground hover:bg-accent rounded transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); handleDeleteItem(item.id); }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Selector Modal */}
      {showEventSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add Event to Module</h3>
                <button onClick={() => setShowEventSelector(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <div className="flex gap-1.5">
                  {(['', 'red', 'yellow', 'green'] as const).map(level => (
                    <button key={level || 'all'} onClick={() => setEventFilterEngagement(level)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        eventFilterEngagement === level ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>{level || 'All'}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-2">
              {mockEvents.filter((e: any) => !eventFilterEngagement || e.engagement === eventFilterEngagement).map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-border transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={`w-2.5 h-2.5 rounded-full ${getEngagementColor(event.engagement)}`} />
                      <span className="capitalize">{event.engagement}</span>
                      <span>-</span>
                      <span>{event.type}</span>
                    </div>
                  </div>
                  <button onClick={() => handleAddEvent(event)}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Template Library Modal */}
      {showModuleLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Template Library</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Add pre-built sub-modules to your module</p>
                </div>
                <button onClick={() => setShowModuleLibrary(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {Object.entries(moduleLibrary).map(([stage, stageModules]: [string, any]) => (
                <div key={stage}>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <StatusBadge tone={getStageTone(stage)}>{getStageLabel(stage)}</StatusBadge>
                  </h4>
                  <div className="space-y-3">
                    {stageModules.map((libModule: any, libIndex: number) => (
                      <div key={libIndex} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 text-sm mb-2">{libModule.title}</h5>
                        <div className="space-y-1.5">
                          {libModule.subModules.map((subMod: any, subIndex: number) => (
                            <div key={subIndex} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0 mr-3">
                                <div className="text-sm text-gray-900">{subMod.title}</div>
                                <div className="text-xs text-gray-500 truncate">{subMod.description}</div>
                              </div>
                              <button onClick={() => handleAddLibrarySubModule(libModule, subMod)}
                                className="px-2.5 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors shrink-0">
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setShowModuleLibrary(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================== SUB-MODULE DETAIL COMPONENT ======================
function SubModuleDetail({
  selectedSubModule, setSelectedSubModule,
  isNewSubModule, setViewMode,
  handleSaveSubModule,
  showAddContentMenu, setShowAddContentMenu,
  handleAddContentBlock, handleUpdateContentBlock, handleDeleteContentBlock,
}: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setViewMode('module-detail'); setSelectedSubModule(null); }}
          className="text-gray-600 hover:text-gray-900 text-sm">
          ← Back to Module
        </button>
        <button onClick={handleSaveSubModule}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
          <Save className="w-4 h-4" /> {isNewSubModule ? 'Add Sub-module' : 'Update Sub-module'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sub-module Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={selectedSubModule.title}
              onChange={e => setSelectedSubModule({ ...selectedSubModule, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="e.g., Understanding Credit Scores" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={selectedSubModule.description}
              onChange={e => setSelectedSubModule({ ...selectedSubModule, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="What will this sub-module cover?" />
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Lessons ({selectedSubModule.contentBlocks.length})</h3>
          <div className="relative">
            <button onClick={() => setShowAddContentMenu(!showAddContentMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
            {showAddContentMenu && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowAddContentMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-[101]">
                  <button onClick={() => handleAddContentBlock('media')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                    <Video className="w-4 h-4 text-gray-600" /> Media (Video/Audio)
                  </button>
                  <button onClick={() => handleAddContentBlock('multiple-choice')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                    <HelpCircle className="w-4 h-4 text-gray-600" /> Multiple Choice
                  </button>
                  <button onClick={() => handleAddContentBlock('text-input')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                    <Type className="w-4 h-4 text-gray-600" /> Text Input
                  </button>
                  <button onClick={() => handleAddContentBlock('checkbox')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                    <CheckSquare className="w-4 h-4 text-gray-600" /> Checkbox
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedSubModule.contentBlocks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-1">No lessons yet</p>
            <p className="text-sm text-gray-400">Click "Add Lesson" to create your first lesson</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedSubModule.contentBlocks.map((block: ContentBlock, index: number) => (
              <div key={block.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium capitalize">
                      {block.type.replace('-', ' ')}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteContentBlock(block.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {block.type === 'media' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                      <input type="text" value={block.mediaUrl || ''}
                        onChange={e => handleUpdateContentBlock(block.id, { mediaUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                      <select value={block.mediaType || 'video'}
                        onChange={e => handleUpdateContentBlock(block.id, { mediaType: e.target.value as 'video' | 'audio' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm">
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                  </div>
                )}

                {block.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input type="text" value={block.question || ''}
                        onChange={e => handleUpdateContentBlock(block.id, { question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="Enter your question..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                      {(block.options || []).map((option: string, optIndex: number) => (
                        <input key={optIndex} type="text" value={option}
                          onChange={e => {
                            const newOptions = [...(block.options || [])];
                            newOptions[optIndex] = e.target.value;
                            handleUpdateContentBlock(block.id, { options: newOptions });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm mb-2"
                          placeholder={`Option ${optIndex + 1}`} />
                      ))}
                    </div>
                  </div>
                )}

                {(block.type === 'text-input' || block.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question/Label</label>
                    <input type="text" value={block.question || ''}
                      onChange={e => handleUpdateContentBlock(block.id, { question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                      placeholder="Enter question or label..." />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
