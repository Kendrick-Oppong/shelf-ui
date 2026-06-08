import { Reveal } from "./reveal";

const STATS = [
  { value: "24", suffix: "+", label: "Components" },
  { value: "5", suffix: "", label: "Headless Hooks" },
  { value: "3", suffix: "", label: "Storage Adapters" },
  { value: "2", suffix: "", label: "Primitive Layers" },
  { value: "0", suffix: "", label: "Config Required" },
] as const;

export function StatsSection() {
  return (
    <Reveal>
      <div className="border-border border-y bg-card">
        <div className="container-shelf flex items-center justify-center">
          {STATS.map(({ value, suffix, label }) => (
            <div
              className="flex flex-1 flex-col items-center border-border not-last:border-r px-14 py-8"
              key={label}
            >
              <p className="font-bold text-[2.2rem] text-foreground tracking-[-0.04em]">
                {value}
                {suffix && <span className="text-primary">{suffix}</span>}
              </p>
              <p className="mt-1 text-center font-medium text-[11px] text-muted-foreground uppercase tracking-[0.04em]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
