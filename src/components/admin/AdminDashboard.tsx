import { useScanStore } from '../../stores/scanStore';
import { Activity, Database, Brain, AlertTriangle, Trash2 } from 'lucide-react';

export function AdminDashboard() {
  const scans = useScanStore((s) => s.scans);
  const apiKeys = useScanStore((s) => s.apiKeys);
  const deleteScan = useScanStore((s) => s.deleteScan);

  const totalScans = scans.length;
  const completedScans = scans.filter((s) => s.status === 'ready').length;
  const totalNodes = scans.reduce((sum, s) => sum + s.nodesGenerated, 0);
  const errorScans = scans.filter((s) => s.status === 'error').length;

  const configuredKeys = Object.values(apiKeys).filter(Boolean).length;
  const totalKeys = Object.keys(apiKeys).length;

  const stats = [
    { label: 'Total Scans', value: totalScans, icon: Activity, color: 'var(--accent)' },
    { label: 'Completed', value: completedScans, icon: Database, color: 'var(--success)' },
    { label: 'Total Nodes', value: totalNodes, icon: Brain, color: 'var(--accent-hover)' },
    { label: 'Errors', value: errorScans, icon: AlertTriangle, color: 'var(--danger)' },
  ];

  const statusColors: Record<string, string> = {
    queued: 'text-[var(--text-secondary)]',
    discovering: 'text-blue-400',
    scraping: 'text-yellow-400',
    processing: 'text-purple-400',
    ready: 'text-[var(--success)]',
    error: 'text-[var(--danger)]',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">Admin Panel</h2>
        <p className="text-[var(--text-secondary)] text-sm">
          System overview and pipeline management.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-[var(--text-secondary)]">{label}</span>
            </div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{value}</div>
          </div>
        ))}
      </div>

      {/* API Key Status */}
      <div className="mb-8 p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">API Key Status</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all"
              style={{ width: `${(configuredKeys / totalKeys) * 100}%` }}
            />
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{configuredKeys}/{totalKeys}</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          {configuredKeys === totalKeys
            ? 'All API keys configured. Full scanning capability available.'
            : `${totalKeys - configuredKeys} key(s) missing. Some data sources will be unavailable.`}
        </p>
      </div>

      {/* Recent Scans Table */}
      <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Scan History</h3>
        </div>
        {scans.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-secondary)]">
            No scans yet. Start your first brain mapping from the New Scan page.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] text-xs">
                <th className="text-left px-5 py-2 font-medium">Person</th>
                <th className="text-left px-5 py-2 font-medium">Status</th>
                <th className="text-left px-5 py-2 font-medium">Sources</th>
                <th className="text-left px-5 py-2 font-medium">Nodes</th>
                <th className="text-left px-5 py-2 font-medium">Created</th>
                <th className="text-right px-5 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-5 py-3">
                    <div className="text-[var(--text-primary)] font-medium">{scan.config.name}</div>
                    <div className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">
                      {scan.config.linkedinUrl}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`capitalize font-medium ${statusColors[scan.status] || ''}`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {scan.sourcesProcessed}/{scan.sourcesFound}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{scan.nodesGenerated}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteScan(scan.id)}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors cursor-pointer bg-transparent border-none"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
