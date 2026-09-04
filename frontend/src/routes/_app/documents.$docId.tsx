import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { documentsApi, fmtDate } from "@/lib";
import { useDocument, useDocumentVersions, useCustody } from "@/lib/queries";
import { HashChip, IntegrityBadge, PageHeader, SectionCard } from "@/components/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/documents/$docId")({ component: DocumentDetail });

function DocumentDetail() {
  const { docId } = Route.useParams();
  const { data, isLoading } = useDocument(docId);
  const { data: versionData } = useDocumentVersions(docId);
  const { data: custody = [] } = useCustody(docId);
  const [downloadError, setDownloadError] = useState("");
  const document = data?.document;
  const custodyEntries = Array.isArray(custody) ? custody : [];

  const download = async () => {
    setDownloadError("");
    const response = await documentsApi.download(docId);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Download failed" }));
      setDownloadError(error.error || "Download failed");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = document?.filename || "document";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading document…</p>;
  if (!document) {
    return <SectionCard title="Document not found"><p className="text-sm text-muted-foreground">This document is unavailable to your account.</p></SectionCard>;
  }

  return (
    <>
      <PageHeader
        title={document.filename}
        subtitle={`${document.docType} · uploaded ${fmtDate(document.uploadedAt)}`}
        action={<Button onClick={download}><Download className="size-4" /> Download</Button>}
      />
      {downloadError && <p className="mb-3 text-sm text-destructive">{downloadError}</p>}
      <div className="grid gap-3 lg:grid-cols-2">
        <SectionCard title="Integrity">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><IntegrityBadge state={document.integrity} /><span className="text-muted-foreground">SHA-256</span></div>
            <HashChip hash={document.sha256Hash} className="max-w-full" />
            <p className="text-xs text-muted-foreground">The server verifies this hash after decrypting the vault file before download.</p>
          </div>
        </SectionCard>
        <SectionCard title="Version history">
          <ul className="space-y-2 text-sm">
            {(versionData?.versions || []).map((version: any) => (
              <li key={version.id} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
                <Link to="/documents/$docId" params={{ docId: version.id }} className="hover:underline">Version {version.version}</Link>
                <span className="font-mono text-[11px] text-muted-foreground">{version.sha256Hash.slice(0, 12)}…</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
      <SectionCard title={`Custody events (${custodyEntries.length})`} className="mt-3">
        <ul className="space-y-2 text-sm">
          {custodyEntries.map((entry: any) => (
            <li key={entry.id} className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-2 last:border-0">
              <ShieldCheck className="size-4 text-verified" />
              <span className="font-medium">{entry.action}</span>
              <span className="text-muted-foreground">{entry.actor?.name || entry.actorId}</span>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{fmtDate(entry.timestamp)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
