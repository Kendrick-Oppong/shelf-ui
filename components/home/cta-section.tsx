import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaSection() {
  return (
    <Reveal>
      <section className="relative overflow-hidden border-border border-t px-8 py-32 text-center">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_srgb,var(--color-primary)_7%,transparent)_0%,transparent_70%)]"
        />

        <div className="relative z-10">
          <Badge
            className="gap-2 rounded-full border-primary/18 bg-primary/6 px-4 py-1.5 text-[11.5px] text-primary uppercase tracking-wider hover:bg-primary/6"
            variant="outline"
          >
            Free · Open Source · MIT License
          </Badge>

          <h2 className="mx-auto mt-8 mb-4 max-w-xl font-bold text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.04em]">
            Start building in
            <br />
            <span className="text-primary">60 seconds.</span>
          </h2>

          <p className="mb-10 font-light text-[15px] text-muted-foreground">
            Add your first component. No config, no wrappers, no surprises.
            <br />
            <span className="text-[13px]">
              CSS transitions by default. Motion when you want it.
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="h-auto rounded-xl px-7 py-3 text-sm hover:-translate-y-0.5 hover:brightness-110"
            >
              <Link href="/docs">Read the Docs</Link>
            </Button>
            <Button
              asChild
              className="h-auto rounded-xl px-7 py-3 text-sm hover:-translate-y-0.5"
              variant="outline"
            >
              <Link href="/docs/components">Browse Components</Link>
            </Button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
