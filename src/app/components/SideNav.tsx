import { NavLink } from 'react-router';
import {
  House,
  Users,
  CalendarBlank,
  Broadcast,
  BookOpen,
  Gear,
  CaretDown,
  CaretRight,
  ChartLineUp,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { useVertical } from '../context/VerticalContext';
import { PRODUCT_NAME, PRODUCT_SUBTITLE } from '../config/verticals';

const itemBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors';

function topClass(isActive: boolean) {
  return `${itemBase} ${
    isActive
      ? 'bg-brand-50 text-brand-700 font-medium'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
  }`;
}

function subClass(isActive: boolean) {
  return `flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700 font-medium'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
  }`;
}

export function SideNav() {
  const [membersExpanded, setMembersExpanded] = useState(true);
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  const { theme } = useVertical();

  return (
    <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {PRODUCT_NAME}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{PRODUCT_SUBTITLE}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => topClass(isActive)}>
              <House className="size-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Members with sub-items */}
          <li>
            <button
              onClick={() => setMembersExpanded(!membersExpanded)}
              className={`${itemBase} w-full text-muted-foreground hover:bg-accent hover:text-foreground`}
            >
              <Users className="size-5" />
              <span className="flex-1 text-left">{theme.personLabel}</span>
              {membersExpanded ? (
                <CaretDown className="size-4" />
              ) : (
                <CaretRight className="size-4" />
              )}
            </button>
            {membersExpanded && (
              <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                <li>
                  <NavLink to="/members" end className={({ isActive }) => subClass(isActive)}>
                    People &amp; Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/members/case-management"
                    className={({ isActive }) => subClass(isActive)}
                  >
                    Case Management
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Events */}
          <li>
            <NavLink to="/events" className={({ isActive }) => topClass(isActive)}>
              <CalendarBlank className="size-5" />
              <span>Events</span>
            </NavLink>
          </li>

          {/* Community Feed */}
          <li>
            <NavLink to="/community-feed" className={({ isActive }) => topClass(isActive)}>
              <Broadcast className="size-5" />
              <span>Community Feed</span>
            </NavLink>
          </li>

          {/* Resources & Programs */}
          <li>
            <button
              onClick={() => setResourcesExpanded(!resourcesExpanded)}
              className={`${itemBase} w-full text-muted-foreground hover:bg-accent hover:text-foreground`}
            >
              <BookOpen className="size-5" />
              <span className="flex-1 text-left">Resources &amp; Programs</span>
              {resourcesExpanded ? (
                <CaretDown className="size-4" />
              ) : (
                <CaretRight className="size-4" />
              )}
            </button>
            {resourcesExpanded && (
              <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                <li>
                  <NavLink
                    to="/resources/modules"
                    className={({ isActive }) => subClass(isActive)}
                  >
                    Module Builder
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/resources/pathway"
                    className={({ isActive }) => subClass(isActive)}
                  >
                    Pathway Preview
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Impact */}
          <li>
            <NavLink to="/impact" className={({ isActive }) => topClass(isActive)}>
              <ChartLineUp className="size-5" />
              <span>Impact</span>
            </NavLink>
          </li>

          {/* Trust & Audit */}
          <li>
            <NavLink to="/trust-audit" className={({ isActive }) => topClass(isActive)}>
              <ShieldCheck className="size-5" />
              <span>Trust &amp; Audit</span>
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink to="/settings" className={({ isActive }) => topClass(isActive)}>
              <Gear className="size-5" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="grid size-10 place-items-center rounded-full bg-secondary font-semibold text-foreground">
            {theme.user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{theme.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{theme.user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
