import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ProtectedRoute() {
  const { autenticado } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
