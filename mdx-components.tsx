import { CodeBlock } from "fumadocs-ui/components/codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
// biome-ignore lint/performance/noNamespaceImport: Fumadocs exposes tabs as a namespace
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { HTMLAttributes } from "react";
import { DemoWithCode } from "@/components/docs/demo-with-code";
import { ExpandablePre } from "@/components/docs/expandable-pre";
import { Badge } from "@/components/ui/badge";

interface MdxPreProps extends HTMLAttributes<HTMLPreElement> {
  allowCopy?: boolean;
  custom?: string;
  keepBackground?: boolean;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // HTML `ref` attribute conflicts with `forwardRef`
    pre: ({ ref: _ref, ...props }: MdxPreProps & { ref?: unknown }) => (
      <CodeBlock keepBackground {...props}>
        <ExpandablePre {...props}>{props.children}</ExpandablePre>
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
    DemoWithCode,
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
