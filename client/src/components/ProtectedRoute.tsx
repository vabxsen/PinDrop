import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { FullPageSpinner } from '@/components/ui/Spinner';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { status } = useAuth();

  if (status === 'loading') return <FullPageSpinner />;
  if (status === 'authenticated') return <Navigate to="/app" replace />;
  return <Outlet />;
}
