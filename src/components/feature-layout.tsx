import type { ReactNode } from "react";

export function TwoCol({ form, output }: { form: ReactNode; output: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="h-fit rounded-lg border bg-card p-5">{form}</div>
      <div>{output}</div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function PrivacyNote() {
  return <p className="text-xs text-muted-foreground">Don't include ID numbers, bank details or other sensitive data. Nothing is stored.</p>;
}
