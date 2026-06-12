import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

const withMDX = createMDX({
  // customize the config file path
  // configPath: "source.config.ts"
});

export default withMDX(config);
