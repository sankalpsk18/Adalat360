import { Check, Copy, Link2, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fmtDate, roleMeta, type ConflictType, type CustodyEvent, type IntegrityState, type Role } from "@/lib/api";

export function HashChip({ hash, className }: { hash: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${hash.slice(0, 4)}…${hash.slice(-4)}`;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(hash);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className={cn(
              "data-mono inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] text-secondary-foreground transition-colors hover:border-ring",
              className,
            )}
          >
            {short}
            {copied ? <Check className="size-3 text-verified" /> : <Copy className="size-3 opacity-50" />}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[22rem]">
          <span className="data-mono break-all text-[11px]">{hash}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const integrityMap: Record<IntegrityState, { label: string; cls: string; Icon: typeof ShieldCheck }> = {
  verified: { label: "Verified", cls: "border-verified/40 bg-verified/10 text-verified", Icon: ShieldCheck },
  pending: { label: "Pending", cls: "border-pending/50 bg-pending/15 text-pending-foreground", Icon: ShieldQuestion },
  mismatch: { label: "Mismatch", cls: "border-mismatch/40 bg-mismatch/10 text-mismatch", Icon: ShieldAlert },
};

export function IntegrityBadge({ state, className }: { state: IntegrityState; className?: string }) {
  const { label, cls, Icon } = integrityMap[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium",
        cls,
        className,
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const m = roleMeta(role);
  return (
    <span
      title={m.label}
      className={cn(
        "data-mono inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {m.short}
    </span>
  );
}

export function RestrictedTag({ label = "Restricted" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-restricted/40 bg-restricted/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-restricted">
      {label}
    </span>
  );
}

const conflictMap: Record<ConflictType, { label: string; cls: string }> = {
  temporal: { label: "Temporal", cls: "border-pending/50 bg-pending/15 text-pending-foreground" },
  location: { label: "Location", cls: "border-mismatch/40 bg-mismatch/10 text-mismatch" },
  identity: { label: "Identity", cls: "border-restricted/40 bg-restricted/10 text-restricted" },
  witness: { label: "Witness", cls: "border-pending/50 bg-pending/15 text-pending-foreground" },
  superseded: { label: "Superseded", cls: "border-border bg-muted text-muted-foreground" },
  forensic: { label: "Forensic", cls: "border-verified/40 bg-verified/10 text-verified" },
  scope: { label: "Scope", cls: "border-border bg-muted text-muted-foreground" },
};

export function ConflictChip({ type }: { type: ConflictType }) {
  const c = conflictMap[type];
  return (
    <span className={cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium", c.cls)}>
      {c.label} conflict
    </span>
  );
}

export function VersionPill({
  current,
  total,
  onClick,
}: {
  current: number;
  total: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="data-mono rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
    >
      v{current} of {total}
    </button>
  );
}

export function CustodyEventRow({ event, last }: { event: CustodyEvent; last?: boolean }) {
  return (
    <li className="chain-link relative pb-4 last:pb-0">
      <span
        className="chain-node"
        style={event.broken ? { borderColor: "var(--mismatch)" } : undefined}
        aria-hidden
      />
      {!last && (
        <span
          className="absolute left-[0.59rem] top-4 bottom-0 w-px"
          style={{ background: event.broken ? "var(--mismatch)" : "var(--border)" }}
          aria-hidden
        />
      )}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="font-medium capitalize">{event.action}</span>
        <span className="text-muted-foreground">by</span>
        <span>{event.actor}</span>
        <RoleBadge role={event.actorRole} />
        <span className="data-mono ml-auto text-[11px] text-muted-foreground">{fmtDate(event.timestamp)}</span>
      </div>
      {event.note && <p className="mt-0.5 text-xs text-muted-foreground">{event.note}</p>}
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <Link2 className="size-3" />
        <span>prev</span>
        {event.prevHash ? <HashChip hash={event.prevHash} /> : <span className="data-mono">genesis</span>}
        <span>→ this</span>
        <HashChip hash={event.hash} />
        {event.broken && <span className="font-medium text-mismatch">chain break detected</span>}
      </div>
    </li>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface", className)}>
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {action}
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function MockQr({ value, size = 72 }: { value: string; size?: number }) {
  const cells = 11;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = (seed * 33 + value.charCodeAt(i)) >>> 0;
  const grid: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    grid.push(((seed >> 16) & 1) === 1);
  }
  const finder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c > cells - 4) || (r > cells - 4 && c < 3);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} role="img" aria-label={`Mock QR tag ${value}`}>
      <rect width={cells} height={cells} fill="var(--surface)" />
      {grid.map((on, i) => {
        const r = Math.floor(i / cells);
        const c = i % cells;
        const filled = finder(r, c) ? (r % 2 === 0 || c % 2 === 0) : on;
        return filled ? <rect key={i} x={c} y={r} width={1} height={1} fill="var(--primary)" /> : null;
      })}
    </svg>
  );
}

export function DemoDataBadge() {
  return (
    <span className="rounded border border-dashed border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
      Demo data
    </span>
  );
}
