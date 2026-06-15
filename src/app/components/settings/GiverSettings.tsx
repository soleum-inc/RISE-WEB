import { Buildings as Building2, SealCheck as BadgeCheck, MapPin, Tag as Tags, Heart, ArrowsClockwise as RefreshCw, Globe, CreditCard, TrendUp as TrendingUp, ChartBar as BarChart3, FileXls as FileSpreadsheet, Clock, Bell, Warning as AlertTriangle, Flag, Users, Lock, ClipboardText as ClipboardList, Eye } from "@phosphor-icons/react";
import { SettingsToggle, SettingsSelect, SettingsInput, SettingsSection, SettingsCheckboxGroup } from './SettingsToggle';
import { useVertical } from '../../context/VerticalContext';
import { useState } from 'react';
import { toast } from 'sonner';

export function GiverProfileOrganization() {
  const { theme } = useVertical();
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-foreground" />
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
              <span key={area} className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full border border-border">
                {area} &times;
              </span>
            ))}
            <button className="px-3 py-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-border hover:text-foreground">
              + Add Area
            </button>
          </div>
        </div>
        <div className="py-2">
          <p className="text-sm text-gray-900 mb-2">Categories of Aid Offered</p>
          <div className="flex flex-wrap gap-2">
            {theme.aidCategories.map(cat => (
              <span key={cat} className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full border border-border">
                {cat} &times;
              </span>
            ))}
            <button className="px-3 py-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-border hover:text-foreground">
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
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-foreground" />
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
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-foreground" />
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

const TEAM_ROLES = ['Admin', 'Case Manager', 'Volunteer / Viewer'] as const;
type TeamRole = (typeof TEAM_ROLES)[number];

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: TeamRole;
  pending?: boolean;
}

const teamInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function GiverTeamAccess() {
  const { theme } = useVertical();
  const domain = theme.org.domain;

  const seed: TeamMember[] = [
    { id: 't1', initials: theme.user.initials, name: theme.user.name, email: `admin@${domain}`, role: 'Admin' },
    { id: 't2', initials: 'SJ', name: 'Sarah Jenkins', email: `sarah@${domain}`, role: 'Case Manager' },
    { id: 't3', initials: 'MR', name: 'Marcus Rivera', email: `marcus@${domain}`, role: 'Case Manager' },
    { id: 't4', initials: 'DA', name: 'Diana Akoto', email: `diana@${domain}`, role: 'Volunteer / Viewer' },
  ];

  const [members, setMembers] = useState<TeamMember[]>(seed);
  const [invite, setInvite] = useState('');

  function sendInvite() {
    const email = invite.trim().toLowerCase();
    if (!email.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }
    const name = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const onDomain = email.endsWith(`@${domain}`);
    setMembers((prev) => [
      ...prev,
      { id: `t${prev.length + 1}`, initials: teamInitials(name), name, email, role: 'Volunteer / Viewer', pending: true },
    ]);
    setInvite('');
    toast.success('Invite sent', {
      description: onDomain
        ? `${email} invited under your verified domain — no extra cost.`
        : `${email} invited (outside @${domain}).`,
    });
  }

  function setRole(id: string, role: TeamRole) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-lg text-gray-900">Team & Access</h2>
          <p className="text-xs text-gray-500">Add your whole team under one verified domain.</p>
        </div>
      </div>

      {/* Verified domain + flat-rate pricing */}
      <div className="mb-6 rounded-xl border border-border bg-secondary/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">@{domain}</p>
              <p className="text-xs text-muted-foreground">Verified organization domain</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <BadgeCheck className="w-3.5 h-3.5" weight="fill" /> Verified
          </span>
        </div>
        <p className="mt-3 text-sm text-foreground">
          <strong>Unlimited staff under one verified domain — one flat rate.</strong> Anyone with an{' '}
          <span className="font-medium">@{domain}</span> email joins your team at no extra cost.
        </p>
      </div>

      {/* Invite by email */}
      <SettingsSection title="Invite by email">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendInvite()}
            placeholder={`name@${domain}`}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={sendInvite}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Send invite
          </button>
        </div>
      </SettingsSection>

      {/* Members + roles */}
      <SettingsSection title={`Team members (${members.length})`}>
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-gray-900">
                    <span className="truncate">{m.name}</span>
                    {m.pending && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">Pending</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <select
                value={m.role}
                onChange={(e) => setRole(m.id, e.target.value as TeamRole)}
                className="shrink-0 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-brand-500"
              >
                {TEAM_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          ))}
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
