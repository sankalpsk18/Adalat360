import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Search, AlertTriangle, FileText } from "lucide-react";
import { useAuth } from '@/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ragApi } from '@/lib/api/client';
import { PageHeader, SectionCard, ConflictChip } from '@/components/primitives';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Route = createFileRoute("/_app/search")({ component: SearchPage });

function SearchPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const askMutation = useMutation({
    mutationFn: async (q: string) => ragApi.ask(caseId, q),
    onSuccess: (data) => {
      setAnswer(typeof data.answer === 'string' ? data.answer : data.answer.answer);
      if (data.conflictsDetected > 0) {
        setConflicts(['conflict-1', 'conflict-2']); // Placeholder
      }
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Search failed');
      setIsLoading(false);
    },
  });

  const caseId = queryClient.getQueryData(['caseId']) as string || 'CR-2026-0417';

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    askMutation.mutate(question);
  };

  return (
    <>
      <PageHeader
        title="Conflict-aware Ask"
        subtitle="Ask questions about the case — conflicts and uncertainty will be highlighted"
      />

      <SectionCard>
        <form onSubmit={handleAsk} className="space-y-4 max-w-3xl">
          <div>
            <Label className="text-xs">Your question</Label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What time was the witness seen at Central Mall?"
              className="mt-1 min-h-[100px]"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !question.trim()}>
            <Search className="size-4" /> {isLoading ? 'Searching...' : 'Ask'}
          </Button>
        </form>

        {answer && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Answer</h3>
            <div className="prose prose-sm max-w-none bg-muted/50 rounded-lg p-4">
              {answer.split('\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
        )}

        {conflicts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4" /> Conflicts Detected
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {conflicts.map((c, i) => (
                <ConflictChip key={i} type={c as any} />
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
}