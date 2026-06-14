import { NavLink } from 'react-router';
import { Home, Users, Calendar, Radio, BookOpen, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function SideNav() {
  const [membersExpanded, setMembersExpanded] = useState(true);
  const [resourcesExpanded, setResourcesExpanded] = useState(true);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Unavita</h1>
        <p className="text-sm text-gray-500 mt-1">Command Center</p>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Members with Case Management sub-item */}
          <li>
            <button
              onClick={() => setMembersExpanded(!membersExpanded)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="flex-1 text-left">Members</span>
              {membersExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {membersExpanded && (
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/members"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    People & Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/members/case-management"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    Case Management
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Events */}
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </NavLink>
          </li>

          {/* Community Feed */}
          <li>
            <NavLink
              to="/community-feed"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Radio className="w-5 h-5" />
              <span>Community Feed</span>
            </NavLink>
          </li>

          {/* Resources & Programs */}
          <li>
            <button
              onClick={() => setResourcesExpanded(!resourcesExpanded)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="flex-1 text-left">Resources & Programs</span>
              {resourcesExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {resourcesExpanded && (
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/resources/modules"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    Module Builder
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/resources/pathway"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    Pathway Preview
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
            PT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Pastor Tim</p>
            <p className="text-xs text-gray-500 truncate">Community Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}