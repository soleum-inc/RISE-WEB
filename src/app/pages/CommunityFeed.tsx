import { useState } from 'react';
import { communityPosts, type CommunityPost, type PostStatus } from '../data/mockData';
import { Plus, VideoCamera as Video, FileText, MusicNotes as Music, CalendarBlank as Calendar, Funnel as Filter, Eye, PencilSimple as Edit2, GridNine as Grid3x3, List, ArrowSquareOut as ExternalLink } from "@phosphor-icons/react";
import { CreateContentModal } from '../components/CreateContentModal';
import { useFramework } from '../context/FrameworkContext';

type ViewLayout = 'table' | 'grid';

export default function CommunityFeed() {
  const [viewLayout, setViewLayout] = useState<ViewLayout>('table');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const { showASSA } = useFramework();

  // Filter by status
  const filteredPosts = communityPosts.filter(post => {
    if (filterStatus === 'all') return true;
    return post.status === filterStatus;
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'article': return FileText;
      case 'event': return Calendar;
      default: return FileText;
    }
  };

  const getContentTypeBg = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'audio': return 'bg-pink-100 text-pink-700';
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'event': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>;
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Scheduled</span>;
      case 'draft':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
    }
  };

  const getASSABadge = (assa: string) => {
    if (!assa) return null;
    
    const assaConfig = {
      acceptance: { bg: 'bg-pink-100', text: 'text-pink-700', icon: '💗', label: 'Acceptance' },
      security: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🛡️', label: 'Security' },
      agency: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '⚡', label: 'Agency' },
      significance: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🏆', label: 'Significance' },
    };

    const config = assaConfig[assa as keyof typeof assaConfig];
    if (!config) return null;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const handleEdit = (post: CommunityPost) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <p className="text-gray-500 mt-1">Media & News Management</p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            </div>
            <div className="flex gap-2">
              {(['all', 'published', 'scheduled', 'draft'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewLayout('table')}
              className={`p-2 rounded transition-colors ${
                viewLayout === 'table'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-2 rounded transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewLayout === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                {showASSA && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BIAS Focus
                </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const TypeIcon = getContentTypeIcon(post.type);
                
                return (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getContentTypeBg(post.type)} flex items-center justify-center flex-shrink-0`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">{post.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getContentTypeBg(post.type)}`}>
                        {post.type}
                      </span>
                    </td>
                    {showASSA && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getASSABadge(post.primaryASSA)}
                    </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.status === 'published' && post.publishedDate}
                        {post.status === 'scheduled' && post.scheduledDate}
                        {post.status === 'draft' && post.updatedAt}
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.status === 'scheduled' && 'Scheduled'}
                        {post.status === 'draft' && 'Last edited'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.views} views</div>
                      <div className="text-xs text-gray-500">{post.interactions} interactions</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-brand-600 hover:text-brand-800"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found.</p>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const TypeIcon = getContentTypeIcon(post.type);
            
            return (
              <div key={post.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center relative">
                  {post.thumbnailUrl ? (
                    <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <TypeIcon className="w-12 h-12 text-white opacity-50" />
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(post.status)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">{post.title}</h3>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getContentTypeBg(post.type)} flex-shrink-0`}>
                      {post.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {showASSA && getASSABadge(post.primaryASSA)}
                    {post.seedsReward > 0 && (
                      <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs font-medium">
                        {post.seedsReward} Seeds
                      </span>
                    )}
                    {post.badgeUnlock && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        🏆 {post.badgeUnlock}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <div>{post.author}</div>
                      <div className="text-gray-500">
                        {post.views} views • {post.interactions} interactions
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-brand-600 hover:text-brand-800"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewLayout === 'grid' && filteredPosts.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No posts found.</p>
        </div>
      )}

      {/* Create/Edit Content Modal */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
      />
    </div>
  );
}