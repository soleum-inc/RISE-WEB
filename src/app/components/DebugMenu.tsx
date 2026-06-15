import { useState } from 'react';
import { GearSix as Settings2, X, Heart, Shield, Lightning as Zap, Medal as Award, SquaresFour as LayoutDashboard, Check } from "@phosphor-icons/react";
import { useFramework, FrameworkMode } from '../context/FrameworkContext';

export function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode, showASSA } = useFramework();

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all flex items-center justify-center group"
        title="Debug: Switch UI Mode"
      >
        <Settings2 className="w-5 h-5" />
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          UI Mode: {showASSA ? 'BIAS' : 'Standard'}
        </span>
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold">Developer Mode</span>
              <span className="px-2 py-0.5 bg-yellow-500 text-gray-900 text-xs font-bold rounded">DEBUG</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UI Framework Mode</p>
              <div className="space-y-2">
                {/* Standard Mode */}
                <button
                  onClick={() => setMode('standard')}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    mode === 'standard'
                      ? 'border-border bg-secondary'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    mode === 'standard' ? 'bg-primary' : 'bg-gray-100'
                  }`}>
                    <LayoutDashboard className={`w-4 h-4 ${mode === 'standard' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${mode === 'standard' ? 'text-foreground' : 'text-gray-900'}`}>
                        Standard Mode
                      </p>
                      {mode === 'standard' && <Check className="w-4 h-4 text-foreground" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Clean admin view focused on member management, courses & events
                    </p>
                  </div>
                </button>

                {/* BIAS Mode */}
                <button
                  onClick={() => setMode('assa')}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    mode === 'assa'
                      ? 'border-border bg-secondary'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    mode === 'assa' ? 'bg-primary' : 'bg-gray-100'
                  }`}>
                    <Heart className={`w-4 h-4 ${mode === 'assa' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${mode === 'assa' ? 'text-foreground' : 'text-gray-900'}`}>
                        BIAS Framework Mode
                      </p>
                      {mode === 'assa' && <Check className="w-4 h-4 text-foreground" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Full BIAS lens: Belonging, Importance, Agency & Security dimensions
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* What changes */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {showASSA ? 'BIAS Mode Shows' : 'Standard Mode Hides'}
              </p>
              <ul className="space-y-1.5">
                {[
                  { icon: <Heart className="w-3 h-3 text-foreground" />, label: 'Community BIAS Health dashboard' },
                  { icon: <Shield className="w-3 h-3 text-foreground" />, label: 'Member BIAS quadrant cards' },
                  { icon: <Zap className="w-3 h-3 text-foreground" />, label: 'BIAS metric trends & charts' },
                  { icon: <Award className="w-3 h-3 text-amber-500" />, label: 'BIAS motivator insights' },
                  { icon: <Settings2 className="w-3 h-3 text-gray-400" />, label: 'BIAS content guidance in posts' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    {item.icon}
                    <span className={showASSA ? 'text-gray-700' : 'line-through text-gray-400'}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-400 italic">
                This debug panel is for development use only. All functionality is preserved in both modes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}