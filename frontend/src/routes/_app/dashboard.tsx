import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, FileSignature, FolderOpen, ScrollText, ShieldAlert } from "lucide-react";
import { useAuth, roleMeta, fmtDate } from '@/lib';
import { useCases, useApprovals, useDocuments, useAudit } from '@/lib/queries';
import { IntegrityBadge, PageHeader, RoleBadge, SectionCard } from '@/components/primitives';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const statusLabel: Record<string, string> = {
  OPEN: "Open",
  UNDER_INVESTIGATION: "Under investigation",
  CHARGESHEET_FILED: "Charge sheet filed",
  IN_COURT: "In court",
  CLOSED: "Closed",
};

function Dashboard() {
  const { role, name, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: cases = [], isLoading: casesLoading } = useCases(role);
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovals();
  const { data: docs = [], isLoading: docsLoading } = useDocuments();
  const { data: activity = [], isLoading: activityLoading } = useAudit();

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const alerts = docs.filter((d) => d.integrity === 'MISMATCH');
  const pendingCertificates = pendingApprovals.filter(
    (a: any) => a.resourceType === 'CERTIFICATE' || a.kind === 'certificate',
  ).length;

  const stats = [
    { label: "Active cases", value: cases.length, icon: FolderOpen },
    { label: "Pending signatures / approvals", value: pendingApprovals.filter((a) => a.kind !== 'case_update').length, icon: FileSignature },
    { label: "Integrity alerts", value: alerts.length + pendingApprovals.filter((a) => a.kind === 'integrity_alert').length, icon: ShieldAlert },
    { label: "Certificates pending", value: pendingCertificates, icon: ScrollText },
  ];
  const visibleCases = cases.filter((c: any) =>
    !activeFilter || c.priorityLabel === activeFilter || c.status === activeFilter || c.department === activeFilter,
  );

  if (casesLoading || approvalsLoading || docsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Good day, ${user?.name || name}`}
        subtitle={`${roleMeta(role!).label} — ${roleMeta(role!).access}`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{s.label}</span>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="size-4" />
              </span>
            </div>
            <AnimatedCounter value={s.value} />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <SectionCard
          title="Case list"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{visibleCases.length} of {cases.length} cases assigned</span>
              {activeFilter && (
                <button type="button" className="text-primary underline-offset-2 hover:underline" onClick={() => setActiveFilter(null)}>
                  Clear filter
                </button>
              )}
            </div>
          }
        >
          {cases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This role has technical/system visibility only — case documents are not exposed here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-1.5 pr-3 font-medium">Case ID</th>
                    <th className="py-1.5 pr-3 font-medium">Title</th>
                    <th className="py-1.5 pr-3 font-medium">Status</th>
                    <th className="py-1.5 pr-3 font-medium">Priority</th>
                    <th className="py-1.5 font-medium">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCases.map((c: any) => (
                    <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                      <td className="py-1.5 pr-3">
                        <Link to="/cases/$caseId" params={{ caseId: c.id }} className="font-mono text-xs underline-offset-2 hover:underline">
                          {c.id}
                        </Link>
                      </td>
                      <td className="max-w-[22rem] truncate py-1.5 pr-3">{c.title}</td>
                      <td className="py-1.5 pr-3 text-xs">{statusLabel[c.status] || c.status}</td>
                      <td className="py-1.5 pr-3">
                        <Badge
                          variant="outline"
                          className={
                            c.priorityLabel === 'HIGH'
                              ? "border-destructive/40 text-destructive"
                              : c.priorityLabel === 'MEDIUM'
                                ? "border-amber/50 text-amber"
                                : "text-muted-foreground"
                          }
                        >
                          {c.priorityLabel}
                        </Badge>
                      </td>
                      <td className="font-mono py-1.5 text-[11px] text-muted-foreground">{fmtDate(c.lastActivityAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Approvals inbox"
          action={
            <Link to="/inbox" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
              Open inbox
            </Link>
          }
        >
          <ul className="space-y-2">
            {pendingApprovals.slice(0, 5).map((a: any) => (
              <li key={a.id} className="rounded-md border border-border p-2">
                <div className="flex items-start gap-2">
                  {a.severity === 'critical' && <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-destructive" />}
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-snug">{a.title}</p>
                    <p className="font-mono mt-0.5 text-[11px] text-muted-foreground">
                      {a.caseId} · {fmtDate(a.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <SectionCard title="Case priority distribution">
          <SummaryBars
            items={[
              { label: 'High', value: cases.filter((c: any) => c.priorityLabel === 'HIGH').length, color: 'bg-destructive', filter: 'HIGH' },
              { label: 'Medium', value: cases.filter((c: any) => c.priorityLabel === 'MEDIUM').length, color: 'bg-amber-500', filter: 'MEDIUM' },
              { label: 'Low', value: cases.filter((c: any) => c.priorityLabel === 'LOW').length, color: 'bg-emerald-500', filter: 'LOW' },
            ]}
            activeFilter={activeFilter}
            onSelect={setActiveFilter}
          />
        </SectionCard>
        <SectionCard title="Case status overview">
          <SummaryBars
            items={Object.entries(statusLabel).map(([status, label]) => ({
              label,
              value: cases.filter((c: any) => c.status === status).length,
              color: 'bg-primary',
              filter: status,
            }))}
            activeFilter={activeFilter}
            onSelect={setActiveFilter}
          />
        </SectionCard>
        <SectionCard title="Cases by department">
          <SummaryBars
            items={Object.entries(
              cases.reduce((counts: Record<string, number>, c: any) => {
                counts[c.department] = (counts[c.department] || 0) + 1;
                return counts;
              }, {}),
            ).map(([department, count]) => ({ label: department, value: count, color: 'bg-accent', filter: department }))}
            activeFilter={activeFilter}
            onSelect={setActiveFilter}
          />
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <SectionCard title="Recent integrity alerts">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hash mismatches on records visible to this role.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((d: any) => (
                <li key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2">
                  <div className="min-w-0">
                    <Link to="/documents/$docId" params={{ docId: d.id }} className="truncate text-xs font-medium hover:underline">
                      {d.title}
                    </Link>
                    <p className="font-mono text-[11px] text-muted-foreground">{d.caseId} · {d.id}</p>
                  </div>
                  <IntegrityBadge state={d.integrity} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent activity">
          <ul className="space-y-1.5 text-xs">
            {activity.slice(0, 10).map((a: any) => (
              <li key={a.id} className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-1.5 last:border-0">
                <span className="font-medium">{a.actor?.name || a.actorId}</span>
                <RoleBadge role={ROLE_MAP[a.actor?.role] || 'investigating_officer'} />
                <span className="text-muted-foreground">{a.action.replace('_', ' ')}</span>
                <span className="font-mono">{a.resourceId}</span>
                <span className="font-mono ml-auto text-[11px] text-muted-foreground">{fmtDate(a.timestamp)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

function SummaryBars({
  items,
  activeFilter,
  onSelect,
}: {
  items: { label: string; value: number; color: string; filter: string }[];
  activeFilter: string | null;
  onSelect: (filter: string | null) => void;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No case data available.</p>
      ) : (
        items.map(({ label, value, color, filter }) => (
          <button
            key={label}
            type="button"
            title={`Filter case list by ${label} (${value} case${value === 1 ? '' : 's'})`}
            onClick={() => onSelect(activeFilter === filter ? null : filter)}
            className={`block w-full rounded-md p-1 text-left transition-colors hover:bg-muted/70 ${activeFilter === filter ? 'bg-muted ring-1 ring-primary/30' : ''}`}
          >
            <div className="flex justify-between text-xs">
              <span>{label}</span>
              <span className="font-mono text-muted-foreground">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className={`h-2 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </button>
        ))
      )}
    </div>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 500, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <p className="mt-2 font-mono text-3xl font-semibold">{displayValue}</p>;
}

const ROLE_MAP: Record<string, string> = {
  IO: 'investigating_officer',
  REC: 'records_section',
  FSL: 'forensic_analyst',
  PP: 'prosecutor',
  CRT: 'judge',
  SYS: 'system_admin',
};