import {
  Shield, Fingerprint, KeyRound, Smartphone, Monitor, RotateCcw,
  UserCog, Link2, Download, Trash2,
  HelpCircle, MessageCircle, AlertOctagon, Phone,
  BadgeCheck, Award, IdCard
} from 'lucide-react';
import { SettingsToggle, SettingsSelect, SettingsInput, SettingsSection, SettingsCheckboxGroup } from './SettingsToggle';

export function SharedSecurity() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Security</h2>
          <p className="text-xs text-gray-500">Protect your account and data</p>
        </div>
      </div>

      <SettingsSection title="Authentication">
        <SettingsToggle
          label="Biometric Login"
          description="Use face or fingerprint to sign in"
          defaultChecked={true}
        />
        <SettingsToggle
          label="PIN or Passphrase"
          description="Set a secondary PIN for sensitive actions"
          defaultChecked={false}
        />
        <SettingsToggle
          label="Two-Factor Authentication"
          description="Require a second verification step at login"
          defaultChecked={true}
        />
      </SettingsSection>

      <SettingsSection title="Sessions">
        <div className="space-y-3">
          {[
            { device: 'Chrome on MacBook Pro', location: 'Atlanta, GA', time: 'Active now', current: true },
            { device: 'Safari on iPhone 15', location: 'Atlanta, GA', time: '2 hours ago', current: false },
            { device: 'Firefox on Windows PC', location: 'Decatur, GA', time: '3 days ago', current: false },
          ].map(session => (
            <div key={session.device} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{session.device}</p>
                  <p className="text-xs text-gray-500">{session.location} &middot; {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Current</span>
              ) : (
                <button className="text-xs text-red-500 hover:text-red-700">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Account Recovery">
        <SettingsSelect
          label="Recovery Method"
          description="Important for users with limited literacy or in vulnerable situations"
          options={['Email recovery', 'SMS recovery', 'Trusted contact recovery', 'Security questions', 'Recovery key']}
          defaultValue="Email recovery"
        />
        <SettingsInput
          label="Recovery Email"
          defaultValue="tim.henderson@gmail.com"
          type="email"
        />
        <SettingsInput
          label="Recovery Phone"
          defaultValue="(404) 555-0193"
          type="tel"
        />
      </SettingsSection>
    </div>
  );
}

export function SharedAccountManagement() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <UserCog className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Account Management</h2>
          <p className="text-xs text-gray-500">Manage your account type and data</p>
        </div>
      </div>

      <SettingsSection title="Account Type">
        <SettingsSelect
          label="Account Role"
          description="Your primary role on the platform"
          options={['Beneficiary', 'Giver (Individual)', 'Caseworker', 'NGO Admin', 'Platform Admin']}
          defaultValue="NGO Admin"
        />
      </SettingsSection>

      <SettingsSection title="Linked Accounts">
        <div className="space-y-3">
          {[
            { name: 'Hope Community Church', type: 'Organization', status: 'Primary' },
            { name: 'Atlanta Aid Network', type: 'Partner Network', status: 'Linked' },
          ].map(account => (
            <div key={account.name} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                account.status === 'Primary' ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {account.status}
              </span>
            </div>
          ))}
          <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:border-teal-600 hover:text-teal-600">
            + Link Another Account
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Data & Account Actions">
        <div className="space-y-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 w-full">
            <Download className="w-4 h-4" /> Export My Data
          </button>
          <p className="text-xs text-gray-400">Download all your data in a portable format (JSON/CSV)</p>
          <div className="pt-2 border-t border-gray-200">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 w-full">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
            <p className="text-xs text-gray-400 mt-1">Permanently delete your account and all associated data. This cannot be undone.</p>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

export function SharedSupport() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Support</h2>
          <p className="text-xs text-gray-500">Get help and report issues</p>
        </div>
      </div>

      <SettingsSection title="Help Resources">
        <div className="space-y-3">
          <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 w-full text-left">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Help Center</p>
              <p className="text-xs text-gray-500">Contextual, language-matched articles and guides</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 w-full text-left">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Chat with Support</p>
              <p className="text-xs text-gray-500">Live chat available Mon-Fri, 8am-8pm EST</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 w-full text-left">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Report a Service or Bad Actor</p>
              <p className="text-xs text-gray-500">Flag suspicious behavior or report a concern</p>
            </div>
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Emergency Resources">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-800">Emergency Contact Shortcuts</p>
          </div>
          <p className="text-xs text-red-600 mb-3">One-tap access to crisis resources</p>
          <div className="space-y-2">
            {[
              { name: 'National Crisis Hotline', number: '988' },
              { name: 'Domestic Violence Hotline', number: '1-800-799-7233' },
              { name: 'Child Abuse Hotline', number: '1-800-422-4453' },
              { name: 'SAMHSA Helpline', number: '1-800-662-4357' },
            ].map(contact => (
              <div key={contact.number} className="flex items-center justify-between p-2 bg-white rounded border border-red-100">
                <span className="text-sm text-gray-900">{contact.name}</span>
                <a href={`tel:${contact.number}`} className="text-sm text-red-600 hover:underline">{contact.number}</a>
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

export function SharedTrustVerification() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Trust & Verification</h2>
          <p className="text-xs text-gray-500">Manage your verification status and credentials</p>
        </div>
      </div>

      <SettingsSection title="Verification Status">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-3">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-green-800">Organization Verified</p>
              <p className="text-xs text-green-600">Verified since: March 2024 &middot; Next review: March 2026</p>
            </div>
          </div>
        </div>
        <SettingsToggle
          label="Display Verification Badge"
          description="Show your verified badge on your public profile"
          defaultChecked={true}
        />
      </SettingsSection>

      <SettingsSection title="Credentials">
        <p className="text-xs text-gray-500 mb-3">For caseworkers and field workers</p>
        <div className="space-y-3">
          {[
            { name: 'Licensed Clinical Social Worker (LCSW)', issuer: 'State of Georgia', expires: '2027-06-30', status: 'Active' },
            { name: 'Trauma-Informed Care Certification', issuer: 'SAMHSA', expires: '2026-12-15', status: 'Active' },
            { name: 'CPR/First Aid', issuer: 'American Red Cross', expires: '2026-03-01', status: 'Expiring Soon' },
          ].map(cred => (
            <div key={cred.name} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{cred.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  cred.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {cred.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-6">Issued by: {cred.issuer}</p>
              <p className="text-xs text-gray-500 ml-6">Expires: {cred.expires}</p>
            </div>
          ))}
          <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:border-teal-600 hover:text-teal-600">
            + Add Credential
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
