import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { members, StatusColor, memberHistoricalData } from '../data/mockData';
import { Heart, Shield, Zap, Award, Circle, ArrowLeft, CheckCircle2, TrendingUp, Lightbulb, Users, CalendarCheck, BookOpen, Clock, Star } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFramework } from '../context/FrameworkContext';

export default function MemberDetail() {
  const { id } = useParams();
  const { showASSA } = useFramework();
  const member = members.find(m => m.id === id);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'acceptance' | 'security' | 'agency' | 'significance'>('all');

  if (!member) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Member not found</h2>
          <Link to="/members" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const historicalData = memberHistoricalData[member.id] || [];

  const getStatusColor = (status: StatusColor) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
    }
  };

  const getStatusBorder = (status: StatusColor) => {
    switch (status) {
      case 'green': return 'border-green-200';
      case 'yellow': return 'border-yellow-200';
      case 'red': return 'border-red-200';
    }
  };

  const getStatusBg = (status: StatusColor) => {
    switch (status) {
      case 'green': return 'bg-green-50';
      case 'yellow': return 'bg-yellow-50';
      case 'red': return 'bg-red-50';
    }
  };

  const overallStatusColor: StatusColor =
    member.stage === 'Crisis' ? 'red' :
    member.stage === 'Stability' ? 'yellow' : 'green';

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link to="/members" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Members</span>
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">Role: <span className="font-medium">{member.role}</span></span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  member.status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  member.stage === 'Growth' ? 'bg-green-100 text-green-800' :
                  member.stage === 'Stability' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {member.stage}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Active</p>
            <p className="text-sm font-medium text-gray-900">{member.lastActive}</p>
          </div>
        </div>
      </div>

      {/* ─── BIAS MODE: Personal Progress Chart ─── */}
      {showASSA && historicalData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedMetric === 'all' ? 'Personal Progress - All BIAS Metrics' :
                 selectedMetric === 'acceptance' ? 'Belonging Progress' :
                 selectedMetric === 'security' ? 'Security Progress' :
                 selectedMetric === 'agency' ? 'Agency Progress' :
                 'Importance Progress'}
              </h2>
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

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />

                {(selectedMetric === 'all' || selectedMetric === 'acceptance') && (
                  <Line type="monotone" dataKey="acceptance" stroke="#ec4899" strokeWidth={2} name="Belonging (Vouches)" dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'security') && (
                  <Line type="monotone" dataKey="security" stroke="#3b82f6" strokeWidth={2} name="Security Score" dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'agency') && (
                  <Line type="monotone" dataKey="agency" stroke="#a855f7" strokeWidth={2} name="Agency (PAS)" dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6 }} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'significance') && (
                  <Line type="monotone" dataKey="significance" stroke="#f59e0b" strokeWidth={2} name="Importance (Hours)" dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {selectedMetric !== 'all' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {selectedMetric === 'acceptance' && `📈 ${member.name}'s social belonging progress. Current: ${member.acceptance.vouchCount} vouches, ${member.acceptance.eventsAttended} events attended.`}
                {selectedMetric === 'security' && `📈 ${member.name}'s basic needs stability score (0-100). Higher means more secure housing, food, and healthcare.`}
                {selectedMetric === 'agency' && `📈 ${member.name}'s Perceived Agency Score over time. Current: ${member.agency.pasScore}/10.`}
                {selectedMetric === 'significance' && `📈 ${member.name}'s contribution and importance. Current total: ${member.significance.hoursGiven} hours contributed.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Member At-a-Glance (both modes) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Community Status */}
        <div className={`bg-white rounded-lg border-2 ${getStatusBorder(overallStatusColor)} p-6 ${getStatusBg(overallStatusColor)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Community Status</h2>
            </div>
            <div className={`w-4 h-4 rounded-full ${getStatusColor(overallStatusColor)}`} />
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stage</span>
                  <span className={`font-medium ${member.stage === 'Growth' ? 'text-green-700' : member.stage === 'Stability' ? 'text-yellow-700' : 'text-red-700'}`}>{member.stage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium text-gray-900">{member.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Attended</span>
                  <span className="font-medium text-gray-900">{member.acceptance.eventsAttended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Community Posts</span>
                  <span className="font-medium text-gray-900">{member.acceptance.communityPosts}</span>
                </div>
              </div>
            </div>
            {member.security.status === 'red' && (
              <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">⚠️ Needs Support</p>
                <p className="text-xs text-red-700 mt-1">Housing: {member.security.housing} · Food: {member.security.food}</p>
              </div>
            )}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Pathway Completion</span>
                <span className="text-sm font-medium text-gray-900">{member.agency.progress}%</span>
              </div>
              <Progress value={member.agency.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{member.agency.completedQuests.length} of {member.agency.totalQuests} modules done</p>
            </div>
            {member.agency.completedQuests.length > 0 && (
              <div className="space-y-1">
                {member.agency.completedQuests.map((quest, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                    {quest}
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">{member.agency.pathwaysCompleted} pathway{member.agency.pathwaysCompleted !== 1 ? 's' : ''} completed · {member.agency.skillsLearned.length} skills learned</p>
            </div>
          </div>
        </div>

        {/* Service & Impact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Service & Impact</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-amber-50 rounded p-3 text-center border border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{member.significance.hoursGiven}</div>
              <div className="text-xs text-gray-600 mt-1">Hours Given</div>
            </div>
            <div className="bg-green-50 rounded p-3 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-700">{member.significance.livesImpacted}</div>
              <div className="text-xs text-gray-600 mt-1">Lives Impacted</div>
            </div>
          </div>
          {member.significance.badges.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Badges Earned</p>
              <div className="flex flex-wrap gap-1">
                {member.significance.badges.map((badge, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <Award className="w-2.5 h-2.5" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Context */}
      {member.onboardingContext && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-purple-900 mb-2">🎯 Onboarding Context</h3>
          <p className="text-sm text-purple-800">{member.onboardingContext}</p>
        </div>
      )}

      {/* ─── ASSA MODE: ASSA Quadrants ─── */}
      {showASSA && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Quadrant 1: Belonging */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'acceptance' ? 'all' : 'acceptance')}
            className={`bg-white rounded-lg border-2 ${getStatusBorder(member.acceptance.status)} p-6 ${getStatusBg(member.acceptance.status)} text-left transition-all hover:shadow-lg ${
              selectedMetric === 'acceptance' ? 'ring-2 ring-pink-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Belonging</h2>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusColor(member.acceptance.status)}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">Belonging & Trust</p>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Social Vouching Status</p>
                <div className="bg-white rounded p-3 border border-gray-200">
                  {member.acceptance.vouchers.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-900 mb-2">Vouched for by:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.acceptance.vouchers.map((voucher, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            {voucher}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {member.acceptance.vouchCount} vouches (minimum 2 required)
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No vouches yet</p>
                  )}
                </div>
              </div>

              {member.acceptance.vouchCount < 2 && (
                <div className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors text-center">
                  Vouch for this Member
                </div>
              )}
            </div>

            {selectedMetric === 'acceptance' && (
              <div className="mt-3 text-xs text-pink-700 font-medium">↑ Click to view trend</div>
            )}
          </button>

          {/* Quadrant 2: Security */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'security' ? 'all' : 'security')}
            className={`bg-white rounded-lg border-2 ${getStatusBorder(member.security.status)} p-6 ${getStatusBg(member.security.status)} text-left transition-all hover:shadow-lg ${
              selectedMetric === 'security' ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusColor(member.security.status)}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">Stability & Basic Needs</p>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Vital Signs</p>
                <div className="bg-white rounded border border-gray-200 divide-y divide-gray-200">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-gray-600">Housing</span>
                    <span className={`text-sm font-medium ${
                      member.security.housing.includes('Secured') ? 'text-green-700' :
                      member.security.housing.includes('Homeless') ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {member.security.housing}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-gray-600">Food</span>
                    <span className={`text-sm font-medium ${
                      member.security.food === 'Stable' ? 'text-green-700' :
                      member.security.food === 'Crisis' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {member.security.food}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-gray-600">Healthcare</span>
                    <span className={`text-sm font-medium ${
                      member.security.healthcare === 'Insured' ? 'text-green-700' :
                      member.security.healthcare === 'None' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {member.security.healthcare}
                    </span>
                  </div>
                </div>
              </div>

              {member.security.status === 'red' && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900">⚠️ Acute Crisis</p>
                  <p className="text-xs text-red-700 mt-1">Immediate intervention required</p>
                </div>
              )}
            </div>

            {selectedMetric === 'security' && (
              <div className="mt-3 text-xs text-blue-700 font-medium">↑ Click to view trend</div>
            )}
          </button>

          {/* Quadrant 3: Agency */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'agency' ? 'all' : 'agency')}
            className={`bg-white rounded-lg border-2 ${getStatusBorder(member.agency.status)} p-6 ${getStatusBg(member.agency.status)} text-left transition-all hover:shadow-lg ${
              selectedMetric === 'agency' ? 'ring-2 ring-purple-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Agency</h2>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusColor(member.agency.status)}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">Freedom & Skill</p>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Perceived Agency Score (PAS)</p>
                <div className="bg-white rounded p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">{member.agency.pasScore}</span>
                    <span className="text-sm text-gray-500">/ 10</span>
                  </div>
                  <Progress value={member.agency.pasScore * 10} className="h-2" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Graduation Pathway Progress</p>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Micro-Quests Completed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {member.agency.completedQuests.length} / {member.agency.totalQuests}
                    </span>
                  </div>
                  <Progress value={member.agency.progress} className="h-2 mb-3" />
                  {member.agency.completedQuests.length > 0 && (
                    <div className="space-y-1">
                      {member.agency.completedQuests.map((quest, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {quest}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedMetric === 'agency' && (
              <div className="mt-3 text-xs text-purple-700 font-medium">↑ Click to view trend</div>
            )}
          </button>

          {/* Quadrant 4: Importance */}
          <button
            onClick={() => setSelectedMetric(selectedMetric === 'significance' ? 'all' : 'significance')}
            className={`bg-white rounded-lg border-2 ${getStatusBorder(member.significance.status)} p-6 ${getStatusBg(member.significance.status)} text-left transition-all hover:shadow-lg ${
              selectedMetric === 'significance' ? 'ring-2 ring-amber-500 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Importance</h2>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusColor(member.significance.status)}`} />
            </div>

            <p className="text-sm text-gray-600 mb-4">Purpose & Contribution</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded p-4 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-900">{member.significance.hoursGiven}</div>
                  <div className="text-xs text-gray-600 mt-1">Hours Given</div>
                </div>
                <div className="bg-white rounded p-4 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-900">{member.significance.livesImpacted}</div>
                  <div className="text-xs text-gray-600 mt-1">Lives Impacted</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Legacy Tree - Badges Earned</p>
                <div className="bg-white rounded p-3 border border-gray-200">
                  {member.significance.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {member.significance.badges.map((badge, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          <Award className="w-3 h-3" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No badges earned yet</p>
                  )}
                </div>
              </div>
            </div>

            {selectedMetric === 'significance' && (
              <div className="mt-3 text-xs text-amber-700 font-medium">↑ Click to view trend</div>
            )}
          </button>
        </div>
      )}

      {/* ─── ASSA MODE: BIAS Metrics Detail Table ─── */}
      {showASSA && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">BIAS Metrics Detail</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimension</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metrics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      <span className="font-semibold text-gray-900">Belonging</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <span><strong>{member.acceptance.eventsAttended}</strong> events attended</span>
                      <span><strong>{member.acceptance.vouchCount}</strong> vouches</span>
                      <span><strong>{member.acceptance.communityPosts}</strong> community posts</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-900">Security</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <span><strong>{member.security.needsMet}/3</strong> needs met</span>
                      <span>{member.security.crisisReduced ? '✅ Improved from crisis' : '⚠️ Still in crisis'}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-900">Agency</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <span><strong>{member.agency.skillsLearned.length}</strong> skills learned</span>
                      <span><strong>{member.agency.pathwaysCompleted}</strong> pathways completed</span>
                      <span><strong>{member.agency.pasScore}/10</strong> PAS</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-gray-900">Importance</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-xs text-gray-700">
                      <span><strong>{member.significance.awardsEarned}</strong> awards earned</span>
                      <span><strong>{member.significance.hoursGiven}</strong> hours contributed</span>
                      <span><strong>{member.significance.timesAskedToHelp}</strong> times asked to help</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ASSA MODE: Motivational Insights ─── */}
      {showASSA && member.motivationalProfile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Motivational Insights</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Primary Motivator</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                member.motivationalProfile.primaryMotivator === 'acceptance' ? 'bg-pink-100 text-pink-800' :
                member.motivationalProfile.primaryMotivator === 'security' ? 'bg-blue-100 text-blue-800' :
                member.motivationalProfile.primaryMotivator === 'agency' ? 'bg-purple-100 text-purple-800' :
                member.motivationalProfile.primaryMotivator === 'significance' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {member.motivationalProfile.primaryMotivator.charAt(0).toUpperCase() + member.motivationalProfile.primaryMotivator.slice(1)}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Engagement Pattern</p>
              <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                {member.motivationalProfile.engagementPattern}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">💡 Admin Recommendations</p>
              <div className="text-sm text-blue-800 p-4 bg-blue-50 border border-blue-200 rounded">
                {member.motivationalProfile.recommendations}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Admin Notes & Recommendations (both modes) ─── */}
      {member.motivationalProfile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Admin Notes & Recommendations</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Engagement Pattern</p>
              <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                {member.motivationalProfile.engagementPattern}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">💡 Recommendations</p>
              <div className="text-sm text-teal-800 p-4 bg-teal-50 border border-teal-200 rounded">
                {member.motivationalProfile.recommendations}
              </div>
            </div>

            {/* Quick stats for standard mode */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{member.significance.awardsEarned}</p>
                <p className="text-xs text-gray-500 mt-0.5">Awards Earned</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{member.significance.timesAskedToHelp}</p>
                <p className="text-xs text-gray-500 mt-0.5">Times Asked to Help</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{member.agency.skillsLearned.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Skills Learned</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}