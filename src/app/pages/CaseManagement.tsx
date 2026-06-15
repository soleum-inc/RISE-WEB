import { useState } from 'react';
import { moderationQueue, inactiveMatches, members } from '../data/mockData';
import { WarningCircle as AlertCircle, Clock, CheckCircle as CheckCircle2, X, MagnifyingGlass as Search, User } from "@phosphor-icons/react";
import { MatchDetailModal } from '../components/MatchDetailModal';
import { StatusBadge } from '../components/ui/status-badge';

export default function CaseManagement() {
  const [activeTab, setActiveTab] = useState<'requests' | 'stalled'>('requests');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const getUrgencyTone = (urgency: string): 'neutral' | 'danger' => {
    switch (urgency) {
      case 'acute': return 'danger';
      case 'chronic': return 'neutral';
      default: return 'neutral';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'acute': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'chronic': return <Clock className="w-5 h-5 text-foreground" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusTone = (status: string): 'neutral' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'flagged': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
        <p className="text-gray-500 mt-1">Intake & Matching System</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-foreground border-b-2 border-border'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Incoming Requests</span>
              <StatusBadge tone={moderationQueue.filter(q => q.status === 'pending').length > 0 ? 'danger' : 'neutral'}>
                {moderationQueue.filter(q => q.status === 'pending').length}
              </StatusBadge>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stalled')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'stalled'
                ? 'text-foreground border-b-2 border-border'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Stalled Cases</span>
              <StatusBadge tone={inactiveMatches.length > 0 ? 'warning' : 'neutral'}>
                {inactiveMatches.length}
              </StatusBadge>
            </div>
          </button>
        </div>

        {/* Incoming Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
            <div className="space-y-4">
              {moderationQueue.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getUrgencyIcon(request.urgency || 'chronic')}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{request.submittedBy}</h3>
                          <StatusBadge tone={getUrgencyTone(request.urgency || 'chronic')}>
                            {request.urgency === 'acute' ? 'Acute Crisis' : 'Chronic Need'}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-gray-600">{request.type}</p>
                        <p className="text-sm text-gray-700 mt-2">{request.content}</p>
                      </div>
                    </div>
                    <StatusBadge tone={getStatusTone(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </StatusBadge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">{request.timestamp}</span>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setSelectedMatch(request.id)}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Search className="w-4 h-4 inline mr-1" />
                            Find Match
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Flag
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-sm text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Matched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {moderationQueue.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">All caught up! No pending requests.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stalled Cases Tab */}
        {activeTab === 'stalled' && (
          <div className="p-6">
            <div className="space-y-4">
              {inactiveMatches.map((match) => (
                <div
                  key={match.id}
                  className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">{match.giverName} → {match.receiverName}</h3>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{match.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Matched: {match.matchedDate}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last activity: {match.lastContact}
                        </span>
                      </div>
                    </div>
                    <StatusBadge tone="warning">
                      {match.inactiveDays} days
                    </StatusBadge>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-yellow-200">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                      Send Reminder
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Reassign
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}

              {inactiveMatches.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">No stalled cases. All matches are active!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          requestId={selectedMatch}
        />
      )}
    </div>
  );
}
