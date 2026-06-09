import { Activity, Copy, ShieldCheck, Terminal, Zap } from "lucide-react";
import { Reveal } from "./reveal";

const FEATURES = [
  {
    num: "01",
    Icon: Copy,
    title: "You own every line.",
    body: "No package lock-in. Components land directly in your codebase via the shadcn registry. Extend, restyle, delete — zero library abstraction in the way.",
    code: "npx shadcn@latest add @shelf-ui/dropzone",
  },
  {
    num: "02",
    Icon: ShieldCheck,
    title: "Registry native.",
    body: "Built on the open shadcn registry spec. One command installs any component with all peer dependencies resolved.",
  },
  {
    num: "03",
    Icon: Activity,
    title: "Headless hooks included.",
    body: "Every component ships with its underlying hook. Swap the UI for your own — the logic stays.",
  },
  {
    num: "04",
    Icon: Zap,
    title: "Radix UI or Base UI.",
    body: "Pick your primitive at install time. Identical component API regardless — only internals differ. Switch with zero migration cost.",
  },
  {
    num: "05",
    Icon: Terminal,
    title: "Tailwind v4 + TypeScript.",
    body: "Fully typed. CSS variables. Dark mode out of the box. No config files, no wrappers.",
  },
  {
    num: "06",
    Icon: Zap,
    title: "Animation-free by default.",
    body: "No Motion/Framer Motion forced on you. CSS transitions ship by default. Add the --motion flag only when you want it.",
    code: "npx shadcn@latest add @shelf-ui/dropzone --motion",
  },
];

function FeatureCard({
  feature,
  className,
}: Readonly<{
  feature: (typeof FEATURES)[0];
  className?: string;
}>) {
  const { num, Icon, title, body, code } = feature;
  return (
    <div
      className={`bg-card p-5 transition-colors hover:bg-card-hover ${className ?? ""}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span className="font-bold text-[11px] text-primary/50 uppercase tracking-[0.15em]">
          {num}
        </span>
        <div className="flex size-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/8">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
      <h3 className="mb-3 font-bold text-[1.1rem] text-foreground tracking-[-0.02em]">
        {title}
      </h3>
      <p className="font-light text-[12.5px] text-muted-foreground leading-[1.7]">
        {body}
      </p>
      {code && (
        <code className="mt-5 inline-block rounded-lg border border-border bg-accent px-3 py-1.5 font-mono text-[11.5px] text-primary">
          {code}
        </code>
      )}
    </div>
  );
}

export function FeaturesBento() {
  const [first, second, ...rest] = FEATURES;

  return (
    <Reveal className="py-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Why Shelf UI</span>
        </div>

        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-bold text-[clamp(1.9rem,8vw,3.2rem)] leading-[1.08] tracking-[-0.035em]">
            Built different.
            <br />
            <span className="text-muted-foreground/60">
              Because files deserve it.
            </span>
          </h2>

          <p className="max-w-sm font-light text-[13.5px] text-muted-foreground leading-[1.8]">
            No other library treats file management as a complete UI domain.
            Shelf UI does — from the drop zone to the storage adapter.
          </p>
        </div>

        {/* Mobile + Tablet */}
        <div className="overflow-hidden rounded-2xl border border-border bg-border lg:hidden">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <FeatureCard feature={feature} key={feature.num} />
            ))}
          </div>
        </div>

        {/* Desktop Bento */}
        <div className="hidden lg:block">
          {/* First row */}
          <div className="mb-px grid grid-cols-3 gap-px overflow-hidden rounded-t-2xl border border-border bg-border">
            <FeatureCard className="col-span-2" feature={first} />
            <FeatureCard className="col-span-1" feature={second} />
          </div>

          {/* Second row */}
          <div className="mb-px grid grid-cols-3 gap-px overflow-hidden border border-border border-t-0 bg-border">
            {rest.slice(0, 3).map((feature) => (
              <FeatureCard feature={feature} key={feature.num} />
            ))}
          </div>

          {/* Third row */}
          <div className="overflow-hidden rounded-b-2xl border border-border border-t-0">
            <FeatureCard feature={rest[3]} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
