import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, Gavel, Scale, ShieldAlert, Search, FileStack } from "lucide-react";
import { useAuth, roleMeta, fmtDate } from '@/lib';
import { useCases } from '@/lib/queries';
import { PageHeader, RoleBadge, SectionCard, IntegrityBadge } from '@/components/primitives';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute("/_app/cases/")({ component: CasesIndex });

const statusLabel: Record<string, string> = {
  OPEN: "Open",
  UNDER_INVESTIGATION: "Under investigation",
  CHARGESHEET_FILED: "Charge sheet filed",
  IN_COURT: "In court",
  CLOSED: "Closed",
};

function CasesIndex() {
  const { role, name } = useAuth();
  const { data: cases = [], isLoading } = useCases(role);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="All Cases"
        subtitle={`${cases.length} cases visible to ${roleMeta(role!).short}`}
        action={
          <Link to="/intake" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <FileStack className="size-4" /> New Case
          </Link>
        }
      />

      <SectionCard>
        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No cases found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cases will appear here once created or assigned to your role.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-1.5 pr-3 font-medium">Case ID</th>
                  <th className="py-1.5 pr-3 font-medium">Title</th>
                  <th className="py-1.5 pr-3 font-medium">Department</th>
                  <th className="py-1.5 pr-3 font-medium">Status</th>
                  <th className="py-1.5 pr-3 font-medium">Priority</th>
                  <th className="py-1.5 pr-3 font-medium">Officers</th>
                  <th className="py-1.5 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                    <td className="py-1.5 pr-3">
                      <Link to="/cases/$caseId" params={{ caseId: c.id }} className="font-mono text-xs underline-offset-2 hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="max-w-[22rem] truncate py-1.5 pr-3">{c.title}</td>
                    <td className="py-1.5 pr-3 text-xs text-muted-foreground">{c.department}</td>
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
                    <td className="py-1.5 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {c.officers?.map((o: any) => (
                          <span key={o.id} className="flex items-center gap-1 text-xs">
                            <span className="font-medium">{o.name}</span>
                            <RoleBadge role={ROLE_MAP[o.role] || 'investigating_officer'} />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="font-mono py-1.5 text-[11px] text-muted-foreground">{fmtDate(c.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  );
}

const ROLE_MAP: Record<string, string> = {
  IO: 'investigating_officer',
  REC: 'records_section',
  FSL: 'forensic_analyst',
  PP: 'prosecutor',
  CRT: 'judge',
  SYS: 'system_admin',
};