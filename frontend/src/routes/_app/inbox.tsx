import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertTriangle, Check, X, Mail } from "lucide-react";
import { useState } from 'react';
import { useAuth } from '@/lib';
import { useApprovals } from '@/lib/queries';
import { PageHeader, SectionCard, RoleBadge, HashChip } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '@/lib/api/client';
import { toast } from 'sonner';
import { fmtDate } from '@/lib';

export const Route = createFileRoute("/_app/inbox")({ component: InboxPage });

function InboxPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const { data: approvals = [], isLoading, refetch } = useApprovals({ status: 'PENDING' });

  const decideMutation = useMutation({
    mutationFn: ({ id, decision, notes }: { id: string; decision: 'APPROVED' | 'REJECTED'; notes?: string }) =>
      approvalsApi.decide(id, decision, notes),
    onSuccess: () => {
      toast.success('Decision recorded');
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to decide'),
  });

  const pending = approvals.filter((a: any) => a.status === 'PENDING');

  return (
    <>
      <PageHeader
        title="Approvals Inbox"
        subtitle={`${pending.length} pending requests`}
      />

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Inbox empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">No pending approval requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((a: any) => (
              <div key={a.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{a.title}</p>
                      {a.severity === 'CRITICAL' && <AlertTriangle className="size-4 text-destructive" />}
                      <Badge variant="outline" className="text-xs">{a.kind}</Badge>
                      <Badge variant="outline" className="text-xs">{a.resourceType}</Badge>
                      <RoleBadge role={ROLE_MAP[a.approverRole] || 'investigating_officer'} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{a.description || 'No description'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{a.resourceId}</span>
                      <span>{a.caseId}</span>
                      <span>Requested by: {a.requester?.name || 'Unknown'}</span>
                      <span>{fmtDate(a.createdAt)}</span>
                    </div>
                  </div>
                  <ApprovalActions approval={a} onDecide={() => refetch()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}

function ApprovalActions({ approval, onDecide }: { approval: any; onDecide: () => void }) {
  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const decideMutation = useMutation({
    mutationFn: (decision: 'APPROVED' | 'REJECTED') =>
      approvalsApi.decide(approval.id, decision, notes),
    onSuccess: (data: any, decision: string) => {
      toast.success(`Approval ${decision === 'APPROVED' ? 'granted' : 'rejected'}`);
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      setShowReject(false);
      setNotes('');
      onDecide();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed'),
  });

  if (showReject) {
    return (
      <div className="flex items-center gap-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Rejection reason (required)"
          className="w-64 min-h-[60px]"
          required
        />
        <Button variant="destructive" size="sm" onClick={() => decideMutation.mutate('REJECTED')} disabled={!notes.trim() || decideMutation.isPending}>
          <X className="size-3" /> Reject
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowReject(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => decideMutation.mutate('APPROVED')} disabled={decideMutation.isPending}>
        <Check className="size-3" /> Approve
      </Button>
      <Button variant="outline" onClick={() => setShowReject(true)}>
        <X className="size-3" /> Reject
      </Button>
    </div>
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