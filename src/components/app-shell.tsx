import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Monogram, BrushDivider } from "./brand";
import { AboutAI } from "./about-ai";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Email" },
  { to: "/meetings", label: "Meetings" },
  { to: "/planner", label: "Planner" },
  { to: "/chat", label: "Chat" },
  { to: "/studio", label: "Style Studio" },
  { to: "/replies", label: "Client Replies" },
  { to: "/prompt-lab", label: "Prompt Lab" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Monogram />
            <span className="leading-tight">
              <span className="block font-serif text-xl tracking-[0.2em]">NTETHE</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Assistant</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-gold"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto lg:ml-0">
            <AboutAI />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="grid gap-1 border-t px-4 py-3 lg:hidden fade-up">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm data-[status=active]:bg-secondary data-[status=active]:text-gold"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <BrushDivider className="mb-6 max-w-[160px]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-2xl tracking-[0.2em]">NTETHE</p>
              <p className="font-script text-2xl text-gold">Wear Your Brand.</p>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Facebook: <span className="text-foreground">Ntethe Clothing</span></li>
              <li>TikTok: <span className="text-foreground">Ntethe Clo</span></li>
              <li>
                WhatsApp:{" "}
                <a className="text-foreground hover:text-gold" href="https://wa.me/27637544847">063 754 4847</a>
              </li>
            </ul>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Privacy: we don't store what you type. AI-generated content – review before sending.
          </p>
        </div>
      </footer>
    </div>
  );
}
