import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import { signInUser, signOutUser, type Role } from './api';

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
  const [role, setRoleState] = useState<Role>('investigating_officer');
  const [signedIn, setSignedIn] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState('CR-2026-0417');
  const [user, setUser] = useState<any>(null);

  // Role metadata
  const roleMeta = {
    investigating_officer: { label: 'Investigating Officer', short: 'IO' },
    records_section: { label: 'Records / Administrative Section', short: 'REC' },
    forensic_analyst: { label: 'Forensic Analyst', short: 'FSL' },
    prosecutor: { label: 'Prosecutor / Legal Cell', short: 'PP' },
    judge: { label: 'Judge / Court Officer', short: 'CRT' },
    system_admin: { label: 'System Administrator', short: 'SYS' },
  };

  // Restore session from token on mount
  const restoreSession = async () => {
    const token = localStorage.getItem('adalat360_token');
    if (token) {
      try {
        // Validate token by calling /auth/me
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setRoleState(mapBackendRoleToFrontend(data.user.role));
            setSignedIn(true);
            return;
          }
        }
      } catch (error) {
        console.error('Session restore failed:', error);
      }
      // Token invalid, clear it
      signOutUser();
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const mapBackendRoleToFrontend = (backendRole: string): Role => {
    const roleMap: Record<string, Role> = {
      IO: 'investigating_officer',
      REC: 'records_section',
      FSL: 'forensic_analyst',
      PP: 'prosecutor',
      CRT: 'judge',
      SYS: 'system_admin',
    };
    return roleMap[backendRole] || 'investigating_officer';
  };

  const signIn = async (selectedRole: Role, serviceBarId: string, passphrase: string) => {
    try {
      console.log('[Session] Starting signIn for:', serviceBarId, selectedRole);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ serviceBarId, passphrase, role: selectedRole }),
      });

      console.log('[Session] Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[Session] Login failed:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('[Session] Login success, data:', data);

      if (data.token) {
        signInUser(data.token);
        console.log('[Session] Token stored in localStorage');
      }

      setUser(data.user);
      setRoleState(selectedRole);
      setSignedIn(true);
      console.log('[Session] State updated, signedIn:', true);
    } catch (error) {
      console.error('[Session] Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    signOutUser();
    setUser(null);
    setSignedIn(false);
  };

  const setRole = (r: Role) => {
    setRoleState(r);
  };

  const value = useMemo<SessionValue>(
    () => ({
      role,
      name: user?.name || roleMeta[role]?.label || 'Unknown',
      signedIn,
      activeCaseId,
      user,
      setRole,
      setActiveCaseId,
      signIn,
      signOut,
      restoreSession,
    }),
    [role, signedIn, activeCaseId, user],
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}