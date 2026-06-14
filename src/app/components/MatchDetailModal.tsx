import { useState } from 'react';
import { moderationQueue, members } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CheckCircle as CheckCircle2, MagnifyingGlass as Search, Star } from "@phosphor-icons/react";

interface MatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

export function MatchDetailModal({ isOpen, onClose, requestId }: MatchDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGiverId, setSelectedGiverId] = useState<string | null>(null);

  const request = moderationQueue.find(q => q.id === requestId);
  
  if (!request) return null;

  // Get potential givers (those with "Giver" or "Both" role and in Growth stage)
  const potentialGivers = members.filter(m => 
    (m.role === 'Giver' || m.role === 'Both') && 
    m.stage === 'Growth' &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulate AI match score
  const getMatchScore = (member: typeof members[0]) => {
    // Simple simulation - higher scores for members with more service hours
    const baseScore = 75;
    const hoursBonus = Math.min(member.significance.hoursGiven / 10, 20);
    const pasBonus = member.agency.pasScore;
    return Math.round(baseScore + hoursBonus + pasBonus);
  };

  const handleApproveMatch = () => {
    console.log('Match approved:', { requestId, giverId: selectedGiverId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Request</DialogTitle>
          <DialogDescription>
            Find the best match for this help request using AI suggestions or manual search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Request Context */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">From:</span> {request.submittedBy}</p>
              <p><span className="font-medium">Type:</span> {request.type}</p>
              <p><span className="font-medium">Need:</span> {request.content}</p>
              <p><span className="font-medium">Urgency:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  request.urgency === 'acute' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.urgency === 'acute' ? 'Acute Crisis' : 'Chronic Need'}
                </span>
              </p>
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">AI Recommended Matches</h3>
            </div>
            
            <div className="space-y-3">
              {potentialGivers.slice(0, 3).map((giver) => {
                const matchScore = getMatchScore(giver);
                return (
                  <button
                    key={giver.id}
                    onClick={() => setSelectedGiverId(giver.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedGiverId === giver.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{giver.name}</h4>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {giver.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{giver.significance.hoursGiven} hours served • PAS: {giver.agency.pasScore}/10</p>
                        {giver.significance.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {giver.significance.badges.slice(0, 2).map((badge, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Show why this is a match */}
                        <p className="text-xs text-teal-700 italic mt-2">
                          ✓ High availability • ✓ Relevant experience • ✓ Strong track record
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-teal-600">{matchScore}%</div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Override Search */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Manual Override</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a different member..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {searchTerm && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {potentialGivers.map((giver) => (
                  <button
                    key={giver.id}
                    onClick={() => setSelectedGiverId(giver.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      selectedGiverId === giver.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{giver.name}</p>
                        <p className="text-xs text-gray-600">{giver.role} • {giver.significance.hoursGiven} hours</p>
                      </div>
                      {selectedGiverId === giver.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Tracker Info */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span>Open</span>
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span>Matched</span>
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span>Verified Complete</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              After approving the match, you must manually verify completion to award points & badges.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveMatch}
              disabled={!selectedGiverId}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Match
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
