import { createFileRoute } from "@tanstack/react-router";
import { FileSignature, Pen, ShieldCheck } from "lucide-react";
import { useAuth } from '@/lib';
import { PageHeader, SectionCard, RoleBadge, HashChip } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApprovals } from '@/lib/queries';

export const Route = createFileRoute("/_app/signatures")({ component: SignaturesPage });

function SignaturesPage() {
  const { role } = useAuth();
  const { data: approvals = [], isLoading } = useApprovals();

  const signatureApprovals = approvals.filter((a: any) => a.kind === 'signature' && a.status === 'PENDING');

  return (
    <>
      <PageHeader
        title="Sign & Approve"
        subtitle="Documents and certificates awaiting your signature"
      />

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : signatureApprovals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending signature requests.</p>
        ) : (
          <ul className="space-y-2">
            {signatureApprovals.map((a: any) => (
              <li key={a.id} className="rounded-md border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.description || 'No description'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{a.resourceId}</span>
                      <Badge variant="outline">{a.resourceType}</Badge>
                      <span>{a.caseId}</span>
                      <RoleBadge role={ROLE_MAP[a.approverRole] || 'investigating_officer'} />
                    </div>
                  </div>
                  <Button>
                    <Pen className="size-4" /> Sign
                  </Button>
                </div>
              </li>
            ))}
          </ul>
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