"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { cn } from "@/lib/utils";

export function DemoWithCodeClient({
  code,
  children,
  className,
  previewClassName,
}: {
  code: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}) {
  return (
    <Tabs
      className={cn("w-full max-w-full overflow-hidden", className)}
      groupId="demo-tabs"
      items={["Preview", "Code"]}
      persist
    >
      {/* PREVIEW */}
      <Tab value="Preview">
        <div
          className={cn(
            "mt-4 flex min-h-[350px] w-full items-center justify-center rounded-xl border bg-card p-10 text-card-foreground shadow-sm",
            previewClassName
          )}
        >
          {children}
        </div>
      </Tab>

      {/* CODE */}
      <Tab value="Code">
        <div className="mt-4">
          <DynamicCodeBlock code={code} lang="tsx" />
        </div>
      </Tab>
    </Tabs>
  );
}
