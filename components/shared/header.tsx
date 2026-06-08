"use client";

import { Menu, MoveUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/shared/mode-toggle";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Adapters", href: "/docs/adapters" },
  { label: "Changelog", href: "/changelog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
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
          <Link
            className="flex items-center gap-2.5 font-bold text-[14px] text-foreground tracking-[-0.01em] no-underline"
            href="/"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-primary to-primary/60">
              <svg
                aria-hidden="true"
                className="size-3.5 fill-none stroke-[2.5px] stroke-background"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </div>
            Shelf UI
          </Link>

          {/* Center nav — desktop only */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
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
              href="https://github.com/Kendrick-Oppong/shelf-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-3.5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
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
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
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
            id="mobile-nav"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background pt-15 md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Nav links */}
            <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-5">
              {NAV_LINKS.map(({ label, href }, i) => (
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
                href="https://github.com/Kendrick-Oppong/shelf-ui"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="size-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
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
