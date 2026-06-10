import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
// biome-ignore lint/performance/noNamespaceImport: <explanation>
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Badge } from "@/components/ui/badge";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // HTML `ref` attribute conflicts with `forwardRef`
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock keepBackground {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    Badge,
    FileTree: Files,
    FileTreeItem: ({
      icon,
      ...props
    }: {
      icon?: string;
      name: string;
      children?: React.ReactNode;
    }) => {
      if (icon === "folder") {
        return <Folder {...props} />;
      }
      return <File {...props} />;
    },
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
