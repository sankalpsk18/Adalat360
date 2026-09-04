import { createFileRoute } from "@tanstack/react-router";
import { UserCog, ShieldCheck, Database, Play, RefreshCw, Wrench } from "lucide-react";
import { useAuth } from '@/lib';
import { useSystemHealth, useSystemStats } from '@/lib/queries';
import { PageHeader, SectionCard } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { systemApi } from '@/lib/api/client';
import { toast } from 'sonner';

export const Route = createFileRoute("/_app/admin")({ component: AdminPage });

function AdminPage() {
  const { role } = useAuth();
  const { data: health } = useSystemHealth();
  const { data: stats } = useSystemStats();

  const seedMutation = useMutation({
    mutationFn: () => systemApi.seed(),
    onSuccess: () => toast.success('Database seeded'),
    onError: (error: Error) => toast.error(error.message || 'Seed failed'),
  });

  const integrityMutation = useMutation({
    mutationFn: () => systemApi.integrityCheck('CR-2026-0417'),
    onSuccess: (data) => toast.success(`Integrity check: ${data.verified}/${data.totalDocuments} verified`),
    onError: (error: Error) => toast.error(error.message || 'Check failed'),
  });

  const llmMutation = useMutation({
    mutationFn: () => systemApi.llmUsage(),
    onSuccess: (data) => toast.success(`LLM Usage: ${JSON.stringify(data.usage)}`),
    onError: (error: Error) => toast.error(error.message || 'Failed'),
  });

  if (role !== 'system_admin') {
    return (
      <SectionCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <UserCog className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Access Denied</h3>
          <p className="mt-1 text-sm text-muted-foreground">System Administrator role required.</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <>
      <PageHeader
        title="Admin Panel"
        subtitle="System administration and monitoring"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SectionCard title="System Health">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-verified">{health?.status || 'unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-mono text-xs">{health?.service || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono text-xs">{health?.version || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timestamp</span>
              <span className="font-mono text-xs">{health?.timestamp || '—'}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Statistics">
          <div className="space-y-2 text-sm">
            {stats?.stats && Object.entries(stats.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-mono">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Actions">
          <div className="space-y-2">
            <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
              <Database className="size-4" /> {seedMutation.isPending ? 'Seeding...' : 'Seed Database'}
            </Button>
            <Button variant="outline" onClick={() => integrityMutation.mutate()} disabled={integrityMutation.isPending}>
              <ShieldCheck className="size-4" /> {integrityMutation.isPending ? 'Checking...' : 'Run Integrity Check'}
            </Button>
            <Button variant="outline" onClick={() => llmMutation.mutate()} disabled={llmMutation.isPending}>
              <Wrench className="size-4" /> {llmMutation.isPending ? 'Loading...' : 'LLM Usage'}
            </Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}