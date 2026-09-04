import { Link, useNavigate } from '@tanstack/react-router';
import { Bell, Menu, Search, ChevronDown } from 'lucide-react';
import { useAuth, ROLES } from '@/lib';
import { useCases } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Header() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: cases = [] } = useCases(role);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-border bg-surface/95 px-3 py-2 backdrop-blur">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <Select value="" onValueChange={(v) => v && navigate({ to: `/cases/${v}` })}>
        <SelectTrigger className="h-8 w-[200px] text-xs sm:w-[260px]">
          <SelectValue placeholder="Select case" />
        </SelectTrigger>
        <SelectContent>
          {cases.length === 0 && (
            <SelectItem value="" disabled>
              No case context for this role
            </SelectItem>
          )}
          {cases.map((c: any) => (
            <SelectItem key={c.id} value={c.id} className="text-xs">
              <span className="font-mono">{c.id}</span> — {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={() => navigate({ to: '/search' })}
        className="hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring sm:flex"
      >
        <Search className="size-3.5" />
        Ask about this case…
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="rounded border border-dashed border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          Demo data
        </span>
        <Link
          to="/inbox"
          className="relative rounded-md border border-border p-1.5 transition-colors hover:border-ring"
          aria-label="Approvals inbox"
        >
          <Bell className="size-4" />
        </Link>
        <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {ROLES.find(r => r.id === role)?.short || '—'}
        </span>
      </div>
    </header>
  );
}

function Sidebar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!role) return null;

  const items = NAV.filter(n => n.roles.includes(role));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
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
              onClick={() => navigate(0)}
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
          onClick={() => { logout(); navigate({ to: '/' }); }}
          className="mt-2 flex items-center gap-1.5 text-[11px] opacity-70 hover:opacity-100"
        >
          <LogOut className="size-3" /> Sign out
        </button>
      </div>
    </div>
  );
}