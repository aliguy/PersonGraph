import type { ReactNode } from 'react';

interface SourceToggleProps {
  icon: ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function SourceToggle({ icon, label, description, enabled, onToggle }: SourceToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all w-full cursor-pointer ${
        enabled
          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
          : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)]'
      }`}
    >
      <div className={`mt-0.5 ${enabled ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</div>
      </div>
      <div
        className={`w-10 h-5 rounded-full flex items-center transition-colors mt-0.5 ${
          enabled ? 'bg-[var(--accent)] justify-end' : 'bg-[var(--border)] justify-start'
        }`}
      >
        <div className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm" />
      </div>
    </button>
  );
}
