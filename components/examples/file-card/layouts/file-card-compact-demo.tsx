"use client";

import { CheckCircle2, Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardFileName,
  FileCardFileSize,
  FileCardStatusText,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function useSampleFileStatuses(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      id: "1",
      file: new File([new ArrayBuffer(1024 * 1024 * 1.8)], "resume.pdf", {
        type: "application/pdf",
      }),
      status: "success",
      tries: 1,
      result: "https://example.com/resume.pdf",
    },
    {
      id: "2",
      file: new File([new ArrayBuffer(1024 * 400)], "cover-letter.pdf", {
        type: "application/pdf",
      }),
      status: "success",
      tries: 1,
      result: "https://example.com/cover-letter.pdf",
    },
    {
      id: "3",
      file: new File(
        [new ArrayBuffer(1024 * 1024 * 8.5)],
        "portfolio-2024.pdf",
        { type: "application/pdf" }
      ),
      status: "success",
      tries: 1,
      result: "https://example.com/portfolio.pdf",
    },
  ]);
  return statuses;
}

// Compact layout with enhanced UI — file icons with subtle animations,
// action buttons with hover states, and a polished document list appearance
export function FileCardCompactDemo() {
  const fileStatuses = useSampleFileStatuses();

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Attachments</h3>
          <Badge className="h-5 px-1.5 text-[10px]" variant="secondary">
            {fileStatuses.length} files
          </Badge>
        </div>
        <Button
          className="h-7 gap-1.5 text-muted-foreground text-xs hover:text-foreground"
          onClick={() => {}}
          size="sm"
          variant="ghost"
        >
          <Download className="size-3" />
          Download all
        </Button>
      </div>

      {/* Compact file list */}
      <div className="space-y-2">
        {fileStatuses.map((status) => (
          <FileCard
            className="group relative overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
            fileStatus={status}
            key={status.id}
            onRemove={() => {}}
          >
            <div className="flex w-full items-center gap-3">
              {/* Subtle gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* File icon with background */}
              <div className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm transition-transform duration-200 group-hover:scale-105 dark:from-red-950/30 dark:to-red-900/20">
                <FileText className="size-4 text-red-500" />
                {/* Success indicator */}
                <div className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-background shadow-sm">
                  <CheckCircle2 className="size-2.5 text-emerald-500" />
                </div>
              </div>

              {/* File info */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <FileCardFileName />
                <span className="flex items-center gap-1.5">
                  <FileCardFileSize />
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <FileCardStatusText />
                </span>
              </div>

              {/* Actions with enhanced styling */}
              <FileCardActions className="relative" hideRetry>
                <Button
                  aria-label="View file"
                  className="size-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  onClick={() => {}}
                  size="icon"
                  variant="ghost"
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              </FileCardActions>
            </div>
          </FileCard>
        ))}
      </div>
    </div>
  );
}
