import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const ROWS = [
  {
    feature: "WAI-ARIA compliance",
    radix: true,
    base: true,
  },
  {
    feature: "Shelf UI component API",
    radix: true,
    base: true,
  },
  {
    feature: "shadcn/ui support",
    radix: true,
    base: true,
  },
  {
    feature: "Composition pattern",
    radix: "asChild",
    base: "render prop",
  },
  {
    feature: "Package structure",
    radix: "per-component",
    base: "single pkg",
  },
  {
    feature: "Active maintenance",
    radix: "slowing",
    base: "full-time",
  },
  {
    feature: "Migration cost",
    radix: "—",
    base: "zero",
  },
] as const;

const CSS_FEATURES = [
  "No extra dependency",
  "Zero bundle cost",
  "Works without JS",
] as const;

const MOTION_FEATURES = [
  "Spring physics & gestures",
  "Drag, reorder, layout animate",
  "~30kb gzipped added",
] as const;

type CellVal = boolean | string;

function Cell({ val }: Readonly<{ val: CellVal }>) {
  if (val === true) {
    return <Check className="mx-auto size-4 text-primary" />;
  }
  if (val === false) {
    return <Minus className="mx-auto size-4 text-muted-foreground/25" />;
  }
  // Highlight "zero" and "full-time" in primary, dim cautionary strings
  const isPositive =
    val === "zero" ||
    val === "full-time" ||
    val === "render prop" ||
    val === "single pkg" ||
    val.startsWith("v1");
  const isWarning = val === "slowing" || val === "per-component";

  return (
    <span
      className={cn(
        "font-mono text-[11px]",
        isPositive && "text-primary",
        isWarning && "text-destructive/70",
        !(isPositive || isWarning) && "text-muted-foreground"
      )}
    >
      {val}
    </span>
  );
}
export function PrimitivesSection() {
  return (
    <Reveal className="pb-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Primitive Support</span>
        </div>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-bold text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[1.08] tracking-[-0.035em]">
            You choose the foundation.
            <br />
            <span className="text-muted-foreground/60">We support both.</span>
          </h2>

          <p className="max-w-sm font-light text-[13.5px] text-muted-foreground leading-[1.8]">
            Radix UI or Base UI — identical component API regardless. The
            registry serves the correct version for your choice.
          </p>
        </div>
        {/* ================= TABLE ================= */}
        <div className="overflow-hidden rounded-2xl border border-border">
          {/* ── DESKTOP (md+): original 3-col grid ── */}
          <div className="hidden md:block">
            {/* Header */}
            <div className="grid grid-cols-[1fr_140px_140px] divide-x divide-border border-border border-b bg-accent">
              <div className="px-5 py-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
                Feature
              </div>
              <div className="px-6 py-4 text-center">
                <div className="font-bold text-[13px] text-foreground">
                  Radix UI
                </div>
                <div className="mt-0.5 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 font-semibold text-[9px] text-primary uppercase tracking-wider">
                  Default
                </div>
              </div>
              <div className="px-6 py-4 text-center">
                <div className="font-bold text-[13px] text-foreground">
                  Base UI
                </div>
                <div className="mt-0.5 inline-flex items-center rounded-full border border-border px-2 py-0.5 font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
                  Alternative
                </div>
              </div>
            </div>
            {/* Rows */}
            <div className="divide-y divide-border">
              {ROWS.map((row) => (
                <div
                  className="grid grid-cols-[1fr_140px_140px] divide-x divide-border transition-colors hover:bg-card-hover"
                  key={row.feature}
                >
                  <div className="flex items-center px-5 py-4 font-medium text-[13px] text-foreground">
                    {row.feature}
                  </div>
                  <div className="flex items-center justify-center px-6 py-4">
                    <Cell val={row.radix} />
                  </div>
                  <div className="flex items-center justify-center px-6 py-4">
                    <Cell val={row.base} />
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="grid grid-cols-[1fr_140px_140px] divide-x divide-border border-border border-t bg-primary/4">
              <div className="flex items-center px-6 py-5">
                <span className="font-semibold text-[13px] text-primary">
                  Switch at any time — zero migration cost.
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-center px-6 py-5">
                <code className="font-mono text-[11px] text-primary">
                  shelf init --primitive=base-ui
                </code>
              </div>
            </div>
          </div>

          {/* ── MOBILE (<md): card-per-row layout ── */}
          <div className="md:hidden">
            {/* Column labels — sticky reference header */}
            <div className="grid grid-cols-2 border-border border-b bg-accent">
              <div className="border-border border-r px-4 py-3 text-center">
                <div className="font-bold text-[13px] text-foreground">
                  Radix UI
                </div>
                <div className="mt-0.5 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 font-semibold text-[9px] text-primary uppercase tracking-wider">
                  Default
                </div>
              </div>
              <div className="px-4 py-3 text-center">
                <div className="font-bold text-[13px] text-foreground">
                  Base UI
                </div>
                <div className="mt-0.5 inline-flex items-center rounded-full border border-border px-2 py-0.5 font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
                  Alternative
                </div>
              </div>
            </div>
            {/* Cards */}
            <div className="divide-y divide-border">
              {ROWS.map((row) => (
                <div
                  className="transition-colors hover:bg-card-hover"
                  key={row.feature}
                >
                  {/* Feature label spans full width */}
                  <div className="border-border/50 border-b px-4 py-2.5 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
                    {row.feature}
                  </div>
                  {/* Values side by side */}
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="flex items-center justify-center px-4 py-3">
                      <Cell val={row.radix} />
                    </div>
                    <div className="flex items-center justify-center px-4 py-3">
                      <Cell val={row.base} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="space-y-1.5 border-border border-t bg-primary/4 px-4 py-4 text-center">
              <p className="font-semibold text-[13px] text-primary">
                Switch at any time — zero migration cost.
              </p>
              <code className="font-mono text-[11px] text-primary">
                shelf init --primitive=base-ui
              </code>
            </div>
          </div>
        </div>

        {/* ================= ANIMATION SECTION ================= */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="border-border border-b bg-accent px-5 py-4">
            <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
              Animation layer — your choice
            </span>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {/* CSS */}
            <div className="bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-[13px] text-foreground">
                  CSS Transitions
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 font-semibold text-[9px] text-primary uppercase tracking-wider">
                  Default
                </span>
              </div>

              <p className="mb-5 font-light text-[12.5px] text-muted-foreground leading-[1.7]">
                Zero runtime overhead. All animations run purely via CSS — no JS
                bundle cost, no hydration delay, no forced dependency.
              </p>

              <ul className="mb-5 flex flex-col gap-1.5">
                {CSS_FEATURES.map((item) => (
                  <li
                    className="flex items-center gap-2 text-[12px] text-muted-foreground"
                    key={item}
                  >
                    <Check className="size-3.5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <code className="inline-block rounded-lg border border-primary/20 bg-primary/6 px-3 py-1.5 font-mono text-[11px] text-primary">
                npx shadcn@latest add @shelf-ui/dropzone
              </code>
            </div>

            {/* Motion */}
            <div className="bg-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-[13px] text-foreground">
                  Motion
                </span>
                <span className="rounded-full border border-border px-2.5 py-0.5 font-semibold text-[9px] text-muted-foreground uppercase tracking-wider">
                  --motion flag
                </span>
              </div>

              <p className="mb-5 font-light text-[12.5px] text-muted-foreground leading-[1.7]">
                Opt into Motion (formerly Framer Motion) for physics-based
                springs, drag interactions, and advanced entrance animations.
              </p>

              <ul className="mb-5 flex flex-col gap-1.5">
                {MOTION_FEATURES.map((item) => (
                  <li
                    className="flex items-center gap-2 text-[12px] text-muted-foreground"
                    key={item}
                  >
                    <Check className="size-3.5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <code className="inline-block rounded-lg border border-primary/20 bg-primary/6 px-3 py-1.5 font-mono text-[11px] text-primary">
                npx shadcn@latest add @shelf-ui/dropzone --motion
              </code>
            </div>
          </div>

          <div className="border-border border-t bg-primary/4 px-6 py-4 text-center">
            <p className="font-light text-[12.5px] text-muted-foreground">
              Same component API. Same props. The animation layer is an
              implementation detail —{" "}
              <span className="ml-1 font-semibold text-primary">
                switch without touching your code.
              </span>
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
