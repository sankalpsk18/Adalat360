import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/lib/session";
import { fmtDate, listCases, listDocuments } from "@/lib/api";
import { PageHeader, RoleBadge, SectionCard } from "@/components/primitives";

export const Route = createFileRoute("/_app/cases/")({ component: CasesIndex });

function CasesIndex() {
  const { role } = useSession();
  const cases = listCases(role);

  return (
    <>
      <PageHeader title="Cases" subtitle="Only cases assigned to or shared with your role are listed." />
      {cases.length === 0 && (
        <SectionCard title="No case access">
          <p className="text-sm text-muted-foreground">
            System administration roles receive technical visibility only. Case content remains restricted.
          </p>
        </SectionCard>
      )}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((c) => {
          const docs = listDocuments(c.id, role);
          return (
            <Link
              key={c.id}
              to="/cases/$caseId"
              params={{ caseId: c.id }}
              className="rounded-lg border border-border bg-surface p-3 transition-colors hover:border-ring"
            >
              <div className="flex items-center justify-between">
                <span className="data-mono text-xs text-muted-foreground">{c.id}</span>
                <span
                  className={
                    c.priority === "high"
                      ? "text-[11px] font-medium text-mismatch"
                      : "text-[11px] text-muted-foreground"
                  }
                >
                  {c.priority} priority
                </span>
              </div>
              <p className="mt-1 text-sm font-medium leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.department}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.officers.map((o) => (
                  <span key={o.name} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    {o.name}
                    <RoleBadge role={o.role} />
                  </span>
                ))}
              </div>
              <div className="data-mono mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>{docs.length} records visible</span>
                <span>{fmtDate(c.lastActivity)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
