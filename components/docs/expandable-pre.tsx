"use client";

import { Pre } from "fumadocs-ui/components/codeblock";
import {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";

interface ExpandablePreProps extends ComponentPropsWithoutRef<typeof Pre> {
  custom?: string;
}
export function ExpandablePre({
  children,
  className,
  ...props
}: ExpandablePreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const MAX_HEIGHT = 160; // Max height in pixels before showing "Show More"

  useEffect(() => {
    if (preRef.current) {
      setIsCollapsible(preRef.current.scrollHeight > MAX_HEIGHT);
    }
  }, [children]);

  return (
    <div className="relative w-full">
      <Pre
        {...props}
        className={`${className} overflow-y-hidden font-sans! text-[13px] leading-relaxed transition-all duration-300 ease-in-out`}
        ref={preRef}
        style={{
          maxHeight: isCollapsible && !isExpanded ? `${MAX_HEIGHT}px` : "none",
        }}
      >
        {children}
      </Pre>

      {isCollapsible && (
        <div
          className={`absolute right-0 bottom-0 left-0 flex justify-center bg-linear-to-t from-background to-transparent p-2 pt-12 transition-opacity ${
            isExpanded ? "sticky from-transparent pt-2" : ""
          }`}
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
  );
}
