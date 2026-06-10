import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { GITHUB_REPO_URL } from "@/lib/constants";

export function baseOptions(): BaseLayoutProps {
  return {
    slots: {
      themeSwitch: ModeToggle,
    },
    // Navigation configuration
    nav: {
      title: "Shelf UI",

      transparentMode: "always",
    },

    // GitHub integration
    githubUrl: GITHUB_REPO_URL,

    // Links in navigation
    links: [
      {
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Components",
        url: "/docs/components",
      },
      {
        text: "Adapters",
        url: "/docs/adapters",
      },
      {
        text: "Changelog",
        url: "/docs/changelog",
      },
    ],
  };
}
