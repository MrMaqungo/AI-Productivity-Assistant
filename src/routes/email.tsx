import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { TwoCol, Field, PrivacyNote } from "@/components/feature-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/lib/ai-client";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Ntethe Assistant" },
      { name: "description", content: "Generate ready-to-send business emails with the right tone for clients, suppliers and your team." },
      { property: "og:title", content: "Smart Email Generator — Ntethe Assistant" },
      { property: "og:description", content: "Ready-to-send emails, in the right tone, in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState("formal");
  const [audience, setAudience] = useState("client");
  const ai = useAI("email", `${tone} email to ${audience}`);

  const generate = () => {
    if (purpose.trim().length < 3) return void toast.error("Tell us what the email is for.");
    ai.run(`Purpose: ${purpose}\nKey details: ${details || "none"}\nTone: ${tone}\nAudience: ${audience}`);
  };

  return (
    <>
      <PageHeader eyebrow="Say it right" title="Smart Email Generator" desc="Describe what you need — get a polished email with a subject line." />
      <TwoCol
        form={
          <div className="space-y-4">
            <Field label="Purpose">
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on late hoodie delivery" maxLength={200} />
            </Field>
            <Field label="Key details">
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Order #, quantities, dates…" className="min-h-28" maxLength={2000} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tone">
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Audience">
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Button variant="gold" className="w-full" onClick={generate} disabled={ai.loading}>
              <Wand2 /> {ai.loading ? "Writing…" : "Generate email"}
            </Button>
            <PrivacyNote />
          </div>
        }
        output={<OutputPanel output={ai.output} setOutput={ai.setOutput} loading={ai.loading} onRegenerate={generate} />}
      />
    </>
  );
}
