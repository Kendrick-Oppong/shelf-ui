"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_HEIGHT = 300; // Max height in pixels before showing "Show More"

export function DemoWithCodeClient({
  code,
  children,
  className,
  previewClassName,
}: Readonly<{
  code: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeRef.current) {
      return;
    }

    const el = codeRef.current;

    // ResizeObserver to detect when content is rendered
    const resizeObserver = new ResizeObserver(() => {
      setIsCollapsible(el.scrollHeight > MAX_HEIGHT);
    });

    resizeObserver.observe(el);

    // Also check immediately after a short delay
    const timer = setTimeout(() => {
      setIsCollapsible(el.scrollHeight > MAX_HEIGHT);
    }, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

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
        <div className="relative mt-4 w-full">
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            ref={codeRef}
            style={{
              maxHeight:
                isCollapsible && !isExpanded ? `${MAX_HEIGHT}px` : "none",
            }}
          >
            <DynamicCodeBlock code={code} lang="tsx" />
          </div>

          {isCollapsible && (
            <div
              className={cn(
                "absolute right-0 bottom-0 left-0 flex justify-center p-2 pt-12 transition-opacity",
                isExpanded
                  ? "sticky from-transparent pt-2"
                  : "bg-gradient-to-t from-background to-transparent"
              )}
            >
              <Button
                className="z-20 cursor-pointer text-xs backdrop-blur-lg"
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
                variant="secondary"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
        </div>
      </Tab>
    </Tabs>
  );
}
