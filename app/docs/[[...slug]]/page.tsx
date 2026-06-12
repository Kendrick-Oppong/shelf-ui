import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/notebook/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GITHUB_REPO_URL } from "@/lib/constants";
import { getPageImage, source } from "@/lib/source";
import { formatDate } from "@/lib/utils";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(
  props: Readonly<PageProps<"/docs/[[...slug]]">>
) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const githubUrl = `${GITHUB_REPO_URL}/tree/main/content/docs/${page.path}`;
  const lastModifiedTime = page.data.lastModified;

  return (
    <DocsPage
      className="p-5!"
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
        container: { className: "bg-card border border-t-0 px-3 py-5" },
        footer: (
          <ViewOptionsPopover
            className="mx-auto mt-5 w-full p-2 text-center"
            githubUrl={githubUrl}
          >
            Ask AI
          </ViewOptionsPopover>
        ),
      }}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>

      {lastModifiedTime && (
        <p className="rounded-lg border bg-card px-4 py-2 font-semibold text-muted-foreground text-sm">
          Last Updated on {formatDate(lastModifiedTime)}
        </p>
      )}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
