"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground transition-all hover:border-border-strong hover:bg-card-hover hover:text-foreground"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
    >
      <Sun className="size-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
