import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/brand";
import { TwoCol, Field, PrivacyNote } from "@/components/feature-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAI } from "@/lib/ai-client";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Ntethe Assistant" },
      { name: "description", content: "Prioritise tasks with an Eisenhower matrix and get a daily or weekly plan." },
      { property: "og:title", content: "AI Task Planner — Ntethe Assistant" },
      { property: "og:description", content: "Do first, schedule, delegate, eliminate." },
    ],
  }),
  component: PlannerPage,
});

type Task = { id: number; text: string; urgent: boolean; important: boolean };

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "", urgent: true, important: true },
  ]);
  const [mode, setMode] = useState("daily");
  const ai = useAI("planner", `${mode} plan`);

  const update = (id: number, patch: Partial<Task>) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const generate = () => {
    const valid = tasks.filter((t) => t.text.trim());
    if (!valid.length) return toast.error("Add at least one task.");
    ai.run(
      `Plan type: ${mode}\nTasks:\n` +
        valid.map((t) => `- ${t.text} (urgent: ${t.urgent ? "yes" : "no"}, important: ${t.important ? "yes" : "no"})`).join("\n"),
    );
  };

  return (
    <>
      <PageHeader eyebrow="Own your day" title="AI Task Planner" desc="List your tasks, flag what's urgent and important, and get a prioritised plan." />
      <TwoCol
        form={
          <div className="space-y-4">
            <Field label="Plan for">
              <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v)} variant="outline" className="justify-start">
                <ToggleGroupItem value="daily">Today</ToggleGroupItem>
                <ToggleGroupItem value="weekly">This week</ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.id} className="space-y-2 rounded-md border p-3">
                  <div className="flex gap-2">
                    <Input value={t.text} onChange={(e) => update(t.id, { text: e.target.value })} placeholder="e.g. Reorder navy tees" maxLength={160} />
                    <Button variant="ghost" size="icon" aria-label="Remove task" onClick={() => setTasks((all) => all.filter((x) => x.id !== t.id))} disabled={tasks.length === 1}>
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="flex gap-5 text-xs">
                    <label className="flex items-center gap-2"><Switch checked={t.urgent} onCheckedChange={(v) => update(t.id, { urgent: v })} /> Urgent</label>
                    <label className="flex items-center gap-2"><Switch checked={t.important} onCheckedChange={(v) => update(t.id, { important: v })} /> Important</label>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" disabled={tasks.length >= 20} onClick={() => setTasks((t) => [...t, { id: Date.now(), text: "", urgent: false, important: true }])}>
                <Plus /> Add task
              </Button>
            </div>
            <Button variant="gold" className="w-full" onClick={generate} disabled={ai.loading}>
              <Wand2 /> {ai.loading ? "Planning…" : "Build my plan"}
            </Button>
            <PrivacyNote />
          </div>
        }
        output={<OutputPanel output={ai.output} setOutput={ai.setOutput} loading={ai.loading} onRegenerate={generate} />}
      />
    </>
  );
}
