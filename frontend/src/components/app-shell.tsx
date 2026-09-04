import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileSignature,
  FileStack,
  Gauge,
  Landmark,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCog,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { ROLES, roleMeta, useCases, useApprovals, type Role } from "@/lib/api";
import { DemoDataBadge, RoleBadge } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Gauge;
  roles: Role[];
}

const ALL: Role[] = [
  "investigating_officer",
  "records_section",
  "forensic_analyst",
  "prosecutor",
  "judge",
  "system_admin",
];
const NON_ADMIN = ALL.filter((r) => r !== "system_admin");

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge, roles: ALL },
  { to: "/cases", label: "Cases", icon: FileStack, roles: NON_ADMIN },
  { to: "/intake", label: "Intake", icon: Upload, roles: ["investigating_officer", "records_section", "forensic_analyst"] },
  { to: "/search", label: "Conflict-aware Ask", icon: Sparkles, roles: NON_ADMIN },
  { to: "/ledger", label: "Custody ledger", icon: ShieldCheck, roles: ALL },
  { to: "/signatures", label: "Sign & approve", icon: FileSignature, roles: ["investigating_officer", "prosecutor", "judge", "forensic_analyst"] },
  { to: "/certificates", label: "BSA §63 certificates", icon: ScrollText, roles: ["investigating_officer", "forensic_analyst", "prosecutor"] },
  { to: "/exhibits", label: "Exhibit register", icon: Package, roles: ["investigating_officer", "records_section", "forensic_analyst", "judge"] },
  { to: "/redaction", label: "Redaction", icon: EyeOff, roles: ["records_section", "investigating_officer", "prosecutor"] },
  { to: "/audit", label: "Audit & compliance", icon: LayoutGrid, roles: ALL },
  { to: "/inbox", label: "Approvals inbox", icon: Bell, roles: ALL },
  { to: "/admin", label: "Admin panel", icon: UserCog, roles: ["system_admin"] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { role, name, signOut } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV.filter((n) => n.roles.includes(role));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <Landmark className="size-5 text-accent" />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-white">ADALAT360</p>
          <p className="text-[10px] uppercase tracking-widest opacity-60">Evidence &amp; records</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "opacity-80 hover:bg-sidebar-accent/60 hover:opacity-100",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="mt-0.5 text-[11px] opacity-60">{roleMeta(role).label}</p>
        <button
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="mt-2 flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100"
        >
          <LogOut className="size-3" /> Sign out
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, activeCaseId, setActiveCaseId } = useSession();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: cases = [] } = useCases(role);
  const { data: approvals = [] } = useApprovals();
  const pending = approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-border bg-surface/95 px-3 py-2 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Select value={activeCaseId} onValueChange={setActiveCaseId}>
            <SelectTrigger className="h-8 w-[200px] text-xs sm:w-[260px]">
              <SelectValue placeholder="Select case" />
            </SelectTrigger>
            <SelectContent>
              {cases.length === 0 && (
                <SelectItem value="none" disabled>
                  No case context for this role
                </SelectItem>
              )}
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  <span className="data-mono">{c.id}</span> — {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => navigate({ to: "/search" })}
            className="hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring sm:flex"
          >
            <Search className="size-3.5" />
            Ask about this case…
          </button>

          <div className="ml-auto flex items-center gap-2">
            <DemoDataBadge />
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="h-8 w-[168px] border-dashed text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="text-xs">
                    Demo: {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link
              to="/inbox"
              className="relative rounded-md border border-border p-1.5 transition-colors hover:border-ring"
              aria-label="Approvals inbox"
            >
              <Bell className="size-4" />
              {pending > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {pending}
                </span>
              )}
            </Link>
            <RoleBadge role={role} />
          </div>
        </header>

        <main className="min-w-0 flex-1 p-3 md:p-5">{children}</main>
      </div>
    </div>
  );
}
