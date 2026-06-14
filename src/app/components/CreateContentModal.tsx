import { useState } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Video, Music, FileText, Calendar, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { projects } from '../data/mockData';
import { useFramework } from '../context/FrameworkContext';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostType = 'video' | 'audio' | 'article' | 'event';
type PostStatus = 'published' | 'scheduled' | 'draft';
type InteractionType = 'multiple-choice' | 'text-input' | 'checkbox';

interface Interaction {
  id: string;
  type: InteractionType;
  question: string;
  options?: string[];
  hasImages?: boolean;
}

export function CreateContentModal({ isOpen, onClose }: CreateContentModalProps) {
  const { showASSA } = useFramework();
  const [contentType, setContentType] = useState<PostType>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<PostStatus>('published');
  const [scheduledDate, setScheduledDate] = useState('');
  
  // Type-specific fields
  const [mediaUrl, setMediaUrl] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [seedsReward, setSeedsReward] = useState(50);
  const [badgeUnlock, setBadgeUnlock] = useState('');

  const handleAddInteraction = () => {
    const newInteraction: Interaction = {
      id: `interaction-${Date.now()}`,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      hasImages: false,
    };
    setInteractions([...interactions, newInteraction]);
  };

  const handleRemoveInteraction = (id: string) => {
    setInteractions(interactions.filter(i => i.id !== id));
  };

  const handleUpdateInteraction = (id: string, field: string, value: any) => {
    setInteractions(interactions.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const handleSave = () => {
    console.log('Saving content:', {
      contentType,
      title,
      description,
      status,
      scheduledDate,
      mediaUrl,
      articleContent,
      selectedEventId,
      interactions,
      seedsReward,
      badgeUnlock,
    });
    handleClose();
  };

  const resetForm = () => {
    setContentType('video');
    setTitle('');
    setDescription('');
    setStatus('published');
    setScheduledDate('');
    setMediaUrl('');
    setArticleContent('');
    setSelectedEventId('');
    setInteractions([]);
    setSeedsReward(50);
    setBadgeUnlock('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getContentTypeIcon = (type: PostType) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'article': return FileText;
      case 'event': return Calendar;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Community Post</DialogTitle>
          <DialogDescription>
            Share content with your community to support their journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Content Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Content Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['video', 'audio', 'article', 'event'] as const).map((type) => {
                const Icon = getContentTypeIcon(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setContentType(type)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      contentType === type
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${contentType === type ? 'text-teal-600' : 'text-gray-600'}`} />
                    <div className="text-sm font-medium capitalize">{type}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── BIAS MODE: BIAS Content Guidance (additive) ─── */}
          {showASSA && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              💡 BIAS Content Guidance
            </h3>
            
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <strong>Create balanced content across all 4 dimensions</strong> to support your community's holistic growth:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/70 rounded-lg p-3 border border-pink-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">💗</span>
                    <h4 className="font-semibold text-sm text-pink-900">Belonging</h4>
                  </div>
                  <p className="text-xs text-pink-800">
                    Content that builds belonging, welcomes newcomers, shares success stories, and creates connection
                  </p>
                </div>

                <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🛡️</span>
                    <h4 className="font-semibold text-sm text-blue-900">Security</h4>
                  </div>
                  <p className="text-xs text-blue-800">
                    Content about safety, basic needs, housing, food access, healthcare, and crisis resources
                  </p>
                </div>

                <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">⚡</span>
                    <h4 className="font-semibold text-sm text-purple-900">Agency</h4>
                  </div>
                  <p className="text-xs text-purple-800">
                    Content that builds skills, teaches new abilities, offers career development, and empowers action
                  </p>
                </div>

                <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🏆</span>
                    <h4 className="font-semibold text-sm text-amber-900">Importance</h4>
                  </div>
                  <p className="text-xs text-amber-800">
                    Content highlighting contributions, celebrating volunteers, and creating opportunities to give back
                  </p>
                </div>
              </div>

              <div className="bg-teal-100 border border-teal-300 rounded-lg p-3 mt-3">
                <p className="text-xs text-teal-900">
                  <strong>💡 Pro Tip:</strong> Check your Dashboard's Community BIAS Health section to see which dimensions need more content support.
                </p>
              </div>
            </div>
          </div>
          )}

          {/* ─── Content Tips (both modes) ─── */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-teal-600" />
              Content Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/80 rounded-lg p-3 border border-teal-200">
                <p className="font-medium text-gray-800 mb-1">📹 Videos & Audio</p>
                <p className="text-xs text-gray-600">Great for skill-building lessons, testimonials, and event recaps. Keep under 10 mins for best engagement.</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-teal-200">
                <p className="font-medium text-gray-800 mb-1">📄 Articles</p>
                <p className="text-xs text-gray-600">Ideal for detailed guides, announcements, and resource lists. Use headers and bullet points for readability.</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-teal-200">
                <p className="font-medium text-gray-800 mb-1">📅 Event Posts</p>
                <p className="text-xs text-gray-600">Drive sign-ups by featuring upcoming events in the community feed with key details and a clear call to action.</p>
              </div>
              <div className="bg-white/80 rounded-lg p-3 border border-teal-200">
                <p className="font-medium text-gray-800 mb-1">🏆 Recognition Posts</p>
                <p className="text-xs text-gray-600">Celebrate member milestones, volunteer achievements, and course completions to boost morale and retention.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  contentType === 'video' ? 'e.g., "Understanding Your Rights as a Tenant"' :
                  contentType === 'audio' ? 'e.g., "Financial Literacy Podcast: Building Your Budget"' :
                  contentType === 'article' ? 'e.g., "5 Steps to Housing Stability"' :
                  'e.g., "Community Garden Kickoff Event"'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this content covers..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type-Specific Content */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {contentType === 'video' && '📹 Video Content'}
              {contentType === 'audio' && '🎵 Audio Content'}
              {contentType === 'article' && '📄 Article Content'}
              {contentType === 'event' && '📅 Event Information'}
            </h3>

            {contentType === 'video' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube / Vimeo URL
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll embed the video to avoid hosting costs
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">or</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Video File
                  </button>
                </div>
              </>
            )}

            {contentType === 'audio' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio File URL or Podcast Link
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a link to your hosted audio file or podcast episode
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">or</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Audio File
                  </button>
                </div>
              </>
            )}

            {contentType === 'article' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content
                </label>
                <textarea
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="Write your article content here, or paste from another source..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can format this with Markdown or rich text
                </p>
              </div>
            )}

            {contentType === 'event' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event to Feature
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    const event = projects.find(p => p.id === e.target.value);
                    if (event && !title) {
                      setTitle(event.title);
                      setDescription(event.description);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">-- Select an Event --</option>
                  {projects.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {event.date} at {event.time}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Feature an upcoming event from your Events calendar in the community feed
                </p>

                {selectedEventId && (() => {
                  const event = projects.find(p => p.id === selectedEventId);
                  return event ? (
                    <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.color === 'red' ? 'bg-red-100 text-red-700' :
                          event.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {event.graduationStage}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="text-xs text-gray-500">
                        📅 {event.date} at {event.time} • 📍 {event.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        👥 {event.volunteersSignedUp}/{event.volunteersNeeded} volunteers signed up
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Publishing Options */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Publishing Options</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-3">
                {(['published', 'scheduled', 'draft'] as const).map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => setStatus(statusOption)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      status === statusOption
                        ? statusOption === 'published' ? 'border-green-600 bg-green-50 text-green-700' :
                          statusOption === 'scheduled' ? 'border-yellow-600 bg-yellow-50 text-yellow-700' :
                          'border-gray-600 bg-gray-50 text-gray-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{statusOption}</div>
                  </button>
                ))}
              </div>
            </div>

            {status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Gamification */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Engagement & Rewards</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seeds/Points Reward
                </label>
                <input
                  type="number"
                  value={seedsReward}
                  onChange={(e) => setSeedsReward(Number(e.target.value))}
                  min={0}
                  step={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded when user completes this content</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Unlock (Optional)
                </label>
                <select
                  value={badgeUnlock}
                  onChange={(e) => setBadgeUnlock(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">No badge</option>
                  <option value="financial-wizard">🧙 Financial Wizard</option>
                  <option value="health-champion">💪 Health Champion</option>
                  <option value="nutrition-master">🥗 Nutrition Master</option>
                  <option value="education-explorer">📚 Education Explorer</option>
                  <option value="housing-hero">🏠 Housing Hero</option>
                  <option value="community-builder">🤝 Community Builder</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className={`px-6 py-2 rounded-lg font-medium ${
                !title.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : status === 'published'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : status === 'scheduled'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {status === 'published' ? 'Publish Now' : status === 'scheduled' ? 'Schedule Post' : 'Save Draft'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}