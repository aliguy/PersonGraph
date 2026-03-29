import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Code2, MessageCircle, Video, FileText,
  Mic, GraduationCap, Lightbulb, Scan, ChevronDown, ChevronUp
} from 'lucide-react';
import { SourceToggle } from './SourceToggle';
import { useScanStore } from '../../stores/scanStore';
import type { ScanConfig } from '../../types';

const defaultSources: ScanConfig['sources'] = {
  linkedin: true,
  github: true,
  twitter: true,
  youtube: true,
  articles: true,
  podcasts: true,
  scholar: false,
  patents: false,
};

const sourceOptions = [
  { key: 'linkedin' as const, icon: <User className="w-5 h-5" />, label: 'LinkedIn', description: 'Profile, experience, skills, education' },
  { key: 'github' as const, icon: <Code2 className="w-5 h-5" />, label: 'GitHub', description: 'Repositories, contributions, READMEs' },
  { key: 'twitter' as const, icon: <MessageCircle className="w-5 h-5" />, label: 'Twitter / X', description: 'Tweets, bio, engagement' },
  { key: 'youtube' as const, icon: <Video className="w-5 h-5" />, label: 'YouTube', description: 'Video interviews, talks, transcripts' },
  { key: 'articles' as const, icon: <FileText className="w-5 h-5" />, label: 'Articles & Blogs', description: 'Medium, Substack, personal blogs' },
  { key: 'podcasts' as const, icon: <Mic className="w-5 h-5" />, label: 'Podcasts', description: 'Podcast appearances and transcripts' },
  { key: 'scholar' as const, icon: <GraduationCap className="w-5 h-5" />, label: 'Google Scholar', description: 'Academic papers, citations' },
  { key: 'patents' as const, icon: <Lightbulb className="w-5 h-5" />, label: 'Patents', description: 'Patent filings and grants' },
];

export function ScanForm() {
  const navigate = useNavigate();
  const addScan = useScanStore((s) => s.addScan);
  const apiKeys = useScanStore((s) => s.apiKeys);

  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [sources, setSources] = useState(defaultSources);
  const [maxSources, setMaxSources] = useState(50);
  const [disambiguationThreshold, setDisambiguationThreshold] = useState(0.7);
  const [includeQuotes, setIncludeQuotes] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const missingKeys = !apiKeys.anthropic || !apiKeys.serpapi;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !linkedinUrl.trim()) return;

    const config: ScanConfig = {
      name: name.trim(),
      linkedinUrl: linkedinUrl.trim(),
      sources,
      maxSources,
      disambiguationThreshold,
      includeQuotes,
      includeTimeline,
    };

    const scan = addScan(config);
    navigate(`/scans/${scan.id}`);
  };

  const toggleSource = (key: keyof typeof sources) => (enabled: boolean) => {
    setSources((prev) => ({ ...prev, [key]: enabled }));
  };

  const enabledCount = Object.values(sources).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">Map a Person's Brain</h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Enter a name and LinkedIn URL. We'll discover all public information and construct a navigable 3D knowledge graph.
        </p>
      </div>

      {missingKeys && (
        <div className="mb-6 p-4 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 text-sm">
          <span className="text-[var(--warning)] font-medium">API keys required.</span>{' '}
          <span className="text-[var(--text-secondary)]">
            Configure at least Anthropic and SerpAPI keys in{' '}
            <a href="/admin/keys" className="text-[var(--accent)] underline">API Keys</a> before scanning.
          </span>
        </div>
      )}

      {/* Name + LinkedIn */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jensen Huang"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">LinkedIn URL</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            required
          />
        </div>
      </div>

      {/* Source Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-[var(--text-primary)]">Data Sources</label>
          <span className="text-xs text-[var(--text-secondary)]">{enabledCount} of {sourceOptions.length} enabled</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sourceOptions.map((opt) => (
            <SourceToggle
              key={opt.key}
              icon={opt.icon}
              label={opt.label}
              description={opt.description}
              enabled={sources[opt.key]}
              onToggle={toggleSource(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent border-none"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-5 p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div>
              <label className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-primary)]">Max Sources</span>
                <span className="text-[var(--text-secondary)] font-mono">{maxSources}</span>
              </label>
              <input
                type="range"
                min={10}
                max={200}
                step={10}
                value={maxSources}
                onChange={(e) => setMaxSources(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>10 (fast)</span>
                <span>200 (thorough)</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-primary)]">Disambiguation Threshold</span>
                <span className="text-[var(--text-secondary)] font-mono">{disambiguationThreshold}</span>
              </label>
              <input
                type="range"
                min={0.3}
                max={0.95}
                step={0.05}
                value={disambiguationThreshold}
                onChange={(e) => setDisambiguationThreshold(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>0.3 (more results, less precise)</span>
                <span>0.95 (strict match)</span>
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuotes}
                  onChange={(e) => setIncludeQuotes(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-[var(--text-primary)]">Extract Quotes</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeline}
                  onChange={(e) => setIncludeTimeline(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-[var(--text-primary)]">Build Timeline</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!name.trim() || !linkedinUrl.trim() || missingKeys}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors cursor-pointer border-none"
      >
        <Scan className="w-4 h-4" />
        Start Brain Mapping
      </button>
    </form>
  );
}
