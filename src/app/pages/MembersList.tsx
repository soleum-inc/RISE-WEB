import { useState } from 'react';
import { Link } from 'react-router';
import { members, StatusColor, weeklyASSAData, monthlyASSAData } from '../data/mockData';
import { Heart, Shield, Lightning as Zap, Medal as Award, Circle, TrendUp as TrendingUp, UploadSimple as Upload, Lightbulb, Users, UserCheck, WarningCircle as AlertCircle, Pulse as Activity } from "@phosphor-icons/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFramework } from '../context/FrameworkContext';
import { StatusBadge } from '../components/ui/status-badge';

export default function MembersList() {
  const { showASSA } = useFramework();
  const [filter, setFilter] = useState<'All' | 'Crisis' | 'Stability' | 'Growth'>('All');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'acceptance' | 'security' | 'agency' | 'significance'>('all');

  // Basic stats
  const totalMembers = members.length;
  const verifiedMembers = members.filter(m => m.status === 'Verified').length;
  const pendingMembers = members.filter(m => m.status === 'Pending').length;
  const membersInCrisis = members.filter(m => m.stage === 'Crisis').length;
  const membersInGrowth = members.filter(m => m.stage === 'Growth').length;
  const activeVolunteers = members.filter(m => m.role === 'Giver' || m.role === 'Both').length;
  const totalServiceHours = members.reduce((sum, m) => sum + m.significance.hoursGiven, 0);

  // ASSA stats
  const membersWithTwoVouches = members.filter(m => m.acceptance.vouchCount >= 2).length;
  const vouchPercentage = Math.round((membersWithTwoVouches / totalMembers) * 100);
  const avgPAS = Math.round(members.reduce((sum, m) => sum + m.agency.pasScore, 0) / totalMembers * 10) / 10;

  // Engagement breakdown (ASSA)
  const highAcceptance = members.filter(m => m.acceptance.eventsAttended >= 10).length;
  const highSecurity = members.filter(m => m.security.status === 'green').length;
  const highAgency = members.filter(m => m.agency.pasScore >= 7).length;
  const highSignificance = members.filter(m => m.significance.hoursGiven >= 50).length;

  // Filter members
  const filteredMembers = filter === 'All'
    ? members
    : members.filter(m => m.stage === filter);

  // Get chart data based on timeframe
  const chartData = timeframe === 'weekly' ? weeklyASSAData : monthlyASSAData;

  const getStatusColor = (status: StatusColor) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
    }
  };

  const getOverallStatus = (member: typeof members[0]): StatusColor => {
    const statuses = [
      member.acceptance.status,
      member.security.status,
      member.agency.status,
      member.significance.status
    ];
    if (statuses.includes('red')) return 'red';
    if (statuses.includes('yellow')) return 'yellow';
    return 'green';
  };

  // Member health from stage
  const getMemberStatus = (member: typeof members[0]): StatusColor => {
    if (member.stage === 'Crisis') return 'red';
    if (member.stage === 'Stability') return 'yellow';
    return 'green';
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 mt-1">People & Verification</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Upload className="w-5 h-5" />
          Import CSV
        </button>
      </div>

      {/* ─── Practical KPI Cards (both modes) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Members</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalMembers}</div>
          <p className="text-sm text-gray-600 mt-1">{verifiedMembers} verified · {pendingMembers} pending</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-gray-900">In Growth</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{membersInGrowth}</div>
          <p className="text-sm text-gray-600 mt-1">{Math.round((membersInGrowth / totalMembers) * 100)}% of community</p>
          <StatusBadge tone="neutral" dot className="mt-2">Thriving</StatusBadge>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-gray-900">Service Hours</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalServiceHours.toLocaleString()}</div>
          <p className="text-sm text-gray-600 mt-1">Total contributed</p>
          <StatusBadge tone="neutral" dot className="mt-2">Active</StatusBadge>
        </div>

        <div className={`bg-white rounded-lg border-2 p-6 ${membersInCrisis > 3 ? 'border-red-300' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${membersInCrisis > 3 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertCircle className={`w-5 h-5 ${membersInCrisis > 3 ? 'text-red-600' : 'text-gray-500'}`} />
            </div>
            <h3 className="font-semibold text-gray-900">In Crisis</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{membersInCrisis}</div>
          <p className="text-sm text-gray-600 mt-1">Need immediate support</p>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
            membersInCrisis > 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            <Circle className="w-2 h-2 fill-current" />
            {membersInCrisis > 3 ? 'Needs Attention' : 'Manageable'}
          </div>
        </div>
      </div>

      {/* ─── BIAS MODE: Aggregate BIAS View (additive) ─── */}
      {showASSA && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Belonging */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'acceptance' ? 'all' : 'acceptance')}
            className={`bg-white rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
              selectedMetric === 'acceptance' ? 'border-border shadow-lg' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-gray-900">Belonging</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{vouchPercentage}%</div>
              <p className="text-sm text-gray-600">have 2+ vouches</p>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${vouchPercentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <Circle className="w-2 h-2 fill-current" />
                {vouchPercentage >= 75 ? 'Healthy' : 'Needs Attention'}
              </div>
            </div>
          </button>

          {/* Security */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'security' ? 'all' : 'security')}
            className={`bg-white rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
              selectedMetric === 'security' ? 'border-border shadow-lg' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{membersInCrisis}</div>
              <p className="text-sm text-gray-600">in acute crisis</p>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${membersInCrisis <= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <Circle className="w-2 h-2 fill-current" />
                {membersInCrisis <= 3 ? 'Stable' : 'Critical'}
              </div>
            </div>
          </button>

          {/* Agency */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'agency' ? 'all' : 'agency')}
            className={`bg-white rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
              selectedMetric === 'agency' ? 'border-border shadow-lg' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-gray-900">Agency</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{avgPAS}</div>
              <p className="text-sm text-gray-600">average PAS score</p>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${avgPAS >= 7 ? 'bg-green-100 text-green-700' : avgPAS >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                <Circle className="w-2 h-2 fill-current" />
                {avgPAS >= 7 ? 'Strong' : avgPAS >= 5 ? 'Growing' : 'Needs Support'}
              </div>
            </div>
          </button>

          {/* Importance */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'significance' ? 'all' : 'significance')}
            className={`bg-white rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
              selectedMetric === 'significance' ? 'border-amber-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-gray-900">Importance</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{totalServiceHours.toLocaleString()}</div>
              <p className="text-sm text-gray-600">total service hours</p>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Circle className="w-2 h-2 fill-current" />
                Thriving
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ─── BIAS MODE: Trends Chart ─── */}
      {showASSA && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-foreground" />
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedMetric === 'all' ? 'BIAS Metrics Trends' :
                 selectedMetric === 'acceptance' ? 'Belonging Trend' :
                 selectedMetric === 'security' ? 'Security Trend' :
                 selectedMetric === 'agency' ? 'Agency Trend' :
                 'Importance Trend'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === 'weekly'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === 'monthly'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly
                </button>
              </div>
              {selectedMetric !== 'all' && (
                <button
                  onClick={() => setSelectedMetric('all')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  View All Metrics
                </button>
              )}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={timeframe === 'weekly' ? 'week' : 'month'}
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />

                {(selectedMetric === 'all' || selectedMetric === 'acceptance') && (
                  <Line type="monotone" dataKey="acceptance" stroke="#ec4899" strokeWidth={2} name="Acceptance (%)" dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'security') && (
                  <Line type="monotone" dataKey="security" stroke="#3b82f6" strokeWidth={2} name="Security (%)" dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'agency') && (
                  <Line type="monotone" dataKey="agency" stroke="#a855f7" strokeWidth={2} name="Agency (PAS)" dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'significance') && (
                  <Line type="monotone" dataKey="significance" stroke="#f59e0b" strokeWidth={2} name="Significance (Hours)" dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {selectedMetric !== 'all' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {selectedMetric === 'acceptance' && '📈 Shows the percentage of members with 2+ social vouches over time. Higher is better.'}
                {selectedMetric === 'security' && '📈 Shows the percentage of members NOT in acute crisis over time. Higher is better.'}
                {selectedMetric === 'agency' && '📈 Shows the average Perceived Agency Score (PAS) across all members on a scale of 1-10. Higher is better.'}
                {selectedMetric === 'significance' && '📈 Shows the average service hours contributed per member. Higher indicates greater community engagement.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── BIAS MODE: BIAS Motivator Insights ─── */}
      {showASSA && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-gray-900">BIAS Motivator Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-gray-600 mb-1">High Acceptance Engagement</p>
              <p className="text-3xl font-bold text-foreground">{highAcceptance}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((highAcceptance / totalMembers) * 100)}% of members</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-gray-600 mb-1">Security Stable</p>
              <p className="text-3xl font-bold text-foreground">{highSecurity}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((highSecurity / totalMembers) * 100)}% of members</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-gray-600 mb-1">High Agency (PAS ≥ 7)</p>
              <p className="text-3xl font-bold text-foreground">{highAgency}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((highAgency / totalMembers) * 100)}% of members</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-gray-600 mb-1">High Significance (50+ hrs)</p>
              <p className="text-3xl font-bold text-amber-700">{highSignificance}</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round((highSignificance / totalMembers) * 100)}% of members</p>
            </div>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">💡 Content & Program Recommendations</h3>
            <div className="space-y-2 text-sm text-foreground">
              <p>
                <strong>Balance needed:</strong> {highAcceptance > highAgency
                  ? 'Members are well-connected but need more skill-building opportunities. Create more Agency-focused lessons and pathways.'
                  : 'Members have strong skills but may lack connection. Increase Acceptance-focused social events and community building.'}
              </p>
              <p>
                <strong>Significance opportunity:</strong> {highSignificance < totalMembers * 0.3
                  ? `Only ${Math.round((highSignificance / totalMembers) * 100)}% are highly engaged in service. Create more accessible contribution opportunities and recognition programs.`
                  : 'Strong contribution culture! Continue celebrating member achievements and creating varied service opportunities.'}
              </p>
              <p>
                <strong>Security focus:</strong> {membersInCrisis > 3
                  ? `${membersInCrisis} members in crisis need immediate support. Prioritize Security-focused resources and case management.`
                  : 'Security is stable. Shift focus to growth and skill-building programs.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Engagement Summary (both modes) ─── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-gray-900">Engagement Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-gray-600 mb-1">Active Volunteers</p>
            <p className="text-3xl font-bold text-foreground">{activeVolunteers}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round((activeVolunteers / totalMembers) * 100)}% of community giving back</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-gray-600 mb-1">Courses Completed</p>
            <p className="text-3xl font-bold text-foreground">{members.reduce((s, m) => s + m.agency.pathwaysCompleted, 0)}</p>
            <p className="text-xs text-gray-500 mt-1">Across all members</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-gray-600 mb-1">Events Attended</p>
            <p className="text-3xl font-bold text-foreground">{members.reduce((s, m) => s + m.acceptance.eventsAttended, 0)}</p>
            <p className="text-xs text-gray-500 mt-1">Total attendance across all events</p>
          </div>
        </div>

        <div className="bg-secondary border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">💡 Program Recommendations</h3>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              <strong>Volunteer recruitment:</strong> {activeVolunteers < totalMembers * 0.5
                ? `Only ${Math.round((activeVolunteers / totalMembers) * 100)}% of members are volunteering. Consider targeted outreach to move Stability-stage members into active service roles.`
                : `${Math.round((activeVolunteers / totalMembers) * 100)}% of members are active volunteers — strong engagement! Focus on creating meaningful, high-impact volunteer roles.`}
            </p>
            <p>
              <strong>Course completion:</strong> {members.reduce((s, m) => s + m.agency.pathwaysCompleted, 0) < totalMembers
                ? `Many members haven't completed a course pathway yet. Promote your module library and create accessible entry-level content.`
                : `Members are actively completing courses. Consider adding advanced pathways and certifications to keep them engaged.`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by Stage:</span>
          <div className="flex gap-2">
            {(['All', 'Crisis', 'Stability', 'Growth'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setFilter(stage)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === stage
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {showASSA ? 'BIAS Health' : 'Overall Health'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => {
                const statusColor = showASSA ? getOverallStatus(member) : getMemberStatus(member);
                return (
                  <tr key={member.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/members/${member.id}`} className="text-sm font-medium text-foreground hover:text-foreground">
                        {member.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{member.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === 'Verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        member.stage === 'Growth' ? 'bg-green-100 text-green-800' :
                        member.stage === 'Stability' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(statusColor)}`} />
                        <span className="text-sm text-gray-900 capitalize">{statusColor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.lastActive}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}