<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS

- All AI calls go through the single server route `src/routes/api/ai.ts`, keyed by feature; system prompts live in `src/lib/prompts.ts` so the Prompt Lab can display them.
- No database: only a non-sensitive activity log (feature, label, time) is kept in localStorage, per the privacy requirement.
