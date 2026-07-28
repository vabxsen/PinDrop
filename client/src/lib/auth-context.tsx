import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginInput, RegisterInput, UserDTO } from '@pindrop/shared';
import { authApi, setAuthTokens } from '@/lib/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: UserDTO | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDTO) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserDTO | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    authApi
      .refresh()
      .then((session) => {
        if (cancelled) return;
        if (session) {
          setUserState(session.user);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const session = await authApi.login(input);
    setAuthTokens(session);
    setUserState(session.user);
    setStatus('authenticated');
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const session = await authApi.googleLogin({ idToken });
    setAuthTokens(session);
    setUserState(session.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const session = await authApi.register(input);
    setAuthTokens(session);
    setUserState(session.user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAuthTokens(null);
      setUserState(null);
      setStatus('unauthenticated');
    }
  }, []);

  const setUser = useCallback((next: UserDTO) => {
    setUserState(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, loginWithGoogle, register, logout, setUser }),
    [user, status, login, loginWithGoogle, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
