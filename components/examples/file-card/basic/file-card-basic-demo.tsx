"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardCopyButton,
  FileCardDownloadButton,
  FileCardFileName,
  FileCardFileSize,
  FileCardPreview,
  FileCardProgress,
  FileCardStatusText,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function useSampleFileStatuses(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      id: "1",
      file: new File(
        [new ArrayBuffer(1024 * 1024 * 2.4)],
        "quarterly-report.pdf",
        { type: "application/pdf" }
      ),
      status: "pending",
      tries: 1,
    },
    {
      id: "2",
      file: new File([new ArrayBuffer(1024 * 850)], "mountain-view.jpg", {
        type: "image/jpeg",
      }),
      status: "success",
      tries: 1,
      result:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    },
    {
      id: "3",
      file: new File([new ArrayBuffer(1024 * 1024 * 1.2)], "contract-v2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      status: "error",
      tries: 2,
      error: "File type not allowed.",
    },
  ]);
  return statuses;
}

export function FileCardBasicDemo() {
  const fileStatuses = useSampleFileStatuses();
  const successCount = fileStatuses.filter(
    (s) => s.status === "success"
  ).length;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Uploaded Files</h3>
          <Badge className="h-5 px-1.5 text-[10px]" variant="secondary">
            {successCount}/{fileStatuses.length}
          </Badge>
        </div>
        <Button
          className="h-7 gap-1.5 text-xs"
          onClick={() => {}}
          size="sm"
          variant="ghost"
        >
          <Trash2 className="size-3" />
          Clear all
        </Button>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {fileStatuses.map((status) => (
          <FileCard
            canRetry={status.tries < 3}
            className="group transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
            fileStatus={status}
            key={status.id}
            onRemove={() => {}}
            onRetry={() => {}}
          >
            <div className="flex w-full items-center gap-3">
              <FileCardPreview showImageThumbnail />

              {/* Name + status inline */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <FileCardFileName />
                <span className="flex items-center gap-1.5">
                  <FileCardFileSize />
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <FileCardStatusText />
                </span>
              </div>

              <FileCardActions>
                <FileCardCopyButton />
                <FileCardDownloadButton />
              </FileCardActions>
            </div>

            <FileCardProgress />
          </FileCard>
        ))}
      </div>
    </div>
  );
}
