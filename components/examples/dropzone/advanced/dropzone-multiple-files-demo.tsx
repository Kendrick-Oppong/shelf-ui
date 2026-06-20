"use client";

import { Files, RotateCcw, Trash2, Upload } from "lucide-react";
import {
  DropZoneArea,
  Dropzone,
  DropzoneDescription,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
  FileCardProgress,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function uploadDocument(file: File) {
  await new Promise((resolve) =>
    setTimeout(resolve, 900 + Math.random() * 700)
  );

  if (file.name.toLowerCase().includes("fail")) {
    return {
      status: "error" as const,
      error: "Server rejected this file. Rename it and retry.",
    };
  }

  return {
    status: "success" as const,
    result: `/uploads/${encodeURIComponent(file.name)}`,
  };
}

export function DropzoneMultipleFilesDemo() {
  const dropzone = useDropzone({
    onDropFile: uploadDocument,
    validation: {
      maxFiles: 8,
      maxSize: 10 * 1024 * 1024,
      accept: {
        "application/pdf": [".pdf"],
        "image/*": [],
        "text/plain": [".txt"],
      },
    },
  });

  const total = dropzone.fileStatuses.length;
  const completed = dropzone.fileStatuses.filter(
    (file) => file.status === "success"
  ).length;
  const failed = dropzone.fileStatuses.filter(
    (file) => file.status === "error"
  ).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Dropzone {...dropzone}>
        <DropZoneArea className="group overflow-hidden rounded-xl transition-all hover:border-primary/60">
          <DropzoneTrigger className="flex w-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/60 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:bg-primary/5">
              <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Upload a batch</p>
              <DropzoneDescription className="text-xs">
                Images, PDFs, and text files up to 10 MB
              </DropzoneDescription>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      {total > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Files className="size-4 shrink-0 text-muted-foreground" />
              <p className="truncate font-semibold text-sm">Upload queue</p>
              <Badge variant="secondary">
                {completed}/{total}
              </Badge>
              {failed > 0 && (
                <Badge variant="destructive">{failed} failed</Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {failed > 0 && (
                <Button
                  aria-label="Retry failed uploads"
                  onClick={dropzone.retryFailed}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <RotateCcw className="size-3" />
                </Button>
              )}
              <Button
                aria-label="Clear all uploads"
                onClick={dropzone.clearAll}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {dropzone.fileStatuses.map((status) => (
              <FileCard
                canRetry={dropzone.canRetry(status.id)}
                fileStatus={status}
                key={status.id}
                onRemove={() => dropzone.onRemove(status.id)}
                onRetry={() => dropzone.onRetry(status.id)}
              >
                <FileCardPreview showImageThumbnail />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <FileCardInfo />
                  <FileCardProgress />
                </div>
                <FileCardActions />
              </FileCard>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
