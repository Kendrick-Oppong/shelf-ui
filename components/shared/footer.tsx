import Link from "next/link";

const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com/Kendrick-Oppong/shelf-ui" },
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Changelog", href: "/changelog" },
  { label: "Twitter", href: "https://twitter.com/kendrickoppong" },
] as const;

export function Footer() {
  return (
    <footer className="border-border border-t px-8 py-10">
      <div className="container-shelf flex flex-wrap items-center justify-between gap-4">
        <p className="font-light text-[12.5px] text-muted-foreground">
          Built by{" "}
          <strong className="font-semibold text-foreground">
            Kendrick Oppong
          </strong>{" "}
          · MIT License
        </p>
        <nav className="flex gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              href={href}
              key={label}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
