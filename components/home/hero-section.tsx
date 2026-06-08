"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "./hero-preview";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
});

function BadgePulse() {
  return (
    <motion.span
      animate={{
        boxShadow: [
          "0 0 0 0 color-mix(in srgb, var(--color-primary) 50%, transparent)",
          "0 0 0 6px transparent",
          "0 0 0 0 color-mix(in srgb, var(--color-primary) 50%, transparent)",
        ],
      }}
      className="inline-block size-1.5 shrink-0 rounded-full bg-primary"
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pt-32 pb-24 text-center">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30%] left-1/2 h-125 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--color-primary)_9%,transparent)_0%,transparent_65%)]"
      />

      {/* Grid lines */}
      <div
        aria-hidden
        className="mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black_0%,transparent_100%)] pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--color-foreground)_2.5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-foreground)_2.5%,transparent)_1px,transparent_1px)] bg-size-[60px_60px]"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div {...fadeUp(0)}>
          <Badge
            className="gap-2 rounded-full border-primary/18 bg-primary/6 px-4 py-1.5 text-[11.5px] text-primary uppercase tracking-wider hover:bg-primary/6"
            variant="outline"
          >
            <BadgePulse />
            Shadcn Registry · Open Source · MIT
          </Badge>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-8 mb-7 max-w-225 font-bold text-[clamp(3rem,7vw,5.8rem)] leading-[1.02] tracking-[-0.04em]"
        >
          Every file UI component
          <br />
          <span className="text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]">
            {"your app will ever "}
          </span>
          <span className="text-primary">need.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mb-12 max-w-130 font-light text-[1.05rem] text-muted-foreground leading-[1.8]"
        >
          Copy-paste components for the complete file experience. Upload,
          preview, manage, navigate — with first-class Supabase, S3 and
          Cloudinary support. Zero config.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mb-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            className="h-auto rounded-xl px-7 py-3 text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] hover:brightness-110"
          >
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button
            asChild
            className="h-auto rounded-xl px-7 py-3 text-sm hover:-translate-y-0.5"
            variant="outline"
          >
            <Link href="/docs/components">Browse Components</Link>
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp(0.4)}
          className="inline-flex items-center gap-2.5 rounded-[10px] border border-border bg-secondary px-4 py-2.5 text-[12.5px] text-muted-foreground"
        >
          <span className="text-[11px] text-muted-foreground/60">▸</span>
          <code className="font-mono text-[12px] text-primary tracking-[0.02em]">
            npx shadcn@latest add @shelf-ui/dropzone
          </code>
          <span className="text-border-strong text-xs">·</span>
          <span className="cursor-pointer text-[11px] transition-colors hover:text-foreground">
            Copy
          </span>
        </motion.div>

        <motion.div
          {...fadeUp(0.5)}
          className="mt-20 flex w-full max-w-7xl justify-center"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
