import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "@/lib/layout-shared";
import { source } from "@/lib/source";
export default function Layout({ children }: Readonly<LayoutProps<"/docs">>) {
  return (
    <DocsLayout {...baseOptions()} tree={source.getPageTree()}>
      {children}
    </DocsLayout>
  );
}
