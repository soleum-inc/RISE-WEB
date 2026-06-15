import { useState } from 'react';
import { User, Crosshair as Radar, EyeSlash as EyeOff, Bell, FileText, Wheelchair as Accessibility, Buildings as Building2, Heart, ChartBar as BarChart3, Users, Shield, UserGear as UserCog, Question as HelpCircle, SealCheck as BadgeCheck, CaretRight as ChevronRight, CaretDown as ChevronDown } from "@phosphor-icons/react";

import {
  BeneficiaryProfileIdentity,
  BeneficiaryNeedsMatching,
  BeneficiaryPrivacyData,
  BeneficiaryNotifications,
  BeneficiaryDocumentsRecords,
  BeneficiaryAccessibility,
} from '../components/settings/BeneficiarySettings';

import {
  GiverProfileOrganization,
  GiverGivingPreferences,
  GiverTransparencyReporting,
  GiverNotifications,
  GiverTeamAccess,
} from '../components/settings/GiverSettings';

import {
  SharedSecurity,
  SharedAccountManagement,
  SharedSupport,
  SharedTrustVerification,
} from '../components/settings/SharedSettings';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    id: 'beneficiary',
    label: 'Beneficiary Settings',
    color: 'text-brand-700',
    bgColor: 'bg-brand-50',
    items: [
      { id: 'ben-profile', label: 'Profile & Identity', icon: <User className="w-4 h-4" /> },
      { id: 'ben-matching', label: 'Needs & Matching', icon: <Radar className="w-4 h-4" /> },
      { id: 'ben-privacy', label: 'Privacy & Data', icon: <EyeOff className="w-4 h-4" /> },
      { id: 'ben-notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
      { id: 'ben-documents', label: 'Documents & Records', icon: <FileText className="w-4 h-4" /> },
      { id: 'ben-accessibility', label: 'Accessibility & Experience', icon: <Accessibility className="w-4 h-4" /> },
    ],
  },
  {
    id: 'giver',
    label: 'Giver Settings',
    color: 'text-brand-700',
    bgColor: 'bg-brand-50',
    items: [
      { id: 'giv-profile', label: 'Profile & Organization', icon: <Building2 className="w-4 h-4" /> },
      { id: 'giv-preferences', label: 'Giving Preferences', icon: <Heart className="w-4 h-4" /> },
      { id: 'giv-reporting', label: 'Transparency & Reporting', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'giv-notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
      { id: 'giv-team', label: 'Team & Access', icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    id: 'shared',
    label: 'App-Level Settings',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    items: [
      { id: 'shared-security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
      { id: 'shared-account', label: 'Account Management', icon: <UserCog className="w-4 h-4" /> },
      { id: 'shared-support', label: 'Support', icon: <HelpCircle className="w-4 h-4" /> },
      { id: 'shared-trust', label: 'Trust & Verification', icon: <BadgeCheck className="w-4 h-4" /> },
    ],
  },
];

const contentMap: Record<string, React.ReactNode> = {
  'ben-profile': <BeneficiaryProfileIdentity />,
  'ben-matching': <BeneficiaryNeedsMatching />,
  'ben-privacy': <BeneficiaryPrivacyData />,
  'ben-notifications': <BeneficiaryNotifications />,
  'ben-documents': <BeneficiaryDocumentsRecords />,
  'ben-accessibility': <BeneficiaryAccessibility />,
  'giv-profile': <GiverProfileOrganization />,
  'giv-preferences': <GiverGivingPreferences />,
  'giv-reporting': <GiverTransparencyReporting />,
  'giv-notifications': <GiverNotifications />,
  'giv-team': <GiverTeamAccess />,
  'shared-security': <SharedSecurity />,
  'shared-account': <SharedAccountManagement />,
  'shared-support': <SharedSupport />,
  'shared-trust': <SharedTrustVerification />,
};

export default function Settings() {
  const [activeItem, setActiveItem] = useState('giv-profile');
  const [expandedSections, setExpandedSections] = useState<string[]>(['beneficiary', 'giver', 'shared']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const activeSection = sections.find(s => s.items.some(i => i.id === activeItem));
  const activeNavItem = activeSection?.items.find(i => i.id === activeItem);

  return (
    <div className="p-6 lg:p-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform configuration for beneficiaries, givers, and system-wide preferences</p>
      </div>

      <div className="flex gap-6 h-[calc(100%-5rem)]">
        {/* Left Sidebar Navigation */}
        <div className="w-72 shrink-0 overflow-y-auto">
          <nav className="space-y-1">
            {sections.map(section => {
              const isExpanded = expandedSections.includes(section.id);
              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${section.bgColor} ${section.color} hover:opacity-90`}
                  >
                    <span>{section.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 mb-2 ml-2 space-y-0.5">
                      {section.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setActiveItem(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeItem === item.id
                              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                          }`}
                        >
                          <span className={activeItem === item.id ? 'text-brand-600' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 max-w-3xl">
            {/* Breadcrumb */}
            {activeSection && activeNavItem && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span>{activeSection.label}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600">{activeNavItem.label}</span>
              </div>
            )}

            {contentMap[activeItem]}

            {/* Save bar */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400">Changes are saved automatically</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Reset to Defaults
                </button>
                <button className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
