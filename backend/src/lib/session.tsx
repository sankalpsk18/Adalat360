import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_IDENTITY, type Role } from "./api";

interface SessionValue {
  role: Role;
  name: string;
  signedIn: boolean;
  activeCaseId: string;
  setRole: (r: Role) => void;
  setActiveCaseId: (id: string) => void;
  signIn: (r: Role) => void;
  signOut: () => void;
}

const SessionCtx = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("investigating_officer");
  const [signedIn, setSignedIn] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState("CR-2026-0417");

  const value = useMemo<SessionValue>(
    () => ({
      role,
      name: DEMO_IDENTITY[role],
      signedIn,
      activeCaseId,
      setRole,
      setActiveCaseId,
      signIn: (r: Role) => {
        setRole(r);
        setSignedIn(true);
      },
      signOut: () => setSignedIn(false),
    }),
    [role, signedIn, activeCaseId],
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
