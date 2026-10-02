import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page doesn't exist</h1>
        <p className="mt-2 text-ink-soft">The link may be broken, or the page may have been moved.</p>
        <Link to={user ? '/tickets' : '/login'} className="btn btn-primary mt-6">
          {user ? 'Go to my tickets' : 'Go to login'}
        </Link>
      </div>
    </div>
  );
}
