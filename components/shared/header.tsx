"use client";

import { Menu, MoveUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GitHubMark, ShelfLogo } from "@/components/shared/header-primitives";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { GITHUB_REPO_URL } from "@/lib/constants";

const SHELF_NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Adapters", href: "/docs/adapters" },
  { label: "Changelog", href: "/changelog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50">
        {/* Main bar */}
        <nav className="flex h-14 items-center justify-between bg-background/80 px-5 backdrop-blur-xl">
          {/* Logo */}
          <ShelfLogo />

          {/* Center nav — desktop only */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
            {SHELF_NAV_LINKS.map(({ label, href }) => (
              <Link
                className="whitespace-nowrap rounded-full border border-transparent px-3.5 py-1.5 font-medium text-[13px] text-muted-foreground no-underline transition-all hover:border-border hover:text-foreground"
                href={href}
                key={label}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Desktop-only actions */}
            <Link
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-transparent px-3 py-1.5 font-medium text-[12px] text-muted-foreground no-underline transition-all hover:border-border-strong hover:text-foreground md:flex"
              href={GITHUB_REPO_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubMark />
              GitHub
            </Link>
            <ModeToggle />
            <Link
              className="hidden whitespace-nowrap rounded-full bg-primary px-4 py-1.5 font-semibold text-[12.5px] text-primary-foreground tracking-[0.01em] no-underline transition-all hover:brightness-110 md:block"
              href="/docs"
            >
              Get Started
            </Link>

            {/* Hamburger — mobile only */}
            <button
              aria-controls="mobile-nav"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground md:hidden"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              <AnimatePresence initial={false} mode="wait">
                {open ? (
                  <motion.span
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    initial={{ opacity: 0, rotate: 45 }}
                    key="close"
                    transition={{ duration: 0.15 }}
                  >
                    <X className="size-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    initial={{ opacity: 0, rotate: -45 }}
                    key="open"
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Glowing bottom border */}
        <div className="relative h-px w-full">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-border-strong to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
          <div
            aria-hidden
            className="absolute top-0 left-1/2 h-24 w-96 -translate-x-1/2 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at top, var(--color-primary) 0%, transparent 70%)",
            }}
          />
        </div>
      </header>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background pt-15 md:hidden"
            exit={{ opacity: 0 }}
            id="mobile-nav"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Nav links */}
            <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-5">
              {SHELF_NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                  initial={{ opacity: 0, y: 16 }}
                  key={label}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    className="flex w-full items-center justify-between rounded-2xl border border-transparent p-3 font-semibold text-base tracking-[-0.02em] no-underline transition-all hover:border-border hover:bg-card"
                    href={href}
                  >
                    {label}
                    <span className="text-[12px] text-muted-foreground/80">
                      <MoveUpRight size={18} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom actions */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 border-border border-t p-5"
              initial={{ opacity: 0, y: 12 }}
              transition={{
                delay: 0.3,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-transparent py-3 font-medium text-[14px] text-muted-foreground no-underline transition-all hover:border-border-strong hover:text-foreground"
                href={GITHUB_REPO_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHubMark className="size-4" />
                Star on GitHub
              </Link>
              <Link
                className="flex items-center justify-center rounded-2xl bg-primary py-3 font-semibold text-[14px] text-primary-foreground tracking-[0.01em] no-underline transition-all hover:brightness-110"
                href="/docs"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
