import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearToken,
  getToken,
  setToken as persistToken,
  setUnauthorizedHandler,
} from '../api/client';
import { AuthContext, type AuthContextValue } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const navigate = useNavigate();
  const location = useLocation();

  const login = useCallback((nuevoToken: string) => {
    persistToken(nuevoToken);
    setTokenState(nuevoToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTokenState(null);
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }
    });
    return () => setUnauthorizedHandler(null);
  }, [location.pathname, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, autenticado: token !== null, login, logout }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
