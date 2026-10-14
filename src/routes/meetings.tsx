import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { TwoCol, Field, PrivacyNote } from "@/components/feature-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/lib/ai-client";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Ntethe Assistant" },
      { name: "description", content: "Turn long meeting notes into a summary, key decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — Ntethe Assistant" },
      { property: "og:description", content: "From messy notes to clear action items." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const ai = useAI("meetings", "Meeting summarised");
  const generate = () => {
    if (notes.trim().length < 40) return toast.error("Paste a bit more of your notes (at least a few sentences).");
    ai.run(notes);
  };
  return (
    <>
      <PageHeader eyebrow="No more lost decisions" title="Meeting Notes Summarizer" desc="Paste your notes. Get a summary, decisions, an action-items table and highlighted deadlines." />
      <TwoCol
        form={
          <div className="space-y-4">
            <Field label="Meeting notes" hint={`${notes.length} / 12000 characters`}>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-80" maxLength={12000} placeholder="Paste your notes here…" />
            </Field>
            <Button variant="gold" className="w-full" onClick={generate} disabled={ai.loading}>
              <Wand2 /> {ai.loading ? "Summarising…" : "Summarise"}
            </Button>
            <PrivacyNote />
          </div>
        }
        output={<OutputPanel output={ai.output} setOutput={ai.setOutput} loading={ai.loading} onRegenerate={generate} />}
      />
    </>
  );
}
