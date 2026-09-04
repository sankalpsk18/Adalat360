import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, setToken, clearToken, type Role, ROLES, DEMO_CREDENTIALS } from './api/client';

interface User {
  id: string;
  name: string;
  serviceBarId: string;
  role: string;
  department: string;
}

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (role: Role, serviceBarId: string, passphrase: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_MAP: Record<string, Role> = {
  IO: 'investigating_officer',
  REC: 'records_section',
  FSL: 'forensic_analyst',
  PP: 'prosecutor',
  CRT: 'judge',
  SYS: 'system_admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = async () => {
    const token = localStorage.getItem('adalat360_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { user: userData } = await authApi.me();
      if (userData) {
        setUser(userData);
        setRole(ROLE_MAP[userData.role] || 'investigating_officer');
      } else {
        clearToken();
      }
    } catch {
      clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (selectedRole: Role, serviceBarId: string, passphrase: string) => {
    console.log('[Auth] Login attempt:', { selectedRole, serviceBarId, passphrase: '***' });
    try {
      const { user: userData, token } = await authApi.login(serviceBarId, passphrase, selectedRole);
      console.log('[Auth] Login success:', { user: userData, token: token?.slice(0, 20) });
      setToken(token);
      setUser(userData);
      setRole(selectedRole);
    } catch (error: any) {
      console.error('[Auth] Login error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearToken();
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const value: AuthContextValue = {
    user,
    role,
    isLoading,
    login,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLES, DEMO_CREDENTIALS };
export type { Role, RoleMeta } from './api/client';