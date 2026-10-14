import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { PROMPTS, type Feature } from "@/lib/prompts";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "@/server/run-id";

type Body = {
  feature: Feature;
  variant?: "original" | "refined";
  input?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
};

const MAX_CHARS = 12000;

function json(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });
}

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return json(500, "AI is not configured yet.");

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return json(400, "Invalid request.");
        }
        const prompt = PROMPTS[body.feature];
        if (!prompt) return json(400, "Unknown feature.");

        let messages: ModelMessage[];
        if (body.feature === "chat") {
          const msgs = (body.messages ?? []).filter((m) => m.content?.trim()).slice(-30);
          if (!msgs.length) return json(400, "Please type a message.");
          if (msgs.reduce((n, m) => n + m.content.length, 0) > MAX_CHARS * 3)
            return json(400, "Conversation is too long. Start a new chat.");
          messages = msgs.map((m) => ({ role: m.role, content: m.content }));
        } else {
          const input = body.input?.trim() ?? "";
          if (input.length < 3) return json(400, "Please add a bit more detail.");
          if (input.length > MAX_CHARS) return json(400, "That's too long — please shorten your input.");
          messages = [{ role: "user", content: input }];
        }

        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        let upstreamError: { status: number; message: string } | null = null;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions: body.variant === "original" ? prompt.original : prompt.refined,
          messages,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => {
            const e = error as { statusCode?: number; message?: string };
            upstreamError = { status: e.statusCode ?? 500, message: e.message ?? "AI error" };
            console.error("AI error", e.statusCode, e.message);
          },
        });

        // Read the first text chunk so we can return a proper status on immediate failures.
        const reader = result.textStream[Symbol.asyncIterator]();
        let first: IteratorResult<string>;
        try {
          first = await reader.next();
        } catch {
          first = { done: true, value: undefined };
        }
        if (first.done && upstreamError) {
          const { status } = upstreamError as { status: number };
          const msg =
            status === 429
              ? "Too many requests right now — please wait a moment and try again."
              : status === 402
                ? "AI credits have run out. Please top up in your workspace to continue."
                : status === 403
                  ? "AI access is currently blocked for this workspace."
                  : "The AI couldn't respond. Please try again.";
          return json(status, msg);
        }

        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              if (!first.done) controller.enqueue(enc.encode(first.value));
              while (true) {
                const next = await reader.next();
                if (next.done) break;
                controller.enqueue(enc.encode(next.value));
              }
            } catch {
              /* aborted */
            }
            controller.close();
          },
        });
        const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });
        const runId = runIdFetch.getRunId();
        if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
        return new Response(stream, { headers });
      },
    },
  },
});
