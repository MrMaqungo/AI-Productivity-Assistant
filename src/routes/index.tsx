import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, NotebookPen, CalendarCheck, MessagesSquare, Shirt, MessageCircleReply, FlaskConical, ArrowRight, MessageCircle } from "lucide-react";
import campaign from "@/assets/ntethe-campaign.png.asset.json";
import { BrushDivider } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getActivity, type Activity } from "@/lib/activity";
import { PROMPTS, TIME_SAVED_MIN, type Feature } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ntethe Assistant — Dashboard" },
      { name: "description", content: "AI-powered productivity dashboard for Ntethe Clothing: emails, meetings, plans, chat and styling." },
      { property: "og:title", content: "Ntethe Assistant — Dashboard" },
      { property: "og:description", content: "Work smarter at Ntethe Clothing. Kasi Roots. Global Mindset." },
    ],
  }),
  component: Dashboard,
});

const CARDS: { feature: Feature; to: string; icon: typeof Mail; desc: string }[] = [
  { feature: "email", to: "/email", icon: Mail, desc: "Ready-to-send emails with subject lines." },
  { feature: "meetings", to: "/meetings", icon: NotebookPen, desc: "Summaries, decisions and action items." },
  { feature: "planner", to: "/planner", icon: CalendarCheck, desc: "Eisenhower-prioritised daily or weekly plans." },
  { feature: "chat", to: "/chat", icon: MessagesSquare, desc: "Ask about orders, stock, marketing." },
  { feature: "studio", to: "/studio", icon: Shirt, desc: "Customer vibe quiz → 3 Ntethe looks." },
  { feature: "replies", to: "/replies", icon: MessageCircleReply, desc: "Replies in English, isiXhosa or kasi style." },
];

function Dashboard() {
  const [activity, setActivity] = useState<Activity[]>([]);
  useEffect(() => setActivity(getActivity()), []);

  return (
    <div className="space-y-12">

      <section className="grid overflow-hidden rounded-xl border bg-card fade-up md:grid-cols-[1.05fr_1fr]">
        <img
          src={campaign.url}
          alt="Ntethe campaign shot: model in the black hoodie, joggers and tartan cap on concrete steps at golden hour, with the Khayelitsha sign and Table Mountain behind"
          width={1313}
          height={1198}
          className="h-80 w-full object-cover object-[center_30%] md:h-full"
        />
        <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
          <p className="font-script text-2xl text-gold">Kasi Roots. Bigger Dreams.</p>
          <h1 className="text-4xl leading-tight">Wear Your Brand.</h1>
          <BrushDivider className="max-w-[160px]" />
          <p className="text-sm text-muted-foreground">
            Shot in Khayelitsha at golden hour — the oversized hoodie, matching joggers and tartan cap you'll find in the Style Studio.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button asChild variant="gold" size="sm">
              <Link to="/studio">
                <Shirt /> Shop the look
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://wa.me/27637544847" target="_blank" rel="noreferrer">
                <MessageCircle /> Order on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl">Quick actions</h2>
        <BrushDivider className="mt-3 mb-6 max-w-[140px]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ feature, to, icon: Icon, desc }) => {
            const uses = activity.filter((a) => a.feature === feature).length;
            return (
              <Link key={to} to={to} className="group rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-gold/60">
                <div className="flex items-start justify-between">
                  <Icon className="h-6 w-6 text-gold" />
                  <span className="text-xs text-muted-foreground">~{TIME_SAVED_MIN[feature]} min saved / use</span>
                </div>
                <h3 className="mt-4 text-xl">{PROMPTS[feature].title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{uses} uses · {uses * TIME_SAVED_MIN[feature]} min saved</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </div>
              </Link>
            );
          })}
          <Link to="/prompt-lab" className="group rounded-lg border border-dashed p-5 transition-colors hover:border-gold/60">
            <FlaskConical className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl">Prompt Lab</h3>
            <p className="mt-1 text-sm text-muted-foreground">See the prompts behind every tool and compare results.</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl">Recent activity</h2>
        <BrushDivider className="mt-3 mb-6 max-w-[140px]" />
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet — try a quick action above.</p>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {activity.slice(0, 8).map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span>
                  <span className="text-gold">{PROMPTS[a.feature].title}</span> · {a.label}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(a.at).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
