import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { Markdown, Disclaimer } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAI } from "@/lib/ai-client";
import { PROMPTS, type Feature } from "@/lib/prompts";

export const Route = createFileRoute("/prompt-lab")({
  head: () => ({
    meta: [
      { title: "Prompt Lab — Ntethe Assistant" },
      { name: "description", content: "See the structured prompts behind each tool and compare original vs refined outputs." },
      { property: "og:title", content: "Prompt Lab — Ntethe Assistant" },
      { property: "og:description", content: "Role, context, task, constraints, output format." },
    ],
  }),
  component: PromptLab,
});

const SAMPLES: Record<Feature, string> = {
  email: "Purpose: ask supplier for 200 navy 240GSM blanks\nKey details: need by 30 Nov\nTone: formal\nAudience: supplier",
  meetings: "Met with Sipho and Lindi. Agreed to drop the back-print tee on 1 Dec. Lindi to shoot TikTok content by Friday. Sipho to confirm hoodie stock. Budget for ads R2000.",
  planner: "Plan type: daily\nTasks:\n- Pack 12 orders (urgent: yes, important: yes)\n- Plan December drop (urgent: no, important: yes)\n- Reply to DMs (urgent: yes, important: no)",
  chat: "Give me 3 marketing ideas for our caps.",
  studio: "Occasion: chilling with friends; Colour: navy; Fit: oversized; Budget: mid; Mood: calm",
  replies: "Language/tone: Kasi casual\nCustomer message: Do you have XL black tees?",
};

function PromptLab() {
  const [feature, setFeature] = useState<Feature>("email");
  const [refined, setRefined] = useState(true);
  const [input, setInput] = useState(SAMPLES.email);
  const orig = useAI(feature, "Prompt Lab: original");
  const ref = useAI(feature, "Prompt Lab: refined");

  const compare = async () => {
    if (input.trim().length < 3) return toast.error("Add a test input.");
    await Promise.all([orig.run(input, "original"), ref.run(input, "refined")]);
  };

  return (
    <>
      <PageHeader eyebrow="Under the hood" title="Prompt Lab" desc="Every tool uses a structured system prompt. Compare a basic prompt with the refined one." />
      <Tabs value={feature} onValueChange={(v) => { setFeature(v as Feature); setInput(SAMPLES[v as Feature]); orig.setOutput(""); ref.setOutput(""); }}>
        <TabsList className="h-auto flex-wrap">
          {(Object.keys(PROMPTS) as Feature[]).map((f) => (
            <TabsTrigger key={f} value={f}>{PROMPTS[f].title}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">{refined ? "Refined prompt" : "Original prompt"}</h2>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Original <Switch checked={refined} onCheckedChange={setRefined} /> Refined
            </label>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">{refined ? PROMPTS[feature].refined : PROMPTS[feature].original}</pre>
        </div>
        <div className="space-y-3 rounded-lg border bg-card p-5">
          <h2 className="text-xl">Test input</h2>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-40" maxLength={4000} />
          <Button variant="gold" onClick={compare} disabled={orig.loading || ref.loading}>
            <FlaskConical /> Compare outputs
          </Button>
        </div>
      </div>

      {(orig.output || ref.output || orig.loading) && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {[["Original prompt output", orig], ["Refined prompt output", ref]].map(([label, r]) => {
            const ai = r as typeof orig;
            return (
              <div key={label as string} className="rounded-lg border bg-card p-5 fade-up">
                <h3 className="mb-2 text-lg text-gold">{label as string}</h3>
                <Disclaimer />
                <div className="mt-3">{ai.output ? <Markdown>{ai.output}</Markdown> : <p className="text-sm text-muted-foreground animate-pulse">Generating…</p>}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
