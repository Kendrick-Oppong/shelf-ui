import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Adapters", href: "/docs/adapters" },
  { label: "Changelog", href: "/changelog" },
] as const;

export function Header() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center pt-5">
      <div className="relative inline-flex items-center">
        {/* Curved bracket SVG extending left and right */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-[60px] h-[44px] w-[60px] overflow-visible"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 60 44"
        >
          <path
            className="opacity-50"
            d="M60 22 C40 22 30 44 0 44"
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
        </svg>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -right-[60px] h-[44px] w-[60px] overflow-visible"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 60 44"
        >
          <path
            className="opacity-50"
            d="M0 22 C20 22 30 44 60 44"
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
        </svg>

        {/* Horizontal lines extending further */}
        <div className="absolute top-1/2 -left-65 h-px w-full -translate-y-1/2 bg-linear-to-r from-transparent to-border" />
        <div className="absolute top-1/2 -right-65 h-px w-full -translate-y-1/2 bg-linear-to-l from-transparent to-border" />

        <nav className="relative z-10 flex h-11 items-center gap-0 rounded-full border border-border-strong bg-card/85 px-1.5 backdrop-blur-[20px]">
          {/* Logo */}
          <Link
            className="mr-1 flex h-full items-center gap-2 border-border border-r py-0 pr-3.5 pl-2.5 font-bold text-[14px] text-foreground tracking-[-0.01em] no-underline"
            href="/"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-primary to-primary/60">
              <svg
                aria-hidden="true"
                className="size-3.25 fill-none stroke-[2.5px] stroke-background"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </div>
            Shelf UI
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-0.5 px-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 font-medium text-[13px] text-muted-foreground no-underline transition-all hover:border-border hover:bg-white/5 hover:text-foreground"
                href={href}
                key={label}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mx-1.5 h-5 w-px bg-border" />

          {/* Right section */}
          <div className="flex items-center gap-1.5 pl-1">
            <Link
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-transparent px-3 py-1.5 font-sans text-[12px] text-muted-foreground no-underline transition-all hover:border-border-2 hover:text-foreground"
              href="https://github.com/Kendrick-Oppong/shelf-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-3.25 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </Link>
            <div className="mx-0.5 h-5 w-px bg-border/60" />
            <ModeToggle />
            <Link
              className="whitespace-nowrap rounded-full bg-primary px-4 py-1.75 font-bold font-sans text-[12.5px] text-primary-foreground tracking-[0.01em] no-underline transition-all hover:brightness-110"
              href="/docs"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
