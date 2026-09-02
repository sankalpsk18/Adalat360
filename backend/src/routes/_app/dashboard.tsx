import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, FileSignature, FolderOpen, ShieldAlert } from "lucide-react";
import { useSession } from "@/lib/session";
import { fmtDate, listApprovals, listAudit, listCases, listDocuments, roleMeta } from "@/lib/api";
import { IntegrityBadge, PageHeader, RoleBadge, SectionCard } from "@/components/primitives";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const statusLabel: Record<string, string> = {
  open: "Open",
  under_investigation: "Under investigation",
  chargesheet_filed: "Charge sheet filed",
  in_court: "In court",
  closed: "Closed",
};

function Dashboard() {
  const { role, name } = useSession();
  const cases = listCases(role);
  const approvals = listApprovals().filter((a) => a.status === "pending");
  const docs = listDocuments(undefined, role);
  const alerts = docs.filter((d) => d.integrity === "mismatch");
  const activity = listAudit().slice(0, 6);

  const stats = [
    { label: "Active cases", value: cases.length, icon: FolderOpen },
    { label: "Pending signatures / approvals", value: approvals.filter((a) => a.kind !== "case_update").length, icon: FileSignature },
    { label: "Integrity alerts", value: alerts.length + approvals.filter((a) => a.kind === "integrity_alert").length, icon: ShieldAlert },
  ];

  return (
    <>
      <PageHeader
        title={`Good day, ${name}`}
        subtitle={`${roleMeta(role).label} — ${roleMeta(role).access}`}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{s.label}</span>
              <s.icon className="size-4" />
            </div>
            <p className="data-mono mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <SectionCard title="Case list" className="lg:col-span-2">
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
                  {cases.map((c) => (
                    <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                      <td className="py-1.5 pr-3">
                        <Link to="/cases/$caseId" params={{ caseId: c.id }} className="data-mono text-xs underline-offset-2 hover:underline">
                          {c.id}
                        </Link>
                      </td>
                      <td className="max-w-[22rem] truncate py-1.5 pr-3">{c.title}</td>
                      <td className="py-1.5 pr-3 text-xs">{statusLabel[c.status]}</td>
                      <td className="py-1.5 pr-3">
                        <Badge
                          variant="outline"
                          className={
                            c.priority === "high"
                              ? "border-mismatch/40 text-mismatch"
                              : c.priority === "medium"
                                ? "border-pending/50 text-pending-foreground"
                                : "text-muted-foreground"
                          }
                        >
                          {c.priority}
                        </Badge>
                      </td>
                      <td className="data-mono py-1.5 text-[11px] text-muted-foreground">{fmtDate(c.lastActivity)}</td>
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
            {approvals.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-md border border-border p-2">
                <div className="flex items-start gap-2">
                  {a.severity === "critical" && <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-mismatch" />}
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-snug">{a.title}</p>
                    <p className="data-mono mt-0.5 text-[11px] text-muted-foreground">
                      {a.caseId} · {fmtDate(a.requestedAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <SectionCard title="Recent integrity alerts">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hash mismatches on records visible to this role.</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-mismatch/30 bg-mismatch/5 p-2">
                  <div className="min-w-0">
                    <Link to="/documents/$docId" params={{ docId: d.id }} className="truncate text-xs font-medium hover:underline">
                      {d.title}
                    </Link>
                    <p className="data-mono text-[11px] text-muted-foreground">{d.caseId} · {d.id}</p>
                  </div>
                  <IntegrityBadge state={d.integrity} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent activity">
          <ul className="space-y-1.5 text-xs">
            {activity.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-1.5 last:border-0">
                <span className="font-medium">{a.actor}</span>
                <RoleBadge role={a.actorRole} />
                <span className="text-muted-foreground">{a.action.replace("_", " ")}</span>
                <span className="data-mono">{a.target}</span>
                <span className="data-mono ml-auto text-[11px] text-muted-foreground">{fmtDate(a.timestamp)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
