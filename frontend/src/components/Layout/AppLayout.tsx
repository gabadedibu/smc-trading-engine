import { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/signals', label: 'Signals' },
  { to: '/settings', label: 'Settings' }
];

export const AppLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-bg text-primary">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r border-border p-4">
          <h1 className="mb-4 text-lg font-semibold">SMC Engine</h1>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded px-3 py-2 text-sm ${location.pathname === link.to ? 'bg-accent text-white' : 'hover:bg-card'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
