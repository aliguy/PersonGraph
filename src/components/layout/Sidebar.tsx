import { NavLink } from 'react-router-dom';
import { Brain, Search, Settings, History, Key } from 'lucide-react';

const navItems = [
  { to: '/', icon: Search, label: 'New Scan' },
  { to: '/scans', icon: History, label: 'Scan History' },
  { to: '/admin', icon: Settings, label: 'Admin Panel' },
  { to: '/admin/keys', icon: Key, label: 'API Keys' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col fixed left-0 top-0 z-10">
      <div className="p-5 border-b border-[var(--border)] flex items-center gap-3">
        <Brain className="w-8 h-8 text-[var(--accent)]" />
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)] m-0">PersonGraph</h1>
          <p className="text-xs text-[var(--text-secondary)] m-0">3D Knowledge Mapper</p>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors no-underline ${
                isActive
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
        v0.1.0
      </div>
    </aside>
  );
}
