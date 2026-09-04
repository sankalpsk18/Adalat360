import { Link, useLocation } from '@tanstack/react-router';
import {
  FileStack,
  Gauge,
  ShieldCheck,
  Package,
  Sparkles,
  Upload,
  FileSignature,
  ScrollText,
  EyeOff,
  Bell,
  LayoutGrid,
  UserCog,
  LogOut,
  Landmark,
} from 'lucide-react';
import { useAuth, ROLES, type Role } from '@/lib';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge, roles: ROLES.map(r => r.id) as Role[] },
  { to: '/cases', label: 'Cases', icon: FileStack, roles: ROLES.filter(r => r.id !== 'system_admin').map(r => r.id) as Role[] },
  { to: '/intake', label: 'Intake', icon: Upload, roles: ['investigating_officer', 'records_section', 'forensic_analyst'] },
  { to: '/search', label: 'Conflict-aware Ask', icon: Sparkles, roles: ROLES.filter(r => r.id !== 'system_admin').map(r => r.id) as Role[] },
  { to: '/ledger', label: 'Custody Ledger', icon: ShieldCheck, roles: ROLES.map(r => r.id) as Role[] },
  { to: '/signatures', label: 'Sign & Approve', icon: FileSignature, roles: ['investigating_officer', 'prosecutor', 'judge', 'forensic_analyst'] },
  { to: '/certificates', label: 'BSA §63 Certificates', icon: ScrollText, roles: ['investigating_officer', 'forensic_analyst', 'prosecutor'] },
  { to: '/exhibits', label: 'Exhibit Register', icon: Package, roles: ['investigating_officer', 'records_section', 'forensic_analyst', 'judge'] },
  { to: '/redaction', label: 'Redaction', icon: EyeOff, roles: ['records_section', 'investigating_officer', 'prosecutor'] },
  { to: '/audit', label: 'Audit & Compliance', icon: LayoutGrid, roles: ROLES.map(r => r.id) as Role[] },
  { to: '/inbox', label: 'Approvals Inbox', icon: Bell, roles: ROLES.map(r => r.id) as Role[] },
  { to: '/admin', label: 'Admin Panel', icon: UserCog, roles: ['system_admin'] },
];

export function Sidebar() {
  const { role, user, logout } = useAuth();
  const location = useLocation();

  if (!role) return null;

  const items = NAV.filter(n => n.roles.includes(role));

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <Landmark className="size-5 text-accent" />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-white">ADALAT360</p>
          <p className="text-[10px] uppercase tracking-widest opacity-60">Evidence & records</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {items.map((item) => {
          const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'opacity-80 hover:bg-sidebar-accent/60 hover:opacity-100',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="truncate text-xs font-medium">{user?.name || 'Unknown'}</p>
        <p className="mt-0.5 text-[11px] opacity-60">
          {ROLES.find(r => r.id === role)?.label || role}
        </p>
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100"
        >
          <LogOut className="size-3" /> Sign out
        </button>
      </div>
    </aside>
  );
}