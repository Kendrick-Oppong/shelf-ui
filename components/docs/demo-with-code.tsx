import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DemoWithCodeClient } from "./demo-with-code-client";

export interface DemoWithCodeProps {
  /** The example component to render in the Preview tab */
  children: React.ReactNode;
  /** Optional className for the tabs container */
  className?: string;
  /** Optional className for the preview container */
  previewClassName?: string;
  /** Path to the example file relative to project root (e.g. "components/examples/dropzone/dropzone-demo.tsx") */
  src: string;
}

function resolveDemoPath(src: string) {
  // Prevent directory traversal
  if (src.includes("..")) {
    return null;
  }
  return join(process.cwd(), src);
}

/**
 * Renders a Preview/Code tabs pair. The code is loaded from the file at `src`.
 * Use in MDX with: <DemoWithCodReadonly src="path/to/example.tsx"><ExampleComponent /></DemoWithCodReadonly<DemoWithCodeProps>
 */
export function DemoWithCode({
  src,
  children,
  className = "my-10",
  previewClassName,
}: DemoWithCodeProps) {
  const path = resolveDemoPath(src);

  if (!path) {
    throw new Error("Invalid demo path");
  }

  let code = "";

  try {
    code = readFileSync(path, "utf-8");
  } catch (err) {
    console.error(err);
    code = `Failed to load: ${src}`;
  }

  return (
    <DemoWithCodeClient
      className={className}
      code={code}
      previewClassName={previewClassName}
    >
      {children}
    </DemoWithCodeClient>
  );
}
