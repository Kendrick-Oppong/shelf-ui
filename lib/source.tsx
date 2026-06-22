import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: ({ typedPlugin }) => [
    lucideIconsPlugin(),
    typedPlugin({
      transformPageTree: {
        file(node, file) {
          if (!file) {
            return node;
          }

          const fileData = this.storage.read(file);

          if (fileData && "data" in fileData && "badge" in fileData.data) {
            const badgeText = fileData.data.badge;

            // add badge to tree
            if (typeof badgeText === "string") {
              node.name = (
                <span
                  className="flex w-full items-center justify-between gap-2"
                  key="name"
                >
                  <span>{node.name}</span>
                  <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-[10px] text-primary uppercase tracking-wider">
                    {badgeText}
                  </span>
                </span>
              );
            }
          }

          return node;
        },
      },
    }),
  ],
});
export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}
