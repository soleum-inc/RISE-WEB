import { Heart, Shield, Lightning as Zap, Medal as Award, TrendUp as TrendingUp, TrendDown as TrendingDown, Minus } from "@phosphor-icons/react";

interface ASSAMetrics {
  acceptance: number; // Percentage
  security: number; // Percentage
  agency: number; // 1-10 scale
  significance: number; // Hours or count
}

interface ASSAHealthMetricsProps {
  metrics: ASSAMetrics;
  showInsights?: boolean;
  insights?: {
    acceptance?: string;
    security?: string;
    agency?: string;
    significance?: string;
    overall?: string;
  };
}

export function ASSAHealthMetrics({ metrics, showInsights = false, insights }: ASSAHealthMetricsProps) {
  const getHealthColor = (value: number, type: 'percentage' | 'pas') => {
    if (type === 'percentage') {
      if (value >= 75) return 'green';
      if (value >= 50) return 'yellow';
      return 'red';
    } else {
      // PAS score (1-10)
      if (value >= 7) return 'green';
      if (value >= 5) return 'yellow';
      return 'red';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const acceptanceHealth = getHealthColor(metrics.acceptance, 'percentage');
  const securityHealth = getHealthColor(metrics.security, 'percentage');
  const agencyHealth = getHealthColor(metrics.agency, 'pas');
  const significanceHealth = metrics.significance > 30 ? 'green' : metrics.significance > 15 ? 'yellow' : 'red';

  return (
    <div className="space-y-6">
      {/* BIAS Health Bars */}
      <div className="grid grid-cols-1 gap-4">
        {/* Belonging */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Belonging</h3>
                <p className="text-xs text-gray-500">Community connection & trust</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{metrics.acceptance}%</p>
              <p className="text-xs text-gray-500">with 2+ vouches</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                acceptanceHealth === 'green' ? 'bg-green-500' :
                acceptanceHealth === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${metrics.acceptance}%` }}
            />
          </div>
          {showInsights && insights?.acceptance && (
            <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">{insights.acceptance}</p>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Security</h3>
                <p className="text-xs text-gray-500">Safety & basic needs stability</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{metrics.security}%</p>
              <p className="text-xs text-gray-500">not in crisis</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                securityHealth === 'green' ? 'bg-green-500' :
                securityHealth === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${metrics.security}%` }}
            />
          </div>
          {showInsights && insights?.security && (
            <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">{insights.security}</p>
          )}
        </div>

        {/* Agency */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Agency</h3>
                <p className="text-xs text-gray-500">Power, options & skill development</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{metrics.agency.toFixed(1)}</p>
              <p className="text-xs text-gray-500">avg PAS (1-10)</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                agencyHealth === 'green' ? 'bg-green-500' :
                agencyHealth === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${(metrics.agency / 10) * 100}%` }}
            />
          </div>
          {showInsights && insights?.agency && (
            <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">{insights.agency}</p>
          )}
        </div>

        {/* Importance */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Importance</h3>
                <p className="text-xs text-gray-500">Value & contribution recognition</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{metrics.significance}</p>
              <p className="text-xs text-gray-500">avg hours contributed</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                significanceHealth === 'green' ? 'bg-green-500' :
                significanceHealth === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min((metrics.significance / 50) * 100, 100)}%` }}
            />
          </div>
          {showInsights && insights?.significance && (
            <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">{insights.significance}</p>
          )}
        </div>
      </div>

      {/* Overall Insights */}
      {showInsights && insights?.overall && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Admin Insights</h4>
          <p className="text-sm text-blue-800">{insights.overall}</p>
        </div>
      )}
    </div>
  );
}