import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useAuth } from '@/lib';
import { useCases } from '@/lib/queries';
import { PageHeader, SectionCard } from '@/components/primitives';
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
import { useMutation } from '@tanstack/react-query';
import { casesApi, documentsApi } from '@/lib/api/client';
import { toast } from 'sonner';

export const Route = createFileRoute("/_app/intake")({ component: Intake });

function Intake() {
  const { role, user } = useAuth();
  const { data: cases = [] } = useCases(role);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [caseId, setCaseId] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('FIR');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const intakeMutation = useMutation({
    mutationFn: async () => {
      let targetCaseId = caseId;
      if (mode === 'new') {
        if (!caseNumber.trim() || !caseTitle.trim()) throw new Error('Case number and title are required');
        const created = await casesApi.create({
          caseNumber: caseNumber.trim(),
          title: caseTitle.trim(),
          department: user?.department || 'City Police — Crime Branch',
        });
        targetCaseId = created.case.id;
      }
      if (!targetCaseId) throw new Error('Please select a case');
      if (!file) return { caseOnly: true };
      return documentsApi.upload(file, targetCaseId, title, docType);
    },
    onSuccess: () => {
      toast.success(mode === 'new' && !file ? 'Case created successfully' : 'Document uploaded successfully');
      setFile(null);
      setTitle('');
      setCaseNumber('');
      setCaseTitle('');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Upload failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'existing' && (!caseId || !file)) {
      toast.error('Please select an existing case and file');
      return;
    }
    intakeMutation.mutate();
  };

  return (
    <>
      <PageHeader
        title="Intake / Upload"
        subtitle="Upload new documents to a case"
      />

      <SectionCard>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="flex gap-2 rounded-lg bg-muted p-1">
            <Button type="button" variant={mode === 'existing' ? 'default' : 'ghost'} className="flex-1" onClick={() => setMode('existing')}>
              Upload to existing case
            </Button>
            <Button type="button" variant={mode === 'new' ? 'default' : 'ghost'} className="flex-1" onClick={() => setMode('new')}>
              Add new case
            </Button>
          </div>

          {mode === 'new' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Case Number</Label>
                <Input value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} placeholder="CR-2026-0450" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Case Title</Label>
                <Input value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} placeholder="Brief case title" className="mt-1" />
              </div>
            </div>
          ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Select Case</Label>
              <Select value={caseId} onValueChange={setCaseId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.length === 0 ? (
                    <SelectItem value="none" disabled>No cases available</SelectItem>
                  ) : cases.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.id} — {c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Document Type</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIR">FIR</SelectItem>
                  <SelectItem value="CHARGE_SHEET">Charge Sheet</SelectItem>
                  <SelectItem value="WITNESS_STATEMENT">Witness Statement</SelectItem>
                  <SelectItem value="COURT_FILING">Court Filing</SelectItem>
                  <SelectItem value="JUDGMENT">Judgment</SelectItem>
                  <SelectItem value="FORENSIC_REPORT">Forensic Report</SelectItem>
                  <SelectItem value="DEVICE_EXTRACT">Device Extract</SelectItem>
                  <SelectItem value="PHOTO">Photo</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                  <SelectItem value="LEGAL_NOTICE">Legal Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          )}

          <div>
            <Label className="text-xs">Title (optional)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">File</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1"
              disabled={isLoading || intakeMutation.isPending}
            />
            {file && <p className="mt-1 text-sm text-muted-foreground">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>

          <Button type="submit" disabled={isLoading || intakeMutation.isPending}>
            <Upload className="size-4" /> {isLoading || intakeMutation.isPending ? 'Saving...' : mode === 'new' && !file ? 'Create Case' : 'Upload Document'}
          </Button>
        </form>
      </SectionCard>
    </>
  );
}