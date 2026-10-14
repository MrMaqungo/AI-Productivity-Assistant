import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { TwoCol, Field, PrivacyNote } from "@/components/feature-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAI } from "@/lib/ai-client";

export const Route = createFileRoute("/replies")({
  head: () => ({
    meta: [
      { title: "Client Message Helper — Ntethe Assistant" },
      { name: "description", content: "Friendly customer replies about price, sizing and delivery in English, isiXhosa or kasi style." },
      { property: "og:title", content: "Client Message Helper — Ntethe Assistant" },
      { property: "og:description", content: "Reply to customers fast, in their language." },
    ],
  }),
  component: RepliesPage,
});

const LANGS = { english: "English", isixhosa: "isiXhosa", kasi: "Kasi casual" } as const;

function RepliesPage() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<keyof typeof LANGS>("english");
  const ai = useAI("replies", `${LANGS[lang]} reply`);
  const generate = () => {
    if (query.trim().length < 5) return toast.error("Paste the customer's message first.");
    ai.run(`Language/tone: ${LANGS[lang]}\nCustomer message: ${query}`);
  };
  return (
    <>
      <PageHeader eyebrow="Reply like family" title="Client Message Helper" desc="Paste a customer's question — get a friendly reply ready for WhatsApp." />
      <TwoCol
        form={
          <div className="space-y-4">
            <Field label="Customer message">
              <Textarea value={query} onChange={(e) => setQuery(e.target.value)} className="min-h-36" maxLength={1500} placeholder="e.g. Hi, how much is the navy hoodie and do you deliver to Mthatha?" />
            </Field>
            <Field label="Reply in" hint={lang === "isixhosa" ? "isiXhosa output can contain errors — have a fluent speaker check it." : undefined}>
              <ToggleGroup type="single" value={lang} onValueChange={(v) => v && setLang(v as keyof typeof LANGS)} variant="outline" className="flex-wrap justify-start">
                {Object.entries(LANGS).map(([k, v]) => (
                  <ToggleGroupItem key={k} value={k}>{v}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
            <Button variant="gold" className="w-full" onClick={generate} disabled={ai.loading}>
              <Wand2 /> {ai.loading ? "Writing…" : "Write reply"}
            </Button>
            <PrivacyNote />
          </div>
        }
        output={<OutputPanel output={ai.output} setOutput={ai.setOutput} loading={ai.loading} onRegenerate={generate} />}
      />
    </>
  );
}
