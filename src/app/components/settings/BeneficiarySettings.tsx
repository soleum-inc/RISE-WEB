import {
  User, Globe, MapPin, Home, Accessibility, MessageSquare,
  Radar, Brain, EyeOff, Shield, FileText, Clock,
  Bell, Calendar, Briefcase, MessageCircle,
  Upload, Share2, AlarmClock,
  Type, Contrast, Monitor, Smartphone, WifiOff
} from 'lucide-react';
import { SettingsToggle, SettingsSelect, SettingsInput, SettingsSection, SettingsCheckboxGroup } from './SettingsToggle';

export function BeneficiaryProfileIdentity() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Profile & Identity</h2>
          <p className="text-xs text-gray-500">Manage how you appear to the community</p>
        </div>
      </div>

      <SettingsSection title="Display Information">
        <SettingsInput
          label="Display Name"
          description="Not required to be your real name — preserving your dignity and anonymity"
          defaultValue="Maria G."
          placeholder="Choose a display name"
        />
        <SettingsSelect
          label="Preferred Language"
          options={['English', 'Spanish', 'French', 'Arabic', 'Mandarin', 'Portuguese', 'Swahili', 'Hindi', 'Tagalog', 'Haitian Creole']}
          defaultValue="English"
        />
        <SettingsInput
          label="Location"
          description="City or region level only — exact address is never shared"
          defaultValue="Atlanta, GA"
          placeholder="City, State/Region"
        />
      </SettingsSection>

      <SettingsSection title="Household Composition (Optional)">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Adults</label>
            <input type="number" defaultValue={2} min={0} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Children</label>
            <input type="number" defaultValue={3} min={0} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dependents</label>
            <input type="number" defaultValue={1} min={0} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Accessibility Needs">
        <SettingsCheckboxGroup
          label="Select all that apply"
          options={[
            { label: 'Visual assistance', defaultChecked: false },
            { label: 'Hearing assistance', defaultChecked: false },
            { label: 'Cognitive accessibility', defaultChecked: true },
            { label: 'Mobility assistance', defaultChecked: false },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Communication Preference">
        <SettingsCheckboxGroup
          label="How would you like to be contacted?"
          options={[
            { label: 'Push notifications', defaultChecked: true },
            { label: 'SMS text messages', defaultChecked: true },
            { label: 'WhatsApp', defaultChecked: false },
            { label: 'USSD (feature phone)', defaultChecked: false },
          ]}
        />
      </SettingsSection>
    </div>
  );
}

export function BeneficiaryNeedsMatching() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Radar className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Needs & Matching</h2>
          <p className="text-xs text-gray-500">Control how services are matched to you</p>
        </div>
      </div>

      <SettingsSection title="Service Preferences">
        <SettingsSelect
          label="Preferred Service Radius"
          description="How far are you willing to travel for services?"
          options={['5 miles', '10 miles', '25 miles', '50 miles', 'No limit']}
          defaultValue="10 miles"
        />
        <SettingsToggle
          label="Proactive Matching"
          description="AI will automatically surface relevant programs based on your profile"
          defaultChecked={true}
        />
      </SettingsSection>

      <SettingsSection title="Excluded Categories">
        <p className="text-xs text-gray-500 mb-3">Exclude categories you don't want matched, for privacy or personal reasons</p>
        <SettingsCheckboxGroup
          label="Exclude from matching"
          options={[
            { label: 'Mental health services', defaultChecked: false },
            { label: 'Substance abuse programs', defaultChecked: false },
            { label: 'Domestic violence resources', defaultChecked: false },
            { label: 'Immigration services', defaultChecked: false },
            { label: 'Financial counseling', defaultChecked: false },
            { label: 'Religious programs', defaultChecked: true },
          ]}
        />
      </SettingsSection>
    </div>
  );
}

export function BeneficiaryPrivacyData() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <EyeOff className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Privacy & Data</h2>
          <p className="text-xs text-gray-500">Control who sees your information</p>
        </div>
      </div>

      <SettingsSection title="Visibility Mode">
        <SettingsToggle
          label="Anonymous Mode"
          description="Only your needs profile is visible to service providers — no name or identity shared"
          defaultChecked={false}
        />
      </SettingsSection>

      <SettingsSection title="Data Sharing Consent">
        <p className="text-xs text-gray-500 mb-3">Granular control over what different parties can see</p>
        <SettingsToggle
          label="NGO Service Providers"
          description="Share profile data with NGOs providing direct services"
          defaultChecked={true}
        />
        <SettingsToggle
          label="Government Agencies"
          description="Share data with government program administrators"
          defaultChecked={false}
        />
        <SettingsToggle
          label="Aggregated Research Insights"
          description="Allow anonymized data in research and impact reports"
          defaultChecked={true}
        />
      </SettingsSection>

      <SettingsSection title="Data Management">
        <SettingsToggle
          label="Consent to Outcome Tracking"
          description="Allow follow-up on referrals to measure program effectiveness"
          defaultChecked={true}
        />
        <div className="pt-3">
          <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Request History Deletion
          </button>
          <p className="text-xs text-gray-400 mt-1">Permanently remove your interaction and referral history</p>
        </div>
      </SettingsSection>
    </div>
  );
}

export function BeneficiaryNotifications() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-500">Choose what updates you receive and how often</p>
        </div>
      </div>

      <SettingsSection title="Notification Types">
        <SettingsToggle label="Referral status updates" description="Know when your referral moves forward" defaultChecked={true} />
        <SettingsToggle label="New services matching your profile" description="Get alerted when new programs become available" defaultChecked={true} />
        <SettingsToggle label="Application deadlines" description="Reminders before enrollment windows close" defaultChecked={true} />
        <SettingsToggle label="Case worker messages" description="Direct messages from your assigned case worker" defaultChecked={true} />
      </SettingsSection>

      <SettingsSection title="Frequency Controls">
        <SettingsSelect
          label="Notification Frequency"
          description="How often should non-urgent notifications be delivered?"
          options={['Immediate', 'Daily digest', 'Weekly summary']}
          defaultValue="Daily digest"
        />
      </SettingsSection>
    </div>
  );
}

export function BeneficiaryDocumentsRecords() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Documents & Records</h2>
          <p className="text-xs text-gray-500">Manage your secure document vault</p>
        </div>
      </div>

      <SettingsSection title="Secure Document Vault">
        <div className="space-y-3">
          {[
            { name: 'State ID', type: 'ID Document', expires: '2027-08-15', shared: ['Hope Community', 'Fulton County DHS'] },
            { name: 'Proof of Address', type: 'Utility Bill', expires: null, shared: ['Hope Community'] },
            { name: 'Immunization Record', type: 'Medical', expires: null, shared: [] },
            { name: 'Birth Certificate (Child)', type: 'ID Document', expires: null, shared: ['Head Start Program'] },
          ].map(doc => (
            <div key={doc.name} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{doc.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">{doc.type}</span>
              </div>
              {doc.expires && (
                <p className="text-xs text-amber-600 ml-6">Expires: {doc.expires}</p>
              )}
              <div className="ml-6 mt-1 flex items-center gap-1">
                <Share2 className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {doc.shared.length > 0 ? `Shared with: ${doc.shared.join(', ')}` : 'Not shared'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-teal-500 hover:text-teal-600 w-full justify-center">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Document Settings">
        <SettingsToggle
          label="Expiry Reminders"
          description="Get notified 30 days before documents expire"
          defaultChecked={true}
        />
        <SettingsToggle
          label="Require Approval for Access Requests"
          description="Service providers must request access to each document individually"
          defaultChecked={true}
        />
      </SettingsSection>
    </div>
  );
}

export function BeneficiaryAccessibility() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Accessibility className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Accessibility & Experience</h2>
          <p className="text-xs text-gray-500">Customize the interface for your needs</p>
        </div>
      </div>

      <SettingsSection title="Visual Settings">
        <SettingsSelect
          label="Text Size"
          options={['Small', 'Medium (Default)', 'Large', 'Extra Large']}
          defaultValue="Medium (Default)"
        />
        <SettingsToggle
          label="High Contrast Mode"
          description="Increase contrast for better readability"
          defaultChecked={false}
        />
        <SettingsToggle
          label="Screen Reader Optimization"
          description="Enhanced ARIA labels and navigation for assistive technology"
          defaultChecked={false}
        />
      </SettingsSection>

      <SettingsSection title="Experience">
        <SettingsToggle
          label="Simplified UI Mode"
          description="Fewer steps, larger touch targets, streamlined navigation"
          defaultChecked={false}
        />
        <SettingsToggle
          label="Offline Mode"
          description="Cache essential data for use without internet connection"
          defaultChecked={true}
        />
        <SettingsSelect
          label="Offline Data Scope"
          description="What to cache when offline mode is enabled"
          options={['Essential only (referrals, contacts)', 'Essential + documents', 'Everything']}
          defaultValue="Essential only (referrals, contacts)"
        />
      </SettingsSection>
    </div>
  );
}
