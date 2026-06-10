import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      {/* Radial glow — mirrors hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--color-primary)_8%,transparent)_0%,transparent_65%)]"
      />

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="mask-[radial-gradient(ellipse_60%_55%_at_50%_50%,black_0%,transparent_100%)] pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--color-foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-foreground)_2%,transparent)_1px,transparent_1px)] bg-size-[72px_72px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 404 numeral */}
        <p className="font-bold text-[clamp(5rem,20vw,10rem)] text-transparent leading-none [&]:[-webkit-text-stroke:1.5px_var(--hero-stroke)]">
          404
        </p>

        {/* Heading */}
        <h1 className="max-w-sm font-bold text-2xl tracking-tight sm:text-3xl">
          We couldn&apos;t find that page
        </h1>

        {/* Sub-text */}
        <p className="max-w-xs text-balance text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            className="h-auto rounded-xl px-7 py-3 text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:brightness-110"
          >
            <Link href="/">Return Home</Link>
          </Button>
          <Button
            asChild
            className="h-auto rounded-xl border border-foreground/20! px-7 py-3 text-sm hover:-translate-y-0.5"
            variant="outline"
          >
            <Link href="/docs">Browse Docs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
