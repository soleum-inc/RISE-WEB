import { useState } from 'react';
import { projects as initialProjects, type Project, type EventCategory } from '../data/mockData';
import { Plus, CalendarBlank as Calendar, MapPin, Users, Circle, GridNine as LayoutGrid, List, User, PencilSimple as Edit, Repeat, Clock, CurrencyDollar as DollarSign, ShieldCheck, Medal as Award, CaretDown as ChevronDown, CaretUp as ChevronUp, BookOpen, Target, Lightning as Zap } from "@phosphor-icons/react";
import { CreateProjectModal } from '../components/CreateProjectModal';
import { toast } from 'sonner';

type EngagementColor = 'red' | 'yellow' | 'green' | 'All';
type ViewMode = 'grid' | 'table';
type OwnershipFilter = 'all' | 'my-events';
type CategoryTab = 'all' | EventCategory;

export default function Events() {
  const [filter, setFilter] = useState<EngagementColor>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [editingEvent, setEditingEvent] = useState<Project | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const currentUser = 'Pastor Tim';

  const handleCreateEvent = (eventData: Omit<Project, 'id' | 'volunteersSignedUp'>) => {
    const newEvent: Project = {
      ...eventData,
      id: String(allProjects.length + 1),
      volunteersSignedUp: 0,
      organizer: currentUser,
    };
    setAllProjects([newEvent, ...allProjects]);
    toast.success('Event created successfully!', {
      description: `"${eventData.title}" has been added.`,
    });
  };

  const handleUpdateEvent = (updatedEvent: Project) => {
    setAllProjects(allProjects.map(p => p.id === updatedEvent.id ? updatedEvent : p));
    toast.success('Event updated successfully!', {
      description: `"${updatedEvent.title}" has been updated.`,
    });
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Project) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const filteredProjects = allProjects
    .filter(p => categoryTab === 'all' || p.category === categoryTab)
    .filter(p => filter === 'All' || p.color === filter)
    .filter(p => ownershipFilter === 'all' || p.organizer === currentUser);

  const getCounts = (cat: CategoryTab) => {
    if (cat === 'all') return allProjects.length;
    return allProjects.filter(p => p.category === cat).length;
  };

  const getColorDot = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getColorLabel = (color: string) => {
    switch (color) {
      case 'red': return 'Gathering';
      case 'yellow': return 'Service';
      case 'green': return 'Growth';
      default: return '';
    }
  };

  const getColorBg = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScheduleBadge = (p: Project) => {
    if (p.scheduleType === 'repeating') return { label: 'Repeating', icon: Repeat, cls: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (p.scheduleType === 'one-off') return { label: 'One-Off', icon: Clock, cls: 'bg-purple-50 text-purple-700 border-purple-200' };
    return { label: 'Ongoing', icon: Zap, cls: 'bg-brand-50 text-brand-700 border-brand-200' };
  };

  const getCategoryLabel = (cat: EventCategory) => {
    switch (cat) {
      case 'event': return 'Event';
      case 'program': return 'Program';
      case 'micro-loan': return 'Micro-Loan';
    }
  };

  const getCategoryIcon = (cat: EventCategory) => {
    switch (cat) {
      case 'event': return Calendar;
      case 'program': return BookOpen;
      case 'micro-loan': return DollarSign;
    }
  };

  const tabs: { key: CategoryTab; label: string; icon: typeof Calendar }[] = [
    { key: 'all', label: 'All', icon: LayoutGrid },
    { key: 'event', label: 'Events', icon: Calendar },
    { key: 'program', label: 'Programs', icon: BookOpen },
    { key: 'micro-loan', label: 'Micro-Loans', icon: DollarSign },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Programs</h1>
          <p className="text-gray-500 mt-1">Manage community events, support programs, and micro-loan initiatives</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Active', value: allProjects.length, color: 'bg-gray-50 border-gray-200', icon: LayoutGrid },
          { label: 'Events', value: getCounts('event'), color: 'bg-blue-50 border-blue-200', icon: Calendar },
          { label: 'Programs', value: getCounts('program'), color: 'bg-amber-50 border-amber-200', icon: BookOpen },
          { label: 'Micro-Loans', value: getCounts('micro-loan'), color: 'bg-green-50 border-green-200', icon: DollarSign },
        ].map(card => (
          <div key={card.label} className={`rounded-lg border p-4 ${card.color}`}>
            <div className="flex items-center gap-3">
              <card.icon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCategoryTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              categoryTab === tab.key
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
              categoryTab === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {getCounts(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Engagement Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Engagement:</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === 'All' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {(['red', 'yellow', 'green'] as const).map(color => (
                <button
                  key={color}
                  onClick={() => setFilter(color)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    filter === color ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${getColorDot(color)}`} />
                  {getColorLabel(color)}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Ownership */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              {(['all', 'my-events'] as const).map(o => (
                <button
                  key={o}
                  onClick={() => setOwnershipFilter(o)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    ownershipFilter === o ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {o === 'all' ? 'All' : 'Mine'}
                </button>
              ))}
            </div>
          </div>

          {/* Right: View toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const sched = getScheduleBadge(project);
            const ScheduleIcon = sched.icon;
            const CatIcon = getCategoryIcon(project.category);
            const isExpanded = expandedCard === project.id;

            return (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                {/* Color bar */}
                <div className={`h-1.5 ${project.color === 'red' ? 'bg-red-500' : project.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Top badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${sched.cls}`}>
                      <ScheduleIcon className="w-3 h-3" />
                      {sched.label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <CatIcon className="w-3 h-3" />
                      {getCategoryLabel(project.category)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getColorBg(project.color)}`}>
                      {getColorLabel(project.color)}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                  {/* Key info */}
                  <div className="space-y-1.5 mb-3 text-sm text-gray-600">
                    {project.recurrence && (
                      <div className="flex items-center gap-2">
                        <Repeat className="w-3.5 h-3.5 text-gray-400" />
                        <span>{project.recurrence}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{project.date} · {project.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    {project.programDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{project.programDuration}</span>
                      </div>
                    )}
                  </div>

                  {/* Participation bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{project.activeParticipants ?? project.volunteersSignedUp} / {project.totalCapacity ?? project.volunteersNeeded} participants</span>
                      {project.completionRate != null && <span>{project.completionRate}% completion</span>}
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${project.color === 'red' ? 'bg-red-400' : project.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${Math.min(100, ((project.activeParticipants ?? project.volunteersSignedUp) / (project.totalCapacity ?? project.volunteersNeeded)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Engagement Meta (expandable) */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : project.id)}
                      className="flex items-center justify-between w-full text-xs font-medium text-gray-700 hover:text-brand-700"
                    >
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        Engagement Details
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2.5 text-xs">
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div>
                            <span className="text-gray-500">Target Audience:</span>
                            <p className="text-gray-800">{project.engagementMeta.targetAudience}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Expected Commitment:</span>
                            <p className="text-gray-800">{project.engagementMeta.expectedCommitment}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-gray-800">{project.engagementMeta.seedsReward} Seeds</span>
                            {project.engagementMeta.badgeUnlock && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                                🏅 {project.engagementMeta.badgeUnlock}
                              </span>
                            )}
                          </div>
                          {project.engagementMeta.skillsGained.length > 0 && (
                            <div>
                              <span className="text-gray-500">Skills Gained:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.engagementMeta.skillsGained.map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded text-xs border border-brand-200">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {project.engagementMeta.skillsRequired.length > 0 && (
                            <div>
                              <span className="text-gray-500">Skills Required:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.engagementMeta.skillsRequired.map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-xs border border-orange-200">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Eligibility section for micro-loans */}
                        {project.eligibility && (
                          <div className="bg-amber-50 rounded-lg p-3 space-y-2 border border-amber-200">
                            <div className="flex items-center gap-1.5 font-medium text-amber-900">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Eligibility Requirements
                            </div>
                            <p className="text-amber-800">{project.eligibility.description}</p>
                            <div>
                              <span className="text-amber-700 font-medium">Required Courses:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.eligibility.requiredCourses.map(c => (
                                  <span key={c} className="px-1.5 py-0.5 bg-white text-amber-800 rounded text-xs border border-amber-300">📘 {c}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-amber-700 font-medium">Validations:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.eligibility.requiredValidations.map(v => (
                                  <span key={v} className="px-1.5 py-0.5 bg-white text-amber-800 rounded text-xs border border-amber-300">✅ {v}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3 text-amber-800">
                              <span>Min Stage: <strong>{project.eligibility.minimumStage}</strong></span>
                              <span>Min Level: <strong className="capitalize">{project.eligibility.minimumEngagementLevel}</strong></span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleEditEvent(project)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors border border-brand-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Schedule</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Engagement</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Participants</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Seeds</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const sched = getScheduleBadge(project);
                  const ScheduleIcon = sched.icon;
                  const CatIcon = getCategoryIcon(project.category);
                  const pCount = project.activeParticipants ?? project.volunteersSignedUp;
                  const pTotal = project.totalCapacity ?? project.volunteersNeeded;

                  return (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${getColorDot(project.color)}`} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{project.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                          <CatIcon className="w-3.5 h-3.5" />
                          {getCategoryLabel(project.category)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${sched.cls}`}>
                          <ScheduleIcon className="w-3 h-3" />
                          {sched.label}
                        </span>
                        {project.recurrence && (
                          <div className="text-xs text-gray-500 mt-0.5">{project.recurrence}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getColorBg(project.color)}`}>
                          {getColorLabel(project.color)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-900">{pCount}/{pTotal}</span>
                        </div>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${project.color === 'red' ? 'bg-red-400' : project.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`}
                            style={{ width: `${Math.min(100, (pCount / pTotal) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {project.engagementMeta.seedsReward}
                        </div>
                        {project.engagementMeta.badgeUnlock && (
                          <div className="text-xs text-gray-500 mt-0.5">🏅 {project.engagementMeta.badgeUnlock}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pCount >= pTotal
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {pCount >= pTotal ? 'Full' : 'Open'}
                        </span>
                        {project.eligibility && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-700">
                            <ShieldCheck className="w-3 h-3" />
                            Gated
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEditEvent(project)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {ownershipFilter === 'my-events'
              ? "You haven't created any events yet."
              : "No events found with these filters."}
          </p>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        editingEvent={editingEvent}
      />
    </div>
  );
}
