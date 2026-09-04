import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Plus, Search, ShieldCheck } from "lucide-react";
import { useAuth } from '@/lib';
import { useExhibits } from '@/lib/queries';
import { PageHeader, SectionCard, HashChip, RoleBadge } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export const Route = createFileRoute("/_app/exhibits")({ component: ExhibitsPage });

function ExhibitsPage() {
  const { role } = useAuth();
  const [caseId, setCaseId] = useState('CR-2026-0417');
  const { data: exhibits = [], isLoading } = useExhibits(caseId);

  return (
    <>
      <PageHeader
        title="Exhibit Register"
        subtitle="Physical evidence and exhibit management"
        action={
          <Button>
            <Plus className="size-4" /> Register Exhibit
          </Button>
        }
      />

      <SectionCard className="mb-4">
        <div className="flex gap-4">
          <div className="flex-1 max-w-xs">
            <Label className="text-xs">Filter by Case</Label>
            <Input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Case ID"
              className="mt-1 font-mono text-sm"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : exhibits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No exhibits registered for this case.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-1.5 pr-3 font-medium">Code</th>
                  <th className="py-1.5 pr-3 font-medium">Label</th>
                  <th className="py-1.5 pr-3 font-medium">Category</th>
                  <th className="py-1.5 pr-3 font-medium">Status</th>
                  <th className="py-1.5 pr-3 font-medium">Location</th>
                  <th className="py-1.5 pr-3 font-medium">Holder</th>
                  <th className="py-1.5 font-medium">Seal</th>
                </tr>
              </thead>
              <tbody>
                {exhibits.map((e: any) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                    <td className="py-1.5 pr-3 font-mono text-xs">{e.exhibitCode}</td>
                    <td className="py-1.5 pr-3">{e.label}</td>
                    <td className="py-1.5 pr-3 text-xs text-muted-foreground">{e.category?.replace('_', ' ') || e.category}</td>
                    <td className="py-1.5 pr-3">
                      <Badge variant="outline" className="text-xs">{e.status?.replace('_', ' ') || e.status}</Badge>
                    </td>
                    <td className="py-1.5 pr-3 text-sm">{e.location}</td>
                    <td className="py-1.5 pr-3 text-sm">{e.holder}</td>
                    <td className="py-1.5 pr-3"><HashChip hash={e.sealHash} /></td>
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