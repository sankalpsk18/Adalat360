import { createFileRoute } from "@tanstack/react-router";
import { EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from '@/lib';
import { PageHeader, SectionCard, RestrictedTag } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export const Route = createFileRoute("/_app/redaction")({ component: RedactionPage });

function RedactionPage() {
  const { role } = useAuth();
  const [docId, setDocId] = useState('');
  const [reason, setReason] = useState('');

  return (
    <>
      <PageHeader
        title="Redaction"
        subtitle="Create redacted copies of restricted documents"
      />

      <SectionCard>
        <form className="space-y-4 max-w-2xl">
          <div>
            <Label className="text-xs">Document ID</Label>
            <Input
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g., DOC-1002"
              className="mt-1 font-mono"
            />
          </div>

          <div>
            <Label className="text-xs">Redaction Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Legal basis for redaction (e.g., witness protection, national security)"
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs">Page</Label>
              <Input type="number" placeholder="1" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">X Position</Label>
              <Input type="number" placeholder="100" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Y Position</Label>
              <Input type="number" placeholder="200" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Width</Label>
              <Input type="number" placeholder="300" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input type="number" placeholder="150" className="mt-1" />
            </div>
          </div>

          <Button>
            <EyeOff className="size-4" /> Apply Redaction
          </Button>
        </form>
      </SectionCard>

      <SectionCard title="Applied Redactions">
        <p className="text-sm text-muted-foreground">Redaction history would appear here.</p>
      </SectionCard>
    </>
  );
}