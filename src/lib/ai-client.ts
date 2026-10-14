import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Feature } from "./prompts";
import { logActivity } from "./activity";

export type AIRequest = {
  feature: Feature;
  variant?: "original" | "refined" | undefined;
  input?: string;
  messages?: undefined | { role: "user" | "assistant"; content: string }[];
};

export async function streamAI(req: AIRequest, onText: (full: string) => void, signal?: AbortSignal | null) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal: signal ?? null,
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += dec.decode(value, { stream: true });
    onText(full);
  }
  if (!full.trim()) throw new Error("The AI returned an empty answer. Please try again.");
  return full;
}

export function useAI(feature: Feature, label: string) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const run = useCallback(
    async (input: string, variant?: "original" | "refined") => {
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      setLoading(true);
      setOutput("");
      try {
        const full = await streamAI({ feature, input, variant }, setOutput, ctrl.signal);
        logActivity(feature, label);
        return full;
      } catch (e) {
        if ((e as Error).name !== "AbortError") toast.error((e as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [feature, label],
  );

  return { output, setOutput, loading, run };
}
