import { useState } from 'react';
import { members } from '../data/mockData';
import { useVertical } from '../context/VerticalContext';
import { type MatchDecision } from '../data/cases';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CheckCircle as CheckCircle2, MagnifyingGlass as Search, Star } from '@phosphor-icons/react';

interface MatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (decision: MatchDecision) => void;
  riserName?: string;
  need?: string;
  category?: string;
  urgency?: 'acute' | 'chronic';
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function getMatchScore(member: (typeof members)[0]) {
  // Simulated AI score: base + service-hours bonus + agency (PAS) bonus.
  const baseScore = 75;
  const hoursBonus = Math.min(member.significance.hoursGiven / 10, 20);
  const pasBonus = member.agency.pasScore;
  return Math.min(100, Math.round(baseScore + hoursBonus + pasBonus));
}

export function MatchDetailModal({
  isOpen,
  onClose,
  onConfirm,
  riserName,
  need,
  category,
  urgency,
}: MatchDetailModalProps) {
  const { theme } = useVertical();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGiverId, setSelectedGiverId] = useState<string | null>(null);

  const allGivers = members.filter((m) => (m.role === 'Giver' || m.role === 'Both') && m.stage === 'Growth');
  const aiTop = [...allGivers].sort((a, b) => getMatchScore(b) - getMatchScore(a)).slice(0, 3);
  const topMatchId = aiTop[0]?.id ?? null;
  const searchResults = allGivers.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const giverNoun = theme.giverLabel.replace(/s$/, '');

  const handleApproveMatch = () => {
    const giver = members.find((m) => m.id === selectedGiverId);
    if (!giver) return;
    const decision: MatchDecision = {
      patron: {
        name: giver.name,
        initials: initialsOf(giver.name),
        detail: `${giver.role} · ${giver.significance.hoursGiven} service hrs`,
      },
      score: getMatchScore(giver),
      reasons: [
        category ? `Experience relevant to ${category}` : 'Relevant experience for the request',
        `${giver.significance.hoursGiven} service hours${giver.significance.badges[0] ? ` · ${giver.significance.badges[0]}` : ''}`,
        `High agency (PAS ${giver.agency.pasScore}/10), active in Growth stage`,
      ],
      confirmedBy: theme.user.name,
      mode: selectedGiverId === topMatchId ? 'ai-accepted' : 'manual-override',
      timestamp: 'Just now',
    };
    onConfirm(decision);
    setSelectedGiverId(null);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Request</DialogTitle>
          <DialogDescription>
            Find the best {giverNoun.toLowerCase()} for this request — accept the AI suggestion or manually override.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Request context */}
          {(riserName || need) && (
            <div className="rounded-lg border border-border bg-secondary p-4">
              <h3 className="mb-2 font-semibold text-foreground">Request details</h3>
              <div className="space-y-1 text-sm">
                {riserName && <p><span className="font-medium">From:</span> {riserName}</p>}
                {category && <p><span className="font-medium">Type:</span> {category}</p>}
                {need && <p><span className="font-medium">Need:</span> {need}</p>}
                {urgency && (
                  <p>
                    <span className="font-medium">Urgency:</span>
                    <span
                      className={`ml-2 rounded px-2 py-0.5 text-xs font-medium ${
                        urgency === 'acute' ? 'bg-red-100 text-red-800' : 'bg-secondary text-foreground'
                      }`}
                    >
                      {urgency === 'acute' ? 'Acute Crisis' : 'Chronic Need'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Star className="size-5 text-foreground" weight="fill" />
              <h3 className="font-semibold text-foreground">AI Recommended Matches</h3>
            </div>
            <div className="space-y-3">
              {aiTop.map((giver, idx) => {
                const matchScore = getMatchScore(giver);
                return (
                  <button
                    key={giver.id}
                    onClick={() => setSelectedGiverId(giver.id)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      selectedGiverId === giver.id ? 'border-brand-500 bg-secondary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{giver.name}</h4>
                          {idx === 0 && (
                            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Top AI pick</span>
                          )}
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {giver.significance.hoursGiven} hours served • PAS: {giver.agency.pasScore}/10
                        </p>
                        {giver.significance.badges.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {giver.significance.badges.slice(0, 2).map((badge, i) => (
                              <span key={i} className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{badge}</span>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-xs italic text-muted-foreground">
                          ✓ {category ? `Relevant to ${category}` : 'Relevant experience'} • ✓ {giver.significance.hoursGiven}h served • ✓ Strong track record
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-foreground">{matchScore}%</div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Override */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="mb-3 font-semibold text-foreground">Manual Override</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search for a different ${giverNoun.toLowerCase()}…`}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-brand-500"
              />
            </div>
            {searchTerm && (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {searchResults.map((giver) => (
                  <button
                    key={giver.id}
                    onClick={() => setSelectedGiverId(giver.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedGiverId === giver.id ? 'border-brand-500 bg-secondary' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{giver.name}</p>
                        <p className="text-xs text-gray-600">{giver.role} • {giver.significance.hoursGiven} hours</p>
                      </div>
                      {selectedGiverId === giver.id && <CheckCircle2 className="size-5 text-foreground" />}
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && <p className="text-sm text-muted-foreground">No matches found.</p>}
              </div>
            )}
          </div>

          {/* Next steps tracker */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">Next Steps</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex size-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white">1</div>
              <span>Requested</span>
              <div className="flex size-6 items-center justify-center rounded-full bg-gray-300 font-bold text-white">2</div>
              <span>Matched</span>
              <div className="flex size-6 items-center justify-center rounded-full bg-gray-300 font-bold text-white">3</div>
              <span>Outcome Recorded</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              On confirm, the match is written to the case record (who, score, reasons, confirmed by, and AI-accepted
              vs overridden) and the case runs to a <strong>recorded outcome</strong> at close.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleApproveMatch}
              disabled={!selectedGiverId}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <CheckCircle2 className="size-4" />
              Confirm Match
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
