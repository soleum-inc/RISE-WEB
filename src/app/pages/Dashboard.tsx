import { WarningCircle as AlertCircle, Users, FolderOpen, TrendUp as TrendingUp, Plus, Chat as MessageSquare, Heart, Shield, Lightning as Zap, Medal as Award, CalendarBlank as Calendar, BookOpen, UserCheck, Pulse as Activity, ArrowRight } from "@phosphor-icons/react";
import { Link } from 'react-router';
import { members, moderationQueue, inactiveMatches, projects } from '../data/mockData';
import { useFramework } from '../context/FrameworkContext';
import GroupAdd from '../../imports/GroupAdd';

export default function Dashboard() {
  const { showASSA } = useFramework();

  // Calculate stats
  const pendingVerification = members.filter(m => m.status === 'Pending').length;
  const unassignedCrisisRequests = moderationQueue.filter(m => m.status === 'pending').length;
  const stalledCases = inactiveMatches.length;

  const activeVolunteers = members.filter(m => m.role === 'Giver' || m.role === 'Both').length;
  const openProjects = projects.filter(p => p.volunteersSignedUp < p.volunteersNeeded).length;
  const totalMembers = members.length;
  const verifiedMembers = members.filter(m => m.status === 'Verified').length;
  const membersInCrisis = members.filter(m => m.stage === 'Crisis').length;
  const membersInGrowth = members.filter(m => m.stage === 'Growth').length;

  // Calculate lives impacted this month
  const livesImpactedThisMonth = members.reduce((sum, m) => sum + m.significance.livesImpacted, 0);

  // Total service hours
  const totalServiceHours = members.reduce((sum, m) => sum + m.significance.hoursGiven, 0);

  // Upcoming events (next 5)
  const upcomingEvents = projects.slice(0, 4);

  // Calculate Community ASSA Health (ASSA mode only)
  const acceptancePercent = Math.round((members.filter(m => m.acceptance.vouchCount >= 2).length / totalMembers) * 100);
  const securityPercent = Math.round((members.filter(m => m.security.status !== 'red').length / totalMembers) * 100);
  const avgAgencyPAS = members.reduce((sum, m) => sum + m.agency.pasScore, 0) / totalMembers;
  const avgSignificanceHours = Math.round(members.reduce((sum, m) => sum + m.significance.hoursGiven, 0) / totalMembers);

  const biasInsights = {
    belonging: acceptancePercent < 60
      ? 'Low belonging engagement. Consider creating more community-building events and peer vouch opportunities.'
      : acceptancePercent < 80
      ? 'Moderate belonging. Encourage more members to vouch for each other and attend social events.'
      : 'Excellent community belonging! Members feel connected and accepted.',
    security: securityPercent < 60
      ? 'High number in crisis. Urgent: Increase emergency support resources and case management capacity.'
      : securityPercent < 80
      ? 'Security improving but some members still struggling. Focus on stabilization programs.'
      : 'Strong security foundation. Members have stable basic needs.',
    agency: avgAgencyPAS < 5
      ? 'Low agency scores. Members need more skill-building opportunities and pathway programs.'
      : avgAgencyPAS < 7
      ? 'Growing agency. Continue offering diverse skill development and decision-making opportunities.'
      : 'High agency! Members feel empowered and are developing skills successfully.',
    importance: avgSignificanceHours < 15
      ? 'Low contribution rates. Create more accessible service opportunities and recognition programs.'
      : avgSignificanceHours < 30
      ? 'Moderate engagement. Increase recognition for contributions and create varied service options.'
      : 'Excellent contribution culture! Members actively give back and feel valued.',
    overall: 'Balance BIAS dimensions: members showing strength in Importance need Belonging/Agency opportunities; those high in Belonging may need Security or Agency support.',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
        <p className="text-gray-500 mt-1">What needs your attention right now?</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
        <Link
          to="/resources/modules"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Build Course
        </Link>
        <Link
          to="/community-feed"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Post Update
        </Link>
        <Link
          to="/members"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5 [--fill-0:currentColor]"><GroupAdd /></span>
          Add Member
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Needs Attention Alert Box */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
          </div>

          <div className="space-y-3">
            <Link
              to="/members"
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors group"
            >
              <div>
                <p className="font-medium text-gray-900">{pendingVerification} Pending Member Verifications</p>
                <p className="text-sm text-gray-600 mt-1">Members need to be reviewed and approved</p>
              </div>
              <span className="text-red-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/members/case-management"
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors group"
            >
              <div>
                <p className="font-medium text-gray-900">{unassignedCrisisRequests} Unassigned Crisis Requests</p>
                <p className="text-sm text-gray-600 mt-1">Help requests waiting for assignment</p>
              </div>
              <span className="text-orange-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/members/case-management"
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors group"
            >
              <div>
                <p className="font-medium text-gray-900">{stalledCases} Stalled Cases</p>
                <p className="text-sm text-gray-600 mt-1">Matches inactive for more than 48 hours</p>
              </div>
              <span className="text-yellow-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            {membersInCrisis > 0 && (
              <Link
                to="/members"
                className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors group"
              >
                <div>
                  <p className="font-medium text-gray-900">{membersInCrisis} Members in Crisis Stage</p>
                  <p className="text-sm text-gray-600 mt-1">Require immediate support and resources</p>
                </div>
                <span className="text-red-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Asset Overview - Big Numbers */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
                <p className="text-xs text-gray-500">{verifiedMembers} verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Events</p>
                <p className="text-3xl font-bold text-gray-900">{openProjects}</p>
                <p className="text-xs text-gray-500">Volunteers still needed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lives Impacted</p>
                <p className="text-3xl font-bold text-gray-900">{livesImpactedThisMonth}</p>
                <p className="text-xs text-gray-500">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Community Health Overview (both modes) ─── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Community Health Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Key metrics across your community</p>
          </div>
          <Link to="/members" className="text-sm text-foreground hover:text-foreground font-medium flex items-center gap-1">
            View All Members <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">In Growth Stage</p>
            </div>
            <p className="text-3xl font-bold text-green-700">{membersInGrowth}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((membersInGrowth / totalMembers) * 100)}% of members</p>
          </div>
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-foreground" />
              <p className="text-sm text-gray-600">Active Volunteers</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{activeVolunteers}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((activeVolunteers / totalMembers) * 100)}% of members</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-gray-600">Service Hours</p>
            </div>
            <p className="text-3xl font-bold text-amber-700">{totalServiceHours.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total contributed</p>
          </div>
          <div className={`rounded-lg p-4 border ${membersInCrisis > 3 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className={`w-4 h-4 ${membersInCrisis > 3 ? 'text-red-600' : 'text-gray-500'}`} />
              <p className="text-sm text-gray-600">In Crisis</p>
            </div>
            <p className={`text-3xl font-bold ${membersInCrisis > 3 ? 'text-red-700' : 'text-gray-700'}`}>{membersInCrisis}</p>
            <p className="text-xs text-gray-500 mt-1">Need support now</p>
          </div>
        </div>

        {/* Action prompt */}
        <div className="bg-secondary border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-1">💡 Admin Tip</h4>
          <p className="text-sm text-foreground">
            {membersInCrisis > 2
              ? `You have ${membersInCrisis} members in crisis. Review case management and assign support resources to ensure no one falls through the cracks.`
              : membersInGrowth > totalMembers * 0.5
              ? `Over half your members are thriving in the Growth stage! Keep offering courses, events, and volunteer opportunities to maintain momentum.`
              : `Focus on moving Stability-stage members forward by creating targeted courses and events that build skills and community connection.`}
          </p>
        </div>
      </div>

      {/* ─── BIAS MODE: Community BIAS Health (additive) ─── */}
      {showASSA && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Community BIAS Health</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time health across all 4 dimensions of human need</p>
          </div>

          {/* BIAS Health Bars - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Belonging */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">Belonging</h3>
                  <p className="text-xs text-gray-500">Connection</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{acceptancePercent}%</p>
                <p className="text-xs text-gray-600">with 2+ vouches</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    acceptancePercent >= 75 ? 'bg-green-500' :
                    acceptancePercent >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${acceptancePercent}%` }}
                />
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">Security</h3>
                  <p className="text-xs text-gray-500">Safety</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{securityPercent}%</p>
                <p className="text-xs text-gray-600">not in crisis</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    securityPercent >= 75 ? 'bg-green-500' :
                    securityPercent >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${securityPercent}%` }}
                />
              </div>
            </div>

            {/* Agency */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">Agency</h3>
                  <p className="text-xs text-gray-500">Power</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{avgAgencyPAS.toFixed(1)}</p>
                <p className="text-xs text-gray-600">avg PAS (1-10)</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    avgAgencyPAS >= 7 ? 'bg-green-500' :
                    avgAgencyPAS >= 5 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(avgAgencyPAS / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Significance → Importance */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">Importance</h3>
                  <p className="text-xs text-gray-500">Value</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{avgSignificanceHours}</p>
                <p className="text-xs text-gray-600">avg hours</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    avgSignificanceHours >= 30 ? 'bg-green-500' :
                    avgSignificanceHours >= 15 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((avgSignificanceHours / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Overall Insights */}
          <div className="bg-secondary border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">💡 Admin Insights</h4>
            <p className="text-sm text-foreground">{biasInsights.overall}</p>
          </div>
        </div>
      )}

      {/* Bottom Grid: Recent Members + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Member Activity</h3>
            <Link to="/members" className="text-sm text-foreground hover:text-foreground font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {members.slice(0, 5).map(member => (
              <Link
                key={member.id}
                to={`/members/${member.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role} • {member.lastActive}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  member.stage === 'Growth' ? 'bg-green-100 text-green-700' :
                  member.stage === 'Stability' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {member.stage}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <Link to="/events" className="text-sm text-foreground hover:text-foreground font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{event.date} • {event.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        event.volunteersSignedUp >= event.volunteersNeeded ? 'bg-green-500' :
                        event.volunteersSignedUp >= event.volunteersNeeded * 0.5 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-xs text-gray-600">
                        {event.volunteersSignedUp}/{event.volunteersNeeded} volunteers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/events"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-border hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Event
          </Link>
        </div>
      </div>
    </div>
  );
}