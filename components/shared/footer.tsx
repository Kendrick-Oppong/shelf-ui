"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FOOTER_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Kendrick-Oppong/shelf-ui",
    isExternal: true,
  },
  { label: "Docs", href: "/docs", isExternal: false },
  {
    label: "Components",
    href: "/docs/components",
    isExternal: false,
  },
  { label: "Changelog", href: "/changelog", isExternal: false },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kendrick-oppong",
    isExternal: true,
  },
] as const;
export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-border border-t px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-light text-[12.5px] text-muted-foreground">
          Built by{" "}
          <strong className="font-semibold text-primary">Kendrick</strong>
        </p>
        <p className="font-light text-[12.5px] text-muted-foreground">
          &copy; {year} ShelfUI. All rights reserved.
        </p>

        <nav className="mt-4 flex flex-wrap gap-3 sm:mt-0 sm:gap-5">
          {FOOTER_LINKS.map(({ label, href, isExternal }) => (
            <Link
              className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              href={href}
              key={label}
              rel={isExternal ? "noopener noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
