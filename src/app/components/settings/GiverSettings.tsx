import { Buildings as Building2, SealCheck as BadgeCheck, MapPin, Tag as Tags, Heart, ArrowsClockwise as RefreshCw, Globe, CreditCard, TrendUp as TrendingUp, ChartBar as BarChart3, FileXls as FileSpreadsheet, Clock, Bell, Warning as AlertTriangle, Flag, Users, Lock, ClipboardText as ClipboardList, Eye } from "@phosphor-icons/react";
import { SettingsToggle, SettingsSelect, SettingsInput, SettingsSection, SettingsCheckboxGroup } from './SettingsToggle';

export function GiverProfileOrganization() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Profile & Organization</h2>
          <p className="text-xs text-gray-500">Manage your organization details</p>
        </div>
      </div>

      <SettingsSection title="Organization Details">
        <SettingsInput label="Organization Name" defaultValue="Hope Community Church" />
        <SettingsSelect
          label="Organization Type"
          options={['NGO / Non-Profit', 'Government Agency', 'Corporate CSR', 'Faith-Based Organization', 'Individual Giver', 'Foundation']}
          defaultValue="Faith-Based Organization"
        />
        <div className="py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">Verified Badge Status</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Last verified: January 15, 2026</p>
        </div>
      </SettingsSection>

      <SettingsSection title="Contact Person">
        <SettingsInput label="Contact Name" defaultValue="Pastor Tim Henderson" />
        <SettingsInput label="Role / Title" defaultValue="Lead Pastor & Executive Director" />
        <SettingsInput label="Contact Email" defaultValue="admin@hopecommunity.org" type="email" />
        <SettingsInput label="Contact Phone" defaultValue="(404) 555-0192" type="tel" />
      </SettingsSection>

      <SettingsSection title="Service Coverage">
        <div className="py-2">
          <p className="text-sm text-gray-900 mb-2">Service Areas (Geographic)</p>
          <div className="flex flex-wrap gap-2">
            {['Atlanta Metro', 'Fulton County', 'DeKalb County', 'Clayton County'].map(area => (
              <span key={area} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs rounded-full border border-brand-200">
                {area} &times;
              </span>
            ))}
            <button className="px-3 py-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-brand-500 hover:text-brand-600">
              + Add Area
            </button>
          </div>
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-900 mb-2">Categories of Aid Offered</p>
          <div className="flex flex-wrap gap-2">
            {['Food Assistance', 'Housing', 'Job Training', 'Mental Health', 'Youth Programs', 'Emergency Aid'].map(cat => (
              <span key={cat} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                {cat} &times;
              </span>
            ))}
            <button className="px-3 py-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600">
              + Add Category
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

export function GiverGivingPreferences() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Giving Preferences</h2>
          <p className="text-xs text-gray-500">Configure contribution settings</p>
        </div>
      </div>

      <SettingsSection title="Contribution Setup">
        <SettingsSelect
          label="Contribution Type"
          options={['One-time contributions', 'Recurring (monthly)', 'Recurring (quarterly)', 'Both one-time and recurring']}
          defaultValue="Both one-time and recurring"
        />
        <SettingsToggle
          label="Anonymous Giving"
          description="Hide your identity from beneficiaries"
          defaultChecked={false}
        />
      </SettingsSection>

      <SettingsSection title="Allocation Preferences">
        <SettingsCheckboxGroup
          label="Where should contributions go?"
          description="Select preferred allocation areas"
          options={[
            { label: 'Specific programs (you choose)', defaultChecked: true },
            { label: 'Geographic areas of greatest need', defaultChecked: false },
            { label: 'Need-type based (food, housing, etc.)', defaultChecked: true },
            { label: 'Platform discretion (where most needed)', defaultChecked: false },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Payment & Budget">
        <SettingsSelect
          label="Preferred Currency"
          options={['USD ($)', 'EUR (\u20ac)', 'GBP (\u00a3)', 'CAD (C$)', 'AUD (A$)']}
          defaultValue="USD ($)"
        />
        <SettingsSelect
          label="Payment Method"
          options={['Credit/Debit Card', 'Bank Transfer (ACH)', 'PayPal', 'Wire Transfer', 'Cryptocurrency']}
          defaultValue="Credit/Debit Card"
        />
        <div className="py-2">
          <label className="block text-sm text-gray-900 mb-1">Monthly Donation Cap</label>
          <p className="text-xs text-gray-500 mb-2">Set a maximum monthly contribution limit</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              defaultValue={5000}
              className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
            <span className="text-xs text-gray-400">per month</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

export function GiverTransparencyReporting() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Transparency & Reporting</h2>
          <p className="text-xs text-gray-500">Configure impact dashboards and reports</p>
        </div>
      </div>

      <SettingsSection title="Impact Dashboard">
        <SettingsCheckboxGroup
          label="Which metrics matter most to you?"
          description="Customize your impact dashboard view"
          options={[
            { label: 'Beneficiaries served', defaultChecked: true },
            { label: 'Programs funded', defaultChecked: true },
            { label: 'Geographic reach', defaultChecked: false },
            { label: 'Outcome success rates', defaultChecked: true },
            { label: 'Cost per outcome', defaultChecked: false },
            { label: 'Repeat engagement rates', defaultChecked: true },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Report Delivery">
        <SettingsSelect
          label="Report Frequency"
          options={['Real-time (live dashboard)', 'Monthly', 'Quarterly', 'Annually']}
          defaultValue="Monthly"
        />
        <SettingsSelect
          label="Preferred Format"
          options={['Summary overview', 'Detailed narrative', 'Exportable CSV/Excel', 'PDF report']}
          defaultValue="Summary overview"
        />
      </SettingsSection>
    </div>
  );
}

export function GiverNotifications() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Giver Notifications</h2>
          <p className="text-xs text-gray-500">Stay informed about your contributions and impact</p>
        </div>
      </div>

      <SettingsSection title="Contribution Alerts">
        <SettingsToggle label="Confirmation of aid delivered" description="Know when your contribution reaches a beneficiary" defaultChecked={true} />
        <SettingsToggle label="Beneficiary milestones" description="Anonymized, consent-based progress updates" defaultChecked={true} />
        <SettingsToggle label="Platform announcements and impact reports" description="Major updates and periodic impact summaries" defaultChecked={true} />
      </SettingsSection>

      <SettingsSection title="Safety & Integrity">
        <SettingsToggle label="Fraud or anomaly alerts" description="Immediate notification of suspicious activity" defaultChecked={true} />
        <SettingsToggle label="Program status changes" description="When funded programs are paused or discontinued" defaultChecked={true} />
      </SettingsSection>
    </div>
  );
}

export function GiverTeamAccess() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Team & Access</h2>
          <p className="text-xs text-gray-500">Manage team members, roles, and permissions</p>
        </div>
      </div>

      <SettingsSection title="Team Members">
        <div className="space-y-3">
          {[
            { initials: 'TH', name: 'Pastor Tim Henderson', email: 'admin@hopecommunity.org', role: 'Admin' },
            { initials: 'SJ', name: 'Sarah Jenkins', email: 'sarah@hopecommunity.org', role: 'Case Manager' },
            { initials: 'MR', name: 'Marcus Rivera', email: 'marcus@hopecommunity.org', role: 'Volunteer Coordinator' },
            { initials: 'DA', name: 'Diana Akoto', email: 'diana@hopecommunity.org', role: 'Finance' },
          ].map(member => (
            <div key={member.email} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  {member.initials}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                member.role === 'Admin' ? 'bg-brand-100 text-brand-700' :
                member.role === 'Case Manager' ? 'bg-blue-100 text-blue-700' :
                member.role === 'Finance' ? 'bg-amber-100 text-amber-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {member.role}
              </span>
            </div>
          ))}
          <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:border-brand-600 hover:text-brand-600">
            + Invite Team Member
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Workflows & Audit">
        <SettingsToggle
          label="Require Approval for Disbursements"
          description="Contributions above a threshold require a second approval"
          defaultChecked={true}
        />
        <SettingsInput
          label="Approval Threshold"
          description="Amount above which a second approval is required"
          defaultValue="$500"
        />
        <SettingsToggle
          label="Audit Log Access"
          description="Enable detailed logging of all team actions"
          defaultChecked={true}
        />
        <div className="pt-2">
          <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> View Audit Log</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
