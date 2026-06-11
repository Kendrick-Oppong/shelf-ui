/**
 * Application constants
 */

export const GITHUB_REPO_URL = "https://github.com/Kendrick-Oppong/shelf-ui";
export const GITHUB_OWNER = "Kendrick-Oppong";
export const GITHUB_REPO_NAME = "shelf-ui";
export const LINKEDIN_URL = "https://www.linkedin.com/in/kendrick-oppong";
export const APP_NAME = "Shelf UI";
export const APP_URL = "https://shelfui.dev";

export const JSON_LD_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Shelf UI",
  description:
    "Copy-paste file UI components for React. Upload, preview, manage, navigate.",
  url: APP_URL,
  programmingLanguage: ["TypeScript", "React", "CSS"],
  codeRepository: GITHUB_REPO_URL,
  author: {
    "@type": "Person",
    name: "Kendrick Oppong",
    url: "https://x.com/kendrickoppong",
  },
} as const;
