import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Search } from "lucide-react";
import { useAuth } from '@/lib';
import { useCaseCustody } from '@/lib/queries';
import { PageHeader, SectionCard, CustodyEventRow, HashChip } from '@/components/primitives';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute("/_app/ledger")({ component: Ledger });

function Ledger() {
  const { role } = useAuth();
  const [filterCaseId, setFilterCaseId] = useState('');
  const { data: custody = [], isLoading } = useCaseCustody(filterCaseId || 'CR-2026-0417');

  return (
    <>
      <PageHeader
        title="Custody Ledger"
        subtitle="Hash-chained custody trail for all documents"
      />

      <SectionCard className="mb-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="text-xs">Filter by Case</Label>
            <Input
              value={filterCaseId}
              onChange={(e) => setFilterCaseId(e.target.value)}
              placeholder="Case ID (e.g., CR-2026-0417)"
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
        ) : custody.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custody entries found.</p>
        ) : (
          <ol className="relative">
            {custody.map((e: any, i: number) => (
              <CustodyEventRow key={e.id} event={e} last={i === custody.length - 1} />
            ))}
          </ol>
        )}
      </SectionCard>
    </>
  );
}