import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './States';

export const homePathFor = (user) => (user.role === 'admin' ? '/admin' : '/tickets');

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user } = useAuth();
  return user.role === 'admin' ? <Outlet /> : <Navigate to="/tickets" replace />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader label="Checking your session" />;
  return user ? <Navigate to={homePathFor(user)} replace /> : <Outlet />;
}
