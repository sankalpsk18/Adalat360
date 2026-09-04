import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useAuth, type Role } from './auth';

interface SessionValue {
  role: Role;
  name: string;
  signedIn: boolean;
  activeCaseId: string;
  user: any; // Full user object from backend
  setRole: (r: Role) => void;
  setActiveCaseId: (id: string) => void;
  signIn: (r: Role, serviceBarId: string, passphrase: string) => Promise<void>;
  signOut: () => void;
  restoreSession: () => Promise<void>;
}

const SessionCtx = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [roleOverride, setRoleOverride] = useState<Role | null>(null);
  const [activeCaseId, setActiveCaseId] = useState('CR-2026-0417');
  const role = roleOverride || auth.role || 'investigating_officer';

  const signIn = async (selectedRole: Role, serviceBarId: string, passphrase: string) => {
    await auth.login(selectedRole, serviceBarId, passphrase);
    setRoleOverride(selectedRole);
  };

  const signOut = () => {
    void auth.logout();
    setRoleOverride(null);
  };

  const value = useMemo<SessionValue>(
    () => ({
      role,
      name: auth.user?.name || 'Unknown',
      signedIn: !!auth.user,
      activeCaseId,
      user: auth.user,
      setRole: setRoleOverride,
      setActiveCaseId,
      signIn,
      signOut,
      restoreSession: auth.restoreSession,
    }),
    [role, auth.user, activeCaseId, auth.restoreSession],
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}