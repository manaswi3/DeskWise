import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Brand from './Brand';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-brand-tint text-brand-dark' : 'text-ink-soft hover:bg-black/5'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
    { to: '/tickets', label: 'My tickets', end: true },
    { to: '/tickets/new', label: 'New ticket' },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out');
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to={user.role === 'admin' ? '/admin' : '/tickets'} aria-label="Deskwise home">
            <Brand />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end ?? false} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs capitalize text-ink-mute">{user.role}</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn btn-secondary">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>

        <button
          type="button"
          className="btn btn-ghost -mr-2 px-2 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-4 pt-3 md:hidden">
          <p className="px-3 text-sm font-semibold">{user.name}</p>
          <p className="px-3 pb-2 text-xs text-ink-mute">{user.email}</p>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end ?? false} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button type="button" onClick={handleLogout} className="btn btn-secondary mt-3 w-full">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
