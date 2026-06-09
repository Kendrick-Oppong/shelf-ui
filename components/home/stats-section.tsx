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
      <div className="overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-5">
          {STATS.map(({ value, suffix, label }, index) => (
            <div
              className={`flex flex-col items-center justify-center p-6 ${index === STATS.length - 1 ? "col-span-2 sm:col-span-1" : ""}
              `}
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
