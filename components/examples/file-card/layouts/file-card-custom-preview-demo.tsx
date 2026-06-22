"use client";

import { Archive, FileText, Film, ImageIcon } from "lucide-react";
import { useState } from "react";
import type { FileStatus, UploadStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";

function useMixedFileStatuses(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      file: new File(
        [new ArrayBuffer(1024 * 1024 * 3.5)],
        "brand-guidelines.pdf",
        {
          type: "application/pdf",
        }
      ),
      id: "brand-guidelines",
      result: "/uploads/brand-guidelines.pdf",
      status: "success",
      tries: 1,
    },
    {
      file: new File([new ArrayBuffer(1024 * 1024 * 45)], "launch-cut.mp4", {
        type: "video/mp4",
      }),
      id: "launch-cut",
      status: "pending",
      tries: 1,
    },
    {
      error: "Archive contains an unsupported file.",
      file: new File([new ArrayBuffer(1024 * 1024 * 1.2)], "assets.zip", {
        type: "application/zip",
      }),
      id: "assets",
      status: "error",
      tries: 2,
    },
  ]);

  return statuses;
}

function FileTypePreview(file: File, status: UploadStatus) {
  const iconClassName =
    status === "error" ? "size-4 text-destructive" : "size-4 text-foreground";

  if (file.type === "application/pdf") {
    return <FileText className={iconClassName} />;
  }

  if (file.type.startsWith("video/")) {
    return <Film className={iconClassName} />;
  }

  if (file.type.includes("zip")) {
    return <Archive className={iconClassName} />;
  }

  return <ImageIcon className={iconClassName} />;
}

export function FileCardCustomPreviewDemo() {
  const fileStatuses = useMixedFileStatuses();

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Mixed file types</h3>
        <Badge variant="secondary">Custom previews</Badge>
      </div>

      <div className="flex flex-col gap-2">
        {fileStatuses.map((status) => (
          <FileCard
            canRetry={status.tries < 3}
            fileStatus={status}
            key={status.id}
            onRemove={() => {}}
            onRetry={() => {}}
          >
            <div className="flex w-full items-center gap-3">
              <FileCardPreview
                className="bg-muted/70"
                renderPreview={FileTypePreview}
              />
              <FileCardInfo />
              <FileCardActions />
            </div>
          </FileCard>
        ))}
      </div>
    </div>
  );
}
