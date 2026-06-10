import { getGithubLastEdit } from "fumadocs-core/content/github";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/notebook/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/docs/mdx";
import { source } from "@/lib/source";

export default async function Page(
  props: Readonly<PageProps<"/docs/[[...slug]]">>
) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const githubUrl = `https://github.com/Kendrick-Oppong/shelf-ui/tree/main/content/docs/${page.path}`;
  const lastModifiedTime = await getGithubLastEdit({
    owner: "Kendrick-Oppong",
    repo: "shelf-ui",
    path: `content/docs/${page.path}`,
  });
  console.log(lastModifiedTime);
  console.log("page.path:", page.path);
  return (
    <DocsPage
      className="p-5!"
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
        container: { className: "bg-card border border-t-0 px-3 py-5" },
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
      <ViewOptionsPopover githubUrl={githubUrl} />
      {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
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
  };
}
