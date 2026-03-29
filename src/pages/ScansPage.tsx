import { Link } from 'react-router-dom';
import { useScanStore } from '../stores/scanStore';
import { Brain, ArrowRight, Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  queued: 'bg-gray-500',
  discovering: 'bg-blue-500',
  scraping: 'bg-yellow-500',
  processing: 'bg-purple-500',
  ready: 'bg-green-500',
  error: 'bg-red-500',
};

export function ScansPage() {
  const scans = useScanStore((s) => s.scans);
  const deleteScan = useScanStore((s) => s.deleteScan);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">Scan History</h2>
        <p className="text-[var(--text-secondary)] text-sm">
          All brain mapping scans. Click to view the 3D graph.
        </p>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] mb-4">No scans yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium no-underline hover:bg-[var(--accent-hover)] transition-colors"
          >
            Start your first scan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors group"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${statusColors[scan.status] || 'bg-gray-500'}`} />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/scans/${scan.id}`}
                  className="text-[var(--text-primary)] font-medium text-sm no-underline hover:text-[var(--accent)] transition-colors"
                >
                  {scan.config.name}
                </Link>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                  <span className="capitalize">{scan.status}</span>
                  <span>{scan.sourcesFound} sources</span>
                  <span>{scan.nodesGenerated} nodes</span>
                  <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => deleteScan(scan.id)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all cursor-pointer bg-transparent border-none"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link
                to={`/scans/${scan.id}`}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
