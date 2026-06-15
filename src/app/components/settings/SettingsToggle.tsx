import { useState } from 'react';

interface SettingsToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function SettingsToggle({ label, description, defaultChecked = false }: SettingsToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 mr-4">
        <p className="text-sm text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

interface SettingsSelectProps {
  label: string;
  description?: string;
  options: string[];
  defaultValue?: string;
}

export function SettingsSelect({ label, description, options, defaultValue }: SettingsSelectProps) {
  return (
    <div className="py-2">
      <label className="block text-sm text-gray-900 mb-1">{label}</label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <select
        defaultValue={defaultValue || options[0]}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

interface SettingsInputProps {
  label: string;
  description?: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}

export function SettingsInput({ label, description, defaultValue, type = 'text', placeholder }: SettingsInputProps) {
  return (
    <div className="py-2">
      <label className="block text-sm text-gray-900 mb-1">{label}</label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    </div>
  );
}

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface SettingsCheckboxGroupProps {
  label: string;
  description?: string;
  options: { label: string; defaultChecked?: boolean }[];
}

export function SettingsCheckboxGroup({ label, description, options }: SettingsCheckboxGroupProps) {
  return (
    <div className="py-2">
      <p className="text-sm text-gray-900 mb-1">{label}</p>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <div className="space-y-2 ml-1">
        {options.map(opt => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={opt.defaultChecked}
              className="w-3.5 h-3.5 text-foreground rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
