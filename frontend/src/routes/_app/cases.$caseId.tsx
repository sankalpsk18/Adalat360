import { createFileRoute, Link } from "@tanstack/react-router";
import { FileAudio, FileImage, FileText, FileVideo, FlaskConical, Gavel, HardDrive, ScrollText, Scale, ShieldQuestion } from "lucide-react";
import { useAuth, fmtDate, roleMeta } from '@/lib';
import { useCase, useDocuments, useExhibits, useCaseCustody, useApprovals } from '@/lib/queries';
import { ConflictChip, CustodyEventRow, HashChip, IntegrityBadge, PageHeader, RestrictedTag, RoleBadge, SectionCard, VersionPill } from '@/components/primitives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute("/_app/cases/$caseId")({ component: CaseDetail });

const typeIcon: Record<string, typeof FileText> = {
  FIR: FileText,
  CHARGE_SHEET: ScrollText,
  WITNESS_STATEMENT: FileText,
  COURT_FILING: Scale,
  JUDGMENT: Gavel,
  LEGAL_NOTICE: ScrollText,
  PHOTO: FileImage,
  VIDEO: FileVideo,
  AUDIO: FileAudio,
  FORENSIC_REPORT: FlaskConical,
  DEVICE_EXTRACT: HardDrive,
};

const typeLabel: Record<string, string> = {
  FIR: "FIR",
  CHARGE_SHEET: "Charge sheet",
  WITNESS_STATEMENT: "Witness statement",
  COURT_FILING: "Court filing",
  JUDGMENT: "Judgment",
  LEGAL_NOTICE: "Legal notice",
  PHOTO: "Photograph",
  VIDEO: "Video",
  AUDIO: "Audio",
  FORENSIC_REPORT: "Forensic report",
  DEVICE_EXTRACT: "Device extract",
};

const statusLabel: Record<string, string> = {
  OPEN: "Open",
  UNDER_INVESTIGATION: "Under investigation",
  CHARGESHEET_FILED: "Charge sheet filed",
  IN_COURT: "In court",
  CLOSED: "Closed",
};

const ROLE_MAP: Record<string, string> = {
  IO: 'investigating_officer',
  REC: 'records_section',
  FSL: 'forensic_analyst',
  PP: 'prosecutor',
  CRT: 'judge',
  SYS: 'system_admin',
};

function CaseDetail() {
  const { caseId } = Route.useParams();
  const { role } = useAuth();
  const { data: caseData, isLoading: caseLoading } = useCase(caseId);
  const { data: docs = [], isLoading: docsLoading } = useDocuments(caseId);
  const { data: exhibits = [], isLoading: exhibitsLoading } = useExhibits(caseId);
  const { data: custody = [], isLoading: custodyLoading } = useCaseCustody(caseId);
  const { data: approvals = [] } = useApprovals();

  if (caseLoading || docsLoading || exhibitsLoading || custodyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!caseData?.case) {
    return (
      <SectionCard title="Case not found">
        <p className="text-sm text-muted-foreground">No case with identifier {caseId} is available to this role.</p>
      </SectionCard>
    );
  }

  const c = caseData.case;
  const pendingApprovals = approvals.filter((a: any) => a.caseId === caseId && a.status === 'PENDING');

  return (
    <>
      <PageHeader
        title={c.title}
        subtitle={`${c.department} · opened ${fmtDate(c.createdAt)}`}
        action={
          <div className="flex items-center gap-2">
            <span className="font-mono rounded border border-border bg-surface px-2 py-1 text-xs">{c.id}</span>
            <RestrictedTag label={c.priorityLabel === 'HIGH' ? "High priority" : "Access controlled"} />
          </div>
        }
      />

      <div className="mb-4 grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p>
          <p className="text-sm">{statusLabel[c.status] || c.status}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Priority</p>
          <p className="text-sm font-medium">{c.priorityLabel}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Last activity</p>
          <p className="font-mono text-sm">{fmtDate(c.lastActivityAt)}</p>
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="flex-wrap">
          <TabsTrigger value="documents">Documents ({docs.length})</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({exhibits.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({custody.length})</TabsTrigger>
          <TabsTrigger value="approvals">Approvals ({pendingApprovals.length})</TabsTrigger>
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
                      <th className="py-1.5 pr-3 font-medium">Signed</th>
                      <th className="py-1.5 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d: any) => {
                      const Icon = typeIcon[d.docType] || FileText;
                      return (
                        <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                          <td className="py-1.5 pr-3">
                            <Link to="/documents/$docId" params={{ docId: d.id }} className="flex items-center gap-2 hover:underline">
                              <Icon className="size-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">{d.filename}</span>
                              {d.restricted && <RestrictedTag />}
                              {d.redactedCopy && <RestrictedTag label="Redacted copy" />}
                            </Link>
                          </td>
                          <td className="py-1.5 pr-3 text-xs text-muted-foreground">{typeLabel[d.docType] || d.docType}</td>
                          <td className="py-1.5 pr-3"><HashChip hash={d.sha256Hash} /></td>
                          <td className="py-1.5 pr-3"><IntegrityBadge state={d.integrity} /></td>
                          <td className="py-1.5 pr-3">
                            <VersionPill current={d.version} total={d.version} />
                          </td>
                          <td className="py-1.5 pr-3 text-center">
                            {d.signed ? <span className="text-verified text-xs">✓ Signed</span> : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                          <td className="font-mono py-1.5 text-[11px] text-muted-foreground">{fmtDate(d.uploadedAt)}</td>
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
              {exhibits.map((e: any) => (
                <li key={e.id} className="rounded-md border border-border p-2">
                  <div className="flex items-center justify-between">
                    <Link to="/exhibits" className="font-mono text-xs hover:underline">{e.exhibitCode}</Link>
                    <span className="text-[11px] text-muted-foreground">{e.status?.replace('_', ' ') || e.status}</span>
                  </div>
                  <p className="mt-0.5 text-sm">{e.label}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <HashChip hash={e.sealHash} /> · {e.holder}
                  </div>
                </li>
              ))}
              {exhibits.length === 0 && <p className="text-sm text-muted-foreground">No exhibits registered.</p>}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="timeline" className="mt-3">
          <SectionCard title="Case timeline">
            <ol className="relative">
              {custody.map((e: any, i: number) => (
                <CustodyEventRow key={e.id} event={e} last={i === custody.length - 1} />
              ))}
            </ol>
          </SectionCard>
        </TabsContent>

        <TabsContent value="approvals" className="mt-3">
          <SectionCard title="Approvals for this case">
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending approvals for this case.</p>
            ) : (
              <ul className="space-y-2">
                {pendingApprovals.map((a: any) => (
                  <li key={a.id} className="rounded-md border border-border p-2">
                    <div className="flex items-start gap-2">
                      {a.severity === 'CRITICAL' && <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />}
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-snug">{a.title}</p>
                        <p className="font-mono mt-0.5 text-[11px] text-muted-foreground">
                          {a.kind} · {fmtDate(a.createdAt)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Requested by: {a.requester?.name || 'Unknown'} ({a.approverRole})
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="team" className="mt-3">
          <SectionCard title="Team & collaborators">
            <ul className="divide-y divide-border text-sm">
              {c.officers?.map((o: any) => (
                <li key={o.id} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2">
                    {o.name} <RoleBadge role={ROLE_MAP[o.role] || 'investigating_officer'} />
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