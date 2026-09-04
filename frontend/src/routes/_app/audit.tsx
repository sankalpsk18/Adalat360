import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, Search, Download } from "lucide-react";
import { useAuth } from '@/lib';
import { useAudit } from '@/lib/queries';
import { PageHeader, SectionCard, RoleBadge } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { fmtDate } from '@/lib';
import { auditApi } from '@/lib/api/client';

export const Route = createFileRoute("/_app/audit")({ component: AuditPage });

function AuditPage() {
  const { role } = useAuth();
  const [caseId, setCaseId] = useState('');
  const [action, setAction] = useState('');
  const { data: auditData, isLoading } = useAudit({ caseId, limit: '100' });

  const logs = auditData?.logs || [];

  return (
    <>
      <PageHeader
        title="Audit & Compliance"
        subtitle="System-wide activity logs"
        action={
          <Button variant="outline" onClick={() => auditApi.export({ caseId }).then(r => r.blob()).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          })}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <SectionCard className="mb-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs">Case Filter</Label>
            <Input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Case ID (optional)"
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Label className="text-xs">Action Filter</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="UPLOAD">Upload</SelectItem>
                <SelectItem value="VIEW">View</SelectItem>
                <SelectItem value="DOWNLOAD">Download</SelectItem>
                <SelectItem value="EDIT_VERSION">Edit Version</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
                <SelectItem value="VERIFY">Verify</SelectItem>
                <SelectItem value="SIGN">Sign</SelectItem>
                <SelectItem value="REDACT">Redact</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-1.5 pr-3 font-medium">Timestamp</th>
                  <th className="py-1.5 pr-3 font-medium">Actor</th>
                  <th className="py-1.5 pr-3 font-medium">Action</th>
                  <th className="py-1.5 pr-3 font-medium">Resource</th>
                  <th className="py-1.5 pr-3 font-medium">Case</th>
                  <th className="py-1.5 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                    <td className="font-mono py-1.5 pr-3 text-[11px]">{fmtDate(log.timestamp)}</td>
                    <td className="py-1.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.actor?.name || log.actorId}</span>
                        {log.actor?.role && <RoleBadge role={ROLE_MAP[log.actor.role] || 'investigating_officer'} />}
                      </div>
                    </td>
                    <td className="py-1.5 pr-3 text-xs">{log.action.replace('_', ' ')}</td>
                    <td className="font-mono py-1.5 pr-3 text-xs">{log.resourceType}:{log.resourceId}</td>
                    <td className="py-1.5 pr-3 text-xs text-muted-foreground">{log.caseId || '—'}</td>
                    <td className="font-mono py-1.5 text-[11px] text-muted-foreground">{log.ip || '—'}</td>
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