import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: pageSchema.extend({
      badge: pageSchema.shape.title.optional(),
    }),
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark-high-contrast",
      },
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? [])],
    },
  },
});
