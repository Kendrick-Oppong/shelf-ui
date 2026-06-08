import { Reveal } from "./reveal";

const PRIMITIVES = [
  {
    pill: "Default",
    accentPill: true,
    title: "Radix UI",
    body: "Battle-tested primitives with the largest ecosystem. Most developers already know it — zero learning curve.",
    items: [
      "WAI-ARIA compliant out of the box",
      "Largest community and ecosystem",
      "Extensive documentation",
    ],
  },
  {
    pill: "Alternative",
    accentPill: false,
    title: "Base UI",
    body: "The next generation from the MUI team. Smaller footprint, first-class CSS transitions, actively growing.",
    items: [
      "Smaller bundle footprint",
      "First-class CSS transitions",
      "Long-term MUI commitment",
    ],
  },
  {
    pill: "Same API",
    accentPill: true,
    title: "You switch anytime.",
    body: "Both primitives expose an identical component interface. Same props, same import paths. The registry serves the correct version.",
    items: [
      "Same props, same import path",
      "Registry serves correct version",
      "Zero migration cost to switch",
    ],
  },
] as const;

export function PrimitivesSection() {
  return (
    <Reveal className="px-8 pb-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Primitive Support</span>
        </div>
        <h2 className="mb-12 font-bold text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em]">
          You choose the foundation.
        </h2>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {PRIMITIVES.map(({ pill, accentPill, title, body, items }) => (
            <div
              className="bg-card p-8 transition-colors hover:bg-card-hover"
              key={title}
            >
              <div
                className={`mb-5 inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-semibold text-[11px] tracking-[0.02em] ${accentPill ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`size-1.5 rounded-full ${accentPill ? "bg-primary" : "bg-muted-foreground"}`}
                />
                {pill}
              </div>
              <p className="mb-3 font-bold text-[17px] text-foreground tracking-[-0.02em]">
                {title}
              </p>
              <p className="mb-6 font-light text-[13px] text-muted-foreground leading-[1.7]">
                {body}
              </p>
              <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <li
                    className="flex items-center gap-2 text-[12px] text-muted-foreground"
                    key={item}
                  >
                    <div className="size-0.75 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
