import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Share2, Sparkle, MessageCircle, Crown } from "lucide-react";
import { PageHeader, BrushDivider } from "@/components/brand";
import { Disclaimer, ReportButton } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAI } from "@/lib/ai-client";
import campaign from "@/assets/ntethe-campaign.png.asset.json";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kasi Style Studio — Ntethe Clothing" },
      { name: "description", content: "Take a quick vibe quiz and get 3 Ntethe streetwear looks. Order on WhatsApp." },
      { property: "og:title", content: "Kasi Style Studio — Ntethe Clothing" },
      { property: "og:description", content: "Find your Ntethe look. Wear Your Brand." },
    ],
  }),
  component: Studio,
});

const QUIZ = [
  { key: "occasion", q: "Where are you headed?", options: ["Chilling with the squad", "Date night", "Campus / work", "Weekend trip", "Event / party"] },
  { key: "colour", q: "Favourite colour?", options: ["Black", "White", "Navy", "Mix it up"] },
  { key: "fit", q: "Fit preference?", options: ["Oversized", "Relaxed", "Fitted"] },
  { key: "budget", q: "Budget?", options: ["One key piece", "A full fit", "Go all out"] },
  { key: "mood", q: "Your mood?", options: ["Calm & clean", "Bold & loud", "Lowkey luxury", "Sporty"] },
] as const;

type Look = { name: string; items: string[]; tip: string; image?: string };
const WA = "27637544847";

const LOOK_OF_WEEK: Look = {
  name: "Ekasi Midnight",
  image: campaign.url,
  items: [
    "Black oversized hoodie with NTETHE chest logo",
    "Matching black joggers",
    "Green-and-yellow tartan flat cap",
    "Clean white sneakers",
  ],
  tip: "One dark fit, one loud cap — keep the sneakers white and let the tartan do the talking.",
};

function waLink(look: Look) {
  const msg = `Hi Ntethe! I'd like to order the "${look.name}" look:\n${look.items.map((i) => `• ${i}`).join("\n")}\nSize: \nDelivery area: `;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

async function share(look: Look) {
  const text = `My Ntethe look: ${look.name} — ${look.items.join(", ")}. Wear Your Brand.`;
  try {
    if (navigator.share) await navigator.share({ title: look.name, text, url: location.href });
    else {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      toast.success("Look copied — paste it anywhere to share!");
    }
  } catch {
    /* cancelled */
  }
}

function LookCard({ look, featured }: { look: Look; featured?: boolean }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border bg-card fade-up ${featured ? "border-gold/60 shadow-gold" : ""}`}>
      {look.image && (
        <img
          src={look.image}
          alt={`The "${look.name}" look: black hoodie, matching joggers, tartan cap and white sneakers`}
          width={1313}
          height={1198}
          className="h-64 w-full object-cover object-[center_30%] md:h-80"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-script text-lg text-gold">{featured ? "Look of the Week" : "Your look"}</p>
        <h3 className="text-2xl">{look.name}</h3>
        <BrushDivider className="my-3 max-w-[90px]" />
        <ul className="space-y-1 text-sm">
          {look.items.map((i) => (
            <li key={i} className="flex gap-2"><Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />{i}</li>
          ))}
        </ul>
        <p className="mt-3 flex-1 text-sm italic text-muted-foreground">“{look.tip}”</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="whatsapp" size="sm">
            <a href={waLink(look)} target="_blank" rel="noreferrer"><MessageCircle /> Order on WhatsApp</a>
          </Button>
          <Button variant="outline" size="sm" onClick={() => share(look)}><Share2 /> Share my look</Button>
        </div>
      </div>
    </div>
  );
}

function parseLooks(text: string): Look[] | null {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    const data = JSON.parse(m ? m[0] : text);
    const looks = (data.looks as Look[]).filter((l) => l.name && Array.isArray(l.items));
    return looks.length ? looks.slice(0, 3) : null;
  } catch {
    return null;
  }
}

function Studio() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [looks, setLooks] = useState<Look[] | null>(null);
  const ai = useAI("studio", "Style quiz looks");
  const complete = QUIZ.every((q) => answers[q.key]);

  const go = async () => {
    if (!complete) return void toast.error("Answer all 5 questions first.");
    setLooks(null);
    const text = await ai.run(QUIZ.map((q) => `${q.q} ${answers[q.key]}`).join("\n"));
    if (!text) return;
    const parsed = parseLooks(text);
    if (!parsed) toast.error("Couldn't read the looks — please try again.");
    setLooks(parsed);
  };

  return (
    <>
      <PageHeader eyebrow="Kasi Roots. Global Mindset." title="Kasi Style Studio" desc="Five quick questions. Three Ntethe looks made for you." />

      <section className="mb-12">
        <div className="max-w-md"><LookCard look={LOOK_OF_WEEK} featured /></div>
      </section>

      <section className="space-y-6 rounded-lg border bg-card p-5 md:p-8">
        <h2 className="flex items-center gap-2 text-2xl"><Crown className="h-5 w-5 text-gold" /> Vibe quiz</h2>
        {QUIZ.map((q, i) => (
          <div key={q.key}>
            <p className="mb-2 text-sm font-medium"><span className="text-gold">{i + 1}.</span> {q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => (
                <button
                  key={o}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: o }))}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${answers[q.key] === o ? "border-gold bg-gold text-gold-foreground" : "hover:border-gold/60"}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
        <Button variant="gold" size="lg" onClick={go} disabled={ai.loading || !complete}>
          {ai.loading ? "Styling you…" : "Show my looks"}
        </Button>
        <p className="text-xs text-muted-foreground">We don't save your answers.</p>
      </section>

      {(ai.loading || looks) && (
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-3xl">Your looks</h2>
            <div className="flex items-center gap-2"><Disclaimer /><ReportButton /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ai.loading
              ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-64" />)
              : looks?.map((l) => <LookCard key={l.name} look={l} />)}
          </div>
        </section>
      )}
    </>
  );
}
