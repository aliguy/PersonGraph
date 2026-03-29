import { useParams, Link } from 'react-router-dom';
import { useScanStore } from '../stores/scanStore';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';

export function ScanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const scan = useScanStore((s) => s.scans.find((sc) => sc.id === id));

  if (!scan) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-secondary)] mb-4">Scan not found.</p>
        <Link to="/scans" className="text-[var(--accent)] text-sm no-underline">
          Back to scans
        </Link>
      </div>
    );
  }

  const enabledSources = Object.entries(scan.config.sources)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/scans"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to scans
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">{scan.config.name}</h2>
          <a
            href={scan.config.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] no-underline transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {scan.config.linkedinUrl}
          </a>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          scan.status === 'ready' ? 'bg-[var(--success)]/20 text-[var(--success)]' :
          scan.status === 'error' ? 'bg-[var(--danger)]/20 text-[var(--danger)]' :
          'bg-[var(--accent)]/20 text-[var(--accent)]'
        }`}>
          {scan.status}
        </span>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Sources Found</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{scan.sourcesFound}</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Processed</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{scan.sourcesProcessed}</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Nodes Generated</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{scan.nodesGenerated}</div>
        </div>
      </div>

      {/* Config Summary */}
      <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mb-8">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Scan Configuration</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Max Sources:</span>{' '}
            <span className="text-[var(--text-primary)]">{scan.config.maxSources}</span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Disambiguation:</span>{' '}
            <span className="text-[var(--text-primary)]">{scan.config.disambiguationThreshold}</span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Quotes:</span>{' '}
            <span className="text-[var(--text-primary)]">{scan.config.includeQuotes ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Timeline:</span>{' '}
            <span className="text-[var(--text-primary)]">{scan.config.includeTimeline ? 'Yes' : 'No'}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {enabledSources.map((source) => (
            <span
              key={source}
              className="px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] capitalize flex items-center gap-1"
            >
              <Globe className="w-3 h-3" /> {source}
            </span>
          ))}
        </div>
      </div>

      {/* 3D Graph Placeholder */}
      <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">3D Brain Graph</h3>
        </div>
        <div className="h-[500px] flex items-center justify-center text-[var(--text-secondary)] text-sm">
          {scan.status === 'ready'
            ? '3D graph will render here'
            : scan.status === 'error'
              ? `Error: ${scan.error || 'Unknown error'}`
              : 'Graph will appear once processing completes...'}
        </div>
      </div>
    </div>
  );
}
