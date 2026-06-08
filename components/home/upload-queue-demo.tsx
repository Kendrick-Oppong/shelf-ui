"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FileState = "done" | "uploading" | "pending";

const STATE_STYLES: Record<FileState, { text: string; bar: string }> = {
  done: { text: "text-success", bar: "bg-success" },
  uploading: { text: "text-primary", bar: "bg-primary" },
  pending: { text: "text-muted-foreground", bar: "bg-muted-foreground/30" },
};

export function UploadQueueDemo() {
  const [pct, setPct] = useState(63);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((prev) => {
        const next = prev + dir * (Math.random() * 1.8);
        if (next >= 100) {
          setDir(-1);
          return 100;
        }
        if (next <= 0) {
          setDir(1);
          return 0;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [dir]);

  const rounded = Math.round(pct);
  const uploading = rounded < 100;

  const files = [
    { name: "presentation.pptx", pct: 100, state: "done" as FileState },
    {
      name: "dataset-2024.csv",
      pct: rounded,
      state: uploading ? "uploading" : ("done" as FileState),
    },
    { name: "backup.tar.gz", pct: 0, state: "pending" as FileState },
  ];

  return (
    <div className="flex flex-col gap-2">
      {files.map(({ name, pct: filePct, state }) => {
        const { text, bar } = STATE_STYLES[state];
        let statusText: string;

        if (state === "done") {
          statusText = "Done ✓";
        } else if (state === "pending") {
          statusText = "Pending";
        } else {
          statusText = `${filePct}%`;
        }
        return (
          <div
            className="rounded-[7px] border border-border bg-accent p-2.5"
            key={name}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="max-w-[70%] truncate font-medium text-[11px] text-foreground">
                {name}
              </span>
              <span
                className={cn("font-bold text-[10px] transition-colors", text)}
              >
                {statusText}
              </span>
            </div>
            <div className="h-0.5 overflow-hidden rounded-full bg-border">
              <motion.div
                animate={{ width: `${filePct}%` }}
                className={cn("h-full rounded-full", bar)}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
