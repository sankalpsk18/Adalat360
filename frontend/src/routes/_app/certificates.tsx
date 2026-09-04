import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useSession } from '@/lib/session';
import { PageHeader, SectionCard } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from '@/lib/api/client';
import { useDocuments } from '@/lib/queries';
import { toast } from 'sonner';
import { useState } from 'react';

export const Route = createFileRoute("/_app/certificates")({ component: CertificatesPage });

function CertificatesPage() {
  const { activeCaseId, name } = useSession();
  const { data: documents = [] } = useDocuments(activeCaseId);
  const [selectedId, setSelectedId] = useState('');
  const selectedDocument = documents.find((document: any) => document.id === selectedId);
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (docId: string) => certificatesApi.generate(docId),
    onSuccess: () => {
      toast.success('Certificate generated');
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to generate'),
  });

  return (
    <>
      <PageHeader
        title="BSA §63 Certificates"
        subtitle="Generate and manage Section 65B certificates for electronic records"
      />

      <div className="grid gap-3 lg:grid-cols-2">
      <SectionCard title="Generate Certificate">
        <div className="max-w-xl space-y-4">
          <p className="text-sm text-muted-foreground">
            Select an evidence item to generate a BSA §63 certificate for electronic record admissibility.
          </p>
          <label className="block text-sm font-medium">
            Select Evidence Item
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              <option value="">Select document...</option>
              {documents.map((document: any) => <option key={document.id} value={document.id}>{document.filename} ({document.caseId})</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Authorized Officer
            <input className="mt-1 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm" value={name} readOnly />
          </label>
          <label className="block text-sm font-medium">
            Technical Expert (if required)
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select expert...</option>
              <option value="FSL">Forensic Analyst (FSL)</option>
            </select>
          </label>
          <Button
            onClick={() => selectedId && generateMutation.mutate(selectedId)}
            disabled={!selectedId || generateMutation.isPending}
          >
            <FileText className="size-4" /> {generateMutation.isPending ? 'Generating...' : 'Generate Section 63 Certificate Draft'}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Certificate Preview">
        {selectedDocument ? (
          <div className="border border-border bg-card p-5 shadow-sm">
            <h2 className="text-center text-lg font-semibold uppercase tracking-widest">Certificate under Section 63</h2>
            <p className="mb-5 text-center text-xs text-muted-foreground">Bharatiya Sakshya Adhiniyam, 2023</p>
            <div className="space-y-2 text-sm">
              <CertificateRow label="Case ID" value={selectedDocument.caseId} />
              <CertificateRow label="Document ID" value={selectedDocument.id} />
              <CertificateRow label="Document Name" value={selectedDocument.filename} />
              <CertificateRow label="Document Type" value={selectedDocument.docType} />
              <CertificateRow label="SHA-256 Hash" value={selectedDocument.sha256Hash} mono />
              <CertificateRow label="Uploaded By" value={selectedDocument.uploader?.name || name} />
              <CertificateRow label="Timestamp" value={selectedDocument.uploadedAt ? new Date(selectedDocument.uploadedAt).toLocaleString() : '—'} />
              <CertificateRow label="Custody Ref" value={`LEDGER-${selectedDocument.id}-001`} mono />
            </div>
            <hr className="my-5 border-border" />
            <p className="text-sm leading-6">I hereby certify that the above electronic record was produced from the custody of {selectedDocument.docType} records and that the hash value matches the original at the time of capture. The record has not been altered since upload as verified by the tamper-evident custody ledger.</p>
            <div className="mt-8 grid grid-cols-2 gap-6 text-center text-xs">
              <div><div className="mb-2 border-b border-foreground" />Authorized Officer</div>
              <div><div className="mb-2 border-b border-foreground" />Technical Expert (if applicable)</div>
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Select an evidence item to preview the BSA §63 certificate draft.</p>
        )}
      </SectionCard>
      </div>
    </>
  );
}

function CertificateRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="flex justify-between gap-4"><span className="font-semibold">{label}:</span><span className={mono ? 'font-mono text-xs' : 'text-right'}>{value}</span></div>;
}