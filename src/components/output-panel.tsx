import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Flag, Pencil, RefreshCw, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ntethe text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ mark: ({ children }) => <mark>{children}</mark> }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="flex items-center gap-2 text-xs text-gold">
      <ShieldAlert className="h-3.5 w-3.5" /> AI-generated content – review before sending.
    </p>
  );
}

export function ReportButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toast.success("Thanks — bad output reported. We'll use this to improve the prompts.")}
    >
      <Flag /> Report bad output
    </Button>
  );
}

/** Output with mandatory Review & Edit step before copying. */
export function OutputPanel({
  output,
  setOutput,
  loading,
  onRegenerate,
}: {
  output: string;
  setOutput: (s: string) => void;
  loading: boolean;
  onRegenerate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  if (!output && !loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Your result will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-5 fade-up">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Disclaimer />
        {loading && <span className="text-xs text-muted-foreground animate-pulse">Writing…</span>}
      </div>
      {loading && !output ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : editing ? (
        <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-72 font-mono text-xs" />
      ) : (
        <Markdown>{output}</Markdown>
      )}
      {!loading && output && (
        <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(!editing);
              setReviewed(true);
            }}
          >
            {editing ? <Check /> : <Pencil />} {editing ? "Done editing" : "Review & Edit"}
          </Button>
          <Button
            variant="gold"
            size="sm"
            disabled={!reviewed}
            title={reviewed ? "" : "Review the output first"}
            onClick={() => {
              navigator.clipboard.writeText(output.replace(/<\/?mark>/g, ""));
              toast.success("Copied to clipboard");
            }}
          >
            <Copy /> Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={onRegenerate}>
            <RefreshCw /> Regenerate
          </Button>
          <ReportButton />
          {!reviewed && <p className="w-full text-xs text-muted-foreground">Tap “Review & Edit” to check the text before copying.</p>}
        </div>
      )}
    </div>
  );
}
