import { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle, ExternalLink } from 'lucide-react';
import { useScanStore } from '../../stores/scanStore';
import type { ApiKeyConfig } from '../../types';

interface KeyField {
  key: keyof ApiKeyConfig;
  label: string;
  required: boolean;
  placeholder: string;
  docsUrl: string;
  description: string;
}

const keyFields: KeyField[] = [
  {
    key: 'anthropic',
    label: 'Anthropic (Claude)',
    required: true,
    placeholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/',
    description: 'Used for entity extraction, disambiguation, and topic clustering',
  },
  {
    key: 'serpapi',
    label: 'SerpAPI',
    required: true,
    placeholder: 'your-serpapi-key',
    docsUrl: 'https://serpapi.com/',
    description: 'Used for web search discovery across Google, Scholar, Patents',
  },
  {
    key: 'openai',
    label: 'OpenAI',
    required: false,
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/',
    description: 'Used for generating text embeddings (text-embedding-3-small)',
  },
  {
    key: 'proxycurl',
    label: 'Proxycurl',
    required: false,
    placeholder: 'your-proxycurl-key',
    docsUrl: 'https://nubela.co/proxycurl/',
    description: 'Used for LinkedIn profile data extraction',
  },
  {
    key: 'github',
    label: 'GitHub',
    required: false,
    placeholder: 'ghp_...',
    docsUrl: 'https://github.com/settings/tokens',
    description: 'Increases GitHub API rate limit from 60 to 5000 req/hr',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    required: false,
    placeholder: 'Bearer token...',
    docsUrl: 'https://developer.x.com/',
    description: 'Used to fetch tweets and profile data',
  },
  {
    key: 'youtube',
    label: 'YouTube Data API',
    required: false,
    placeholder: 'AIza...',
    docsUrl: 'https://console.cloud.google.com/',
    description: 'Used to search and fetch video transcripts',
  },
];

export function ApiKeysPanel() {
  const apiKeys = useScanStore((s) => s.apiKeys);
  const setApiKeys = useScanStore((s) => s.setApiKeys);
  const [localKeys, setLocalKeys] = useState<ApiKeyConfig>({ ...apiKeys });
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = () => {
    setApiKeys(localKeys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(localKeys) !== JSON.stringify(apiKeys);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">API Keys</h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Configure API keys for data sources. Keys are stored locally in your browser.
        </p>
      </div>

      <div className="space-y-4">
        {keyFields.map((field) => (
          <div
            key={field.key}
            className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">{field.label}</label>
                {field.required && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-medium">
                    REQUIRED
                  </span>
                )}
                {!field.required && localKeys[field.key] && (
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                )}
              </div>
              <a
                href={field.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Get key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{field.description}</p>
            <div className="flex gap-2">
              <input
                type={visibleKeys.has(field.key) ? 'text' : 'password'}
                value={localKeys[field.key]}
                onChange={(e) => setLocalKeys((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 outline-none focus:border-[var(--accent)] transition-colors text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => toggleVisibility(field.key)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {visibleKeys.has(field.key) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors cursor-pointer border-none"
        >
          <Save className="w-4 h-4" />
          Save Keys
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-[var(--success)]">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
