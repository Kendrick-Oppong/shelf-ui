import { Activity, Copy, ShieldCheck, Sun, Terminal } from "lucide-react";
import { Reveal } from "./reveal";

const CELLS = [
  {
    span: "col-span-3",
    Icon: Copy,
    title: "Copy-paste. You own it.",
    body: "No package lock-in. Components land directly in your codebase. Extend, restyle, delete — no library abstraction in the way.",
    code: "npx shadcn@latest add @shelf-ui/dropzone",
  },
  {
    span: "col-span-3",
    Icon: ShieldCheck,
    title: "Shadcn registry native",
    body: "Built on the open shadcn registry spec. Install any component with a single CLI command. Peer dependencies resolved automatically.",
    code: null,
  },
  {
    span: "col-span-2",
    Icon: Sun,
    title: "Radix UI or Base UI",
    body: "Pick your primitive at init. Identical component API — only internals differ.",
    code: null,
  },
  {
    span: "col-span-2",
    Icon: Activity,
    title: "Headless hooks",
    body: "Every component ships with its underlying hook. Go headless anytime.",
    code: null,
  },
  {
    span: "col-span-2",
    Icon: Terminal,
    title: "Tailwind v4 + TypeScript",
    body: "Fully typed. CSS variables. Dark mode out of the box.",
    code: null,
  },
] as const;

export function FeaturesBento() {
  return (
    <Reveal className="px-8 py-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Why Shelf UI</span>
        </div>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-bold text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em]">
            Built different.
            <br />
            Because files deserve it.
          </h2>
          <p className="max-w-95 font-light text-[13.5px] text-muted-foreground leading-[1.75]">
            No other library treats file management as a complete UI domain.
            Shelf UI does.
          </p>
        </div>

        <div className="grid grid-cols-6 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {CELLS.map(({ span, Icon, title, body, code }) => (
            <div
              className={`${span} bg-card p-8 transition-colors hover:bg-card-hover`}
              key={title}
            >
              <div className="mb-5 flex size-9.5 items-center justify-center rounded-[9px] border border-primary/12 bg-primary/7">
                <Icon className="size-4.25 text-primary" />
              </div>
              <div className="mb-2 font-semibold text-foreground text-sm">
                {title}
              </div>
              <div className="font-light text-[12.5px] text-muted-foreground leading-[1.65]">
                {body}
              </div>
              {code && (
                <code className="mt-2.5 inline-block rounded-md border border-border bg-accent px-2.5 py-1 font-mono text-[11px] text-primary">
                  {code}
                </code>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
