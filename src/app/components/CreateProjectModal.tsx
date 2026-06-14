import { useState, useEffect } from 'react';
import { X, MapPin, UploadSimple as Upload, Info, CalendarBlank as Calendar, Clock, CurrencyDollar as DollarSign, BookOpen, Repeat, Lightning as Zap } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { type Project, type EventType, type MemberStage, type EventCategory, type ScheduleType } from '../data/mockData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: Omit<Project, 'id' | 'volunteersSignedUp' | 'organizer'>) => void;
  onUpdate?: (eventData: Project) => void;
  editingEvent?: Project | null;
}

type GraduationStage = 'crisis' | 'stabilization' | 'growth' | '';
type EngagementLevel = 'red' | 'yellow' | 'green' | '';
type Pillar = 'nutrition' | 'education' | 'finance' | 'health' | '';

export function CreateProjectModal({ isOpen, onClose, onCreate, onUpdate, editingEvent }: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory | ''>('');
  const [scheduleType, setScheduleType] = useState<ScheduleType | ''>('');
  const [recurrence, setRecurrence] = useState('');

  // Step 2: Logic Tags
  const [graduationStage, setGraduationStage] = useState<GraduationStage>('');
  const [engagementLevel, setEngagementLevel] = useState<EngagementLevel>('');
  const [pillar, setPillar] = useState<Pillar>('');

  // Step 3: Engagement & Resources
  const [targetAudience, setTargetAudience] = useState('');
  const [expectedCommitment, setExpectedCommitment] = useState('');
  const [seedsReward, setSeedsReward] = useState(25);
  const [badgeUnlock, setBadgeUnlock] = useState('');
  const [skillsGained, setSkillsGained] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [volunteersNeeded, setVolunteersNeeded] = useState(5);

  // Micro-loan eligibility
  const [requiredCourses, setRequiredCourses] = useState('');
  const [requiredValidations, setRequiredValidations] = useState('');
  const [eligibilityDescription, setEligibilityDescription] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingEvent && isOpen) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setDate(editingEvent.date !== 'TBD' ? editingEvent.date : '');
      setLocation(editingEvent.location !== 'TBD' ? editingEvent.location : '');
      setVolunteersNeeded(editingEvent.volunteersNeeded);
      setCategory(editingEvent.category || '');
      setScheduleType(editingEvent.scheduleType || '');
      setRecurrence(editingEvent.recurrence || '');

      const stageMap: Record<MemberStage, GraduationStage> = {
        'Crisis': 'crisis',
        'Stability': 'stabilization',
        'Growth': 'growth'
      };
      setGraduationStage(stageMap[editingEvent.graduationStage] || '');
      setEngagementLevel(editingEvent.color as EngagementLevel);

      if (editingEvent.engagementMeta) {
        setTargetAudience(editingEvent.engagementMeta.targetAudience);
        setExpectedCommitment(editingEvent.engagementMeta.expectedCommitment);
        setSeedsReward(editingEvent.engagementMeta.seedsReward);
        setBadgeUnlock(editingEvent.engagementMeta.badgeUnlock || '');
        setSkillsGained(editingEvent.engagementMeta.skillsGained.join(', '));
        setSkillsRequired(editingEvent.engagementMeta.skillsRequired.join(', '));
      }
      if (editingEvent.eligibility) {
        setRequiredCourses(editingEvent.eligibility.requiredCourses.join(', '));
        setRequiredValidations(editingEvent.eligibility.requiredValidations.join(', '));
        setEligibilityDescription(editingEvent.eligibility.description);
      }
    }
  }, [editingEvent, isOpen]);

  const isSaveEnabled = title.trim() !== '' && graduationStage !== '' && engagementLevel !== '' && category !== '';

  const mapGraduationStage = (stage: GraduationStage): MemberStage => {
    switch (stage) {
      case 'crisis': return 'Crisis';
      case 'stabilization': return 'Stability';
      case 'growth': return 'Growth';
      default: return 'Crisis';
    }
  };

  const getEngagementLabel = (level: string) => {
    switch (level) {
      case 'red': return 'Community Gathering';
      case 'yellow': return 'Service & Mentorship';
      case 'green': return 'Skilled Growth';
      default: return '';
    }
  };

  const handleSave = () => {
    if (!isSaveEnabled) return;

    const timeDisplay = startTime && endTime
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : startTime
        ? formatTime(startTime)
        : '';

    const engagementMeta = {
      level: engagementLevel as EventType,
      label: getEngagementLabel(engagementLevel),
      targetAudience: targetAudience || 'All community members',
      expectedCommitment: expectedCommitment || 'Varies',
      skillsRequired: skillsRequired ? skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : [],
      skillsGained: skillsGained ? skillsGained.split(',').map(s => s.trim()).filter(Boolean) : [],
      seedsReward,
      ...(badgeUnlock ? { badgeUnlock } : {}),
    };

    const eligibility = category === 'micro-loan' ? {
      requiredCourses: requiredCourses ? requiredCourses.split(',').map(s => s.trim()).filter(Boolean) : [],
      requiredValidations: requiredValidations ? requiredValidations.split(',').map(s => s.trim()).filter(Boolean) : [],
      minimumEngagementLevel: engagementLevel as EventType,
      minimumStage: mapGraduationStage(graduationStage),
      description: eligibilityDescription || 'Must meet all listed requirements.',
    } : undefined;

    if (editingEvent && onUpdate) {
      const updatedEvent: Project = {
        ...editingEvent,
        title,
        description,
        date: date || 'TBD',
        time: timeDisplay || 'TBD',
        location: location || 'TBD',
        eventType: engagementLevel as EventType,
        color: engagementLevel as EventType,
        graduationStage: mapGraduationStage(graduationStage),
        volunteersNeeded,
        category: category as EventCategory,
        scheduleType: (scheduleType || 'one-off') as ScheduleType,
        recurrence: recurrence || undefined,
        engagementMeta,
        eligibility,
      };
      onUpdate(updatedEvent);
    } else {
      const eventData: Omit<Project, 'id' | 'volunteersSignedUp' | 'organizer'> = {
        title,
        description,
        date: date || 'TBD',
        time: timeDisplay || 'TBD',
        location: location || 'TBD',
        eventType: engagementLevel as EventType,
        color: engagementLevel as EventType,
        graduationStage: mapGraduationStage(graduationStage),
        volunteersNeeded,
        category: category as EventCategory,
        scheduleType: (scheduleType || 'one-off') as ScheduleType,
        recurrence: recurrence || undefined,
        engagementMeta,
        eligibility,
      };
      onCreate(eventData);
    }
    handleClose();
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setCategory('');
    setScheduleType('');
    setRecurrence('');
    setGraduationStage('');
    setEngagementLevel('');
    setPillar('');
    setTargetAudience('');
    setExpectedCommitment('');
    setSeedsReward(25);
    setBadgeUnlock('');
    setSkillsGained('');
    setSkillsRequired('');
    setUploadedFiles([]);
    setVolunteersNeeded(5);
    setRequiredCourses('');
    setRequiredValidations('');
    setEligibilityDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const stepLabels = ['Basics', 'Logic Tags', 'Engagement & Resources'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event / Program' : 'Create New Event / Program'}</DialogTitle>
          <DialogDescription>
            {editingEvent ? 'Update details and settings' : 'Create events, programs, or micro-loan initiatives'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{stepLabels[step - 1]}</span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-teal-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: The Basics */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 1: The Basics</h3>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type * <span className="text-red-600">Required</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'event', label: 'Event', icon: Calendar, desc: 'One-off or recurring event' },
                    { value: 'program', label: 'Program', icon: BookOpen, desc: 'Ongoing support program' },
                    { value: 'micro-loan', label: 'Micro-Loan', icon: DollarSign, desc: 'Financial assistance' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setCategory(opt.value as EventCategory)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        category === opt.value ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <opt.icon className="w-5 h-5 text-gray-700 mb-1" />
                      <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'one-off', label: 'One-Off', icon: Clock },
                    { value: 'repeating', label: 'Repeating', icon: Repeat },
                    { value: 'ongoing', label: 'Ongoing', icon: Zap },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setScheduleType(opt.value as ScheduleType)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all ${
                        scheduleType === opt.value ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <opt.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    </button>
                  ))}
                </div>
                {scheduleType === 'repeating' && (
                  <input
                    type="text"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                    placeholder='e.g., "Every Wednesday", "Bi-weekly"'
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., "Weekly Food Bank" or "Wrap Around Grandparenting"'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will participants do?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity / Volunteers Needed</label>
                <input
                  type="number"
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Logic Tags */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg mb-4">
                <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-teal-900">Required for Pathway Logic</p>
                  <p className="text-xs text-teal-700 mt-1">These tags determine who sees this in the mobile app</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Step 2: The Logic Tags</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Stage * <span className="text-red-600">Required</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'crisis', label: 'Stage 1: Crisis Entry', desc: 'For members in urgent/survival needs', color: 'red' },
                    { value: 'stabilization', label: 'Stage 2: Stabilization', desc: 'For members building foundation/safety', color: 'yellow' },
                    { value: 'growth', label: 'Stage 3: Growth/Skill Building', desc: 'For members ready for independence', color: 'green' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setGraduationStage(option.value as GraduationStage)}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        graduationStage === option.value
                          ? `border-${option.color}-600 bg-${option.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engagement Level * <span className="text-red-600">Required</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'red', emoji: '🔴', label: 'Red: Community Gathering', desc: 'Social connection, getting to know people' },
                    { value: 'yellow', emoji: '🟡', label: 'Yellow: Service Project', desc: 'Helping others, doing something for the neighborhood' },
                    { value: 'green', emoji: '🟢', label: 'Green: Fixing/Growth', desc: 'Complex skills, mentorship, problem-solving' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setEngagementLevel(option.value as EngagementLevel)}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        engagementLevel === option.value ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.emoji} {option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pillar Tag</label>
                <select
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value as Pillar)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select a pillar...</option>
                  <option value="nutrition">🍎 Nutrition</option>
                  <option value="education">📚 Education</option>
                  <option value="finance">💰 Finance</option>
                  <option value="health">🏥 Health</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Engagement & Resources */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 3: Engagement & Resources</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., All members — low barrier"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Commitment</label>
                  <input
                    type="text"
                    value={expectedCommitment}
                    onChange={(e) => setExpectedCommitment(e.target.value)}
                    placeholder="e.g., 4 hours/week"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seeds Reward</label>
                  <input
                    type="number"
                    value={seedsReward}
                    onChange={(e) => setSeedsReward(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Unlock (optional)</label>
                  <input
                    type="text"
                    value={badgeUnlock}
                    onChange={(e) => setBadgeUnlock(e.target.value)}
                    placeholder="e.g., Nourisher"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills Gained (comma-separated)</label>
                <input
                  type="text"
                  value={skillsGained}
                  onChange={(e) => setSkillsGained(e.target.value)}
                  placeholder="e.g., Teamwork, Food Safety, Community Service"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required (comma-separated)</label>
                <input
                  type="text"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="e.g., Background Check Cleared"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Micro-loan eligibility section */}
              {category === 'micro-loan' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Micro-Loan Eligibility Requirements
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">Required Courses (comma-separated)</label>
                    <input
                      type="text"
                      value={requiredCourses}
                      onChange={(e) => setRequiredCourses(e.target.value)}
                      placeholder="e.g., Financial Literacy, Budgeting 101"
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">Required Validations (comma-separated)</label>
                    <input
                      type="text"
                      value={requiredValidations}
                      onChange={(e) => setRequiredValidations(e.target.value)}
                      placeholder="e.g., 2+ Community Vouches, Case Manager Approval"
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">Eligibility Description</label>
                    <textarea
                      value={eligibilityDescription}
                      onChange={(e) => setEligibilityDescription(e.target.value)}
                      placeholder="Describe the full eligibility criteria..."
                      rows={2}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              )}

              {/* File upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Drag and drop files here</p>
                <button className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-2">Supported: PDF, DOC, DOCX (Max 10MB)</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!isSaveEnabled}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              )}
            </div>
          </div>

          {!isSaveEnabled && currentStep === 3 && (
            <p className="text-sm text-red-600 text-center">
              Please complete required fields: Type, Title, Graduation Stage, and Engagement Level
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}