import mark from "@/assets/ntethe-mark.png.asset.json";
import { cn } from "@/lib/utils";

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <img
      src={mark.url}
      alt="Ntethe"
      width={600}
      height={600}
      className={cn("h-10 w-10 shrink-0", className)}
    />
  );
}

export function BrushDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 14" preserveAspectRatio="none" className={`h-3 w-full text-gold ${className}`} aria-hidden>
      <path
        d="M2 8 C 60 2, 120 12, 190 6 S 320 3, 398 7 L 396 10 C 300 12, 220 9, 150 11 S 40 13, 4 11 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function PageHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-8 fade-up">
      <p className="font-script text-xl text-gold">{eyebrow}</p>
      <h1 className="mt-1 text-4xl md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{desc}</p>
      <BrushDivider className="mt-5 max-w-xs" />
    </div>
  );
}
