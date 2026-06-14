import { MapPin } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Org Logo */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-sm font-bold">RR</span>
        </div>
        {/* Org & Chapter Name */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 leading-tight">
            Retirement Reformation
          </span>
          <span className="text-xs text-gray-500 leading-tight flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Greater Austin Chapter
          </span>
        </div>
      </div>
    </div>
  );
}
