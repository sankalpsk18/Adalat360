import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  FlaskConical,
  Gavel,
  HardDrive,
  ScrollText,
  Scale,
  ShieldQuestion,
} from "lucide-react";
import { useSession } from "@/lib/session";
import {
  fmtDate,
  getCase,
  listConflicts,
  listCustody,
  listDocuments,
  listExhibits,
  type DocType,
} from "@/lib/api";
import {
  ConflictChip,
  CustodyEventRow,
  HashChip,
  IntegrityBadge,
  PageHeader,
  RestrictedTag,
  RoleBadge,
  SectionCard,
  VersionPill,
} from "@/components/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/cases/$caseId")({ component: CaseDetail });

export const typeIcon: Record<DocType, typeof FileText> = {
  fir: FileText,
  charge_sheet: ScrollText,
  witness_statement: FileText,
  court_filing: Scale,
  judgment: Gavel,
  legal_notice: ScrollText,
  photo: FileImage,
  video: FileVideo,
  audio: FileAudio,
  forensic_report: FlaskConical,
  device_extract: HardDrive,
};

export const typeLabel: Record<DocType, string> = {
  fir: "FIR",
  charge_sheet: "Charge sheet",
  witness_statement: "Witness statement",
  court_filing: "Court filing",
  judgment: "Judgment",
  legal_notice: "Legal notice",
  photo: "Photograph",
  video: "Video",
  audio: "Audio",
  forensic_report: "Forensic report",
  device_extract: "Device extract",
};

function CaseDetail() {
  const { caseId } = Route.useParams();
  const { role } = useSession();
  const c = getCase(caseId);
  const docs = listDocuments(caseId, role);
  const exhibits = listExhibits(caseId);
  const custody = listCustody({ caseId });
  const conflicts = caseId === "CR-2026-0417" ? listConflicts() : [];

  if (!c) {
    return <SectionCard title="Case not found">
      <p className="text-sm text-muted-foreground">No case with identifier {caseId} is available to this role.</p>
    </SectionCard>;
  }

  return (
    <>
      <PageHeader
        title={c.title}
        subtitle={`${c.department} · opened ${fmtDate(c.openedAt)}`}
        action={
          <div className="flex items-center gap-2">
            <span className="data-mono rounded border border-border bg-surface px-2 py-1 text-xs">{c.id}</span>
            <RestrictedTag label={c.priority === "high" ? "High priority" : "Access controlled"} />
          </div>
        }
      />

      <div className="mb-4 grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p>
          <p className="text-sm">{c.status.replace(/_/g, " ")}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Assigned</p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
            {c.officers.map((o) => (
              <span key={o.name} className="flex items-center gap-1">
                {o.name}
                <RoleBadge role={o.role} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Last activity</p>
          <p className="data-mono text-sm">{fmtDate(c.lastActivity)}</p>
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="flex-wrap">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="custody">Custody trail</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-3">
          <SectionCard title={`Records (${docs.length})`}>
            {docs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No records of this case are visible to your role.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="py-1.5 pr-3 font-medium">Record</th>
                      <th className="py-1.5 pr-3 font-medium">Type</th>
                      <th className="py-1.5 pr-3 font-medium">Hash</th>
                      <th className="py-1.5 pr-3 font-medium">Integrity</th>
                      <th className="py-1.5 pr-3 font-medium">Version</th>
                      <th className="py-1.5 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => {
                      const Icon = typeIcon[d.type];
                      return (
                        <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                          <td className="py-1.5 pr-3">
                            <Link
                              to="/documents/$docId"
                              params={{ docId: d.id }}
                              className="flex items-center gap-2 hover:underline"
                            >
                              <Icon className="size-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">{d.title}</span>
                              {d.restricted && <RestrictedTag />}
                              {d.redactedCopy && <RestrictedTag label="Redacted copy" />}
                            </Link>
                          </td>
                          <td className="py-1.5 pr-3 text-xs text-muted-foreground">{typeLabel[d.type]}</td>
                          <td className="py-1.5 pr-3"><HashChip hash={d.hash} /></td>
                          <td className="py-1.5 pr-3"><IntegrityBadge state={d.integrity} /></td>
                          <td className="py-1.5 pr-3">
                            <VersionPill current={d.versions.length} total={d.versions.length} />
                          </td>
                          <td className="data-mono py-1.5 text-[11px] text-muted-foreground">{fmtDate(d.updatedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="evidence" className="mt-3">
          <SectionCard title={`Physical exhibits (${exhibits.length})`}>
            <ul className="grid gap-2 md:grid-cols-2">
              {exhibits.map((e) => (
                <li key={e.id} className="rounded-md border border-border p-2">
                  <div className="flex items-center justify-between">
                    <Link to="/exhibits" className="data-mono text-xs hover:underline">{e.id}</Link>
                    <span className="text-[11px] text-muted-foreground">{e.custodyStatus.replace(/_/g, " ")}</span>
                  </div>
                  <p className="mt-0.5 text-sm">{e.label}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    seal <HashChip hash={e.sealHash} /> · {e.holder}
                  </div>
                </li>
              ))}
              {exhibits.length === 0 && <p className="text-sm text-muted-foreground">No exhibits registered.</p>}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="timeline" className="mt-3">
          <SectionCard title="Case timeline">
            {conflicts.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {conflicts.map((cf) => (
                  <ConflictChip key={cf.id} type={cf.type} />
                ))}
              </div>
            )}
            <ol className="relative">
              {custody.map((e, i) => (
                <CustodyEventRow key={e.id} event={e} last={i === custody.length - 1} />
              ))}
            </ol>
            {conflicts.length > 0 && (
              <p className="mt-3 flex items-start gap-1.5 rounded-md border border-pending/40 bg-pending/10 p-2 text-xs">
                <ShieldQuestion className="mt-0.5 size-3.5 shrink-0" />
                Conflicting entries exist on this case timeline. Open Conflict-aware Ask to review contradictions
                with citations.
              </p>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="custody" className="mt-3">
          <SectionCard
            title="Hash-chained custody trail"
            action={
              <Link to="/ledger" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                Full ledger
              </Link>
            }
          >
            <ol className="relative">
              {custody.map((e, i) => (
                <CustodyEventRow key={e.id} event={e} last={i === custody.length - 1} />
              ))}
            </ol>
          </SectionCard>
        </TabsContent>

        <TabsContent value="team" className="mt-3">
          <SectionCard title="Team & collaborators">
            <ul className="divide-y divide-border text-sm">
              {c.officers.map((o) => (
                <li key={o.name} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2">
                    {o.name} <RoleBadge role={o.role} />
                  </span>
                  <span className="text-xs text-muted-foreground">{c.department}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </>
  );
}
