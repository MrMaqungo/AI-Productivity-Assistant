import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, RotateCcw } from "lucide-react";
import { PageHeader, Monogram } from "@/components/brand";
import { Markdown, Disclaimer, ReportButton } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-client";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace Chat — Ntethe Assistant" },
      { name: "description", content: "Chat with an AI workplace assistant about orders, stock, marketing and customer replies." },
      { property: "og:title", content: "Workplace Chat — Ntethe Assistant" },
      { property: "og:description", content: "Your always-on streetwear business assistant." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
const STARTERS = ["Write a TikTok caption for our new navy tee drop", "How should I plan stock for December?", "A customer's parcel is late — how do I reply?"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);
  useEffect(() => {
    if (!loading) ref.current?.focus();
  }, [loading]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const history: Msg[] = [...messages, { role: "user", content: t }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      await streamAI({ feature: "chat", messages: history }, (full) =>
        setMessages([...history, { role: "assistant", content: full }]),
      );
      logActivity("chat", t.slice(0, 40));
    } catch (e) {
      toast.error((e as Error).message);
      setMessages(history.slice(0, -1));
      setInput(t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Ask anything" title="Workplace Chat" desc="Orders, stock, marketing, customer replies — talk it through." />
      <div className="flex h-[65vh] min-h-[460px] flex-col rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Disclaimer />
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} disabled={loading || !messages.length}>
            <RotateCcw /> New chat
          </Button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Monogram className="h-14 w-14 text-2xl" />
              <p className="text-sm text-muted-foreground">Sho! How can I help the business today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <Button key={s} variant="outline" size="sm" className="h-auto whitespace-normal py-2" onClick={() => send(s)}>{s}</Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[85%] rounded-lg bg-navy px-4 py-2.5 text-sm text-navy-foreground fade-up">{m.content}</div>
            ) : (
              <div key={i} className="flex max-w-[92%] gap-3 fade-up">
                <Monogram className="h-8 w-8 shrink-0 text-xs" />
                <div className="min-w-0 pt-1">
                  {m.content ? <Markdown>{m.content}</Markdown> : <span className="text-sm text-muted-foreground animate-pulse">Thinking…</span>}
                  {m.content && !(loading && i === messages.length - 1) && <ReportButton />}
                </div>
              </div>
            ),
          )}
          <div ref={end} />
        </div>
        <form
          className="flex items-end gap-2 border-t p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Textarea
            ref={ref}
            autoFocus
            value={input}
            maxLength={4000}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Type a message… (no personal ID or bank details)"
            className="max-h-40 min-h-11 resize-none"
          />
          <Button type="submit" variant="gold" size="icon" disabled={loading || !input.trim()} aria-label="Send">
            <ArrowUp />
          </Button>
        </form>
      </div>
    </>
  );
}
