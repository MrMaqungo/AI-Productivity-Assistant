import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AboutAI() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info /> About this AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">About this AI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <section>
            <h3 className="mb-1 text-base text-foreground">Limitations</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>It can sound confident and still be wrong. It doesn't know your real stock, prices or orders.</li>
              <li>It may invent details — check every name, date and number.</li>
            </ul>
          </section>
          <section>
            <h3 className="mb-1 text-base text-foreground">Bias & language risks</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Tone can miss the mark — too formal, too casual, or culturally off.</li>
              <li>isiXhosa and kasi-style replies may contain grammar, spelling or slang errors. Have a fluent speaker check them.</li>
              <li>Style suggestions may reflect stereotypes about gender, age or body type.</li>
            </ul>
          </section>
          <section>
            <h3 className="mb-1 text-base text-foreground">How to validate</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Always use “Review & Edit” before copying.</li>
              <li>Compare summaries against the original notes.</li>
              <li>Use “Report bad output” when something is wrong.</li>
            </ul>
          </section>
          <section className="rounded-md border border-gold/40 p-3">
            <h3 className="mb-1 text-base text-foreground">Privacy</h3>
            <p>
              Nothing you type is saved. Only a short activity log (feature + time) stays in this browser. Don't paste ID
              numbers, bank details or other sensitive personal data.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
