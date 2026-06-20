"use client";

import { CloudUpload, FileText, Sparkles } from "lucide-react";
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

async function fakeUpload(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  if (Math.random() < 0.12) {
    return { status: "error" as const, error: "Upload failed. Try again." };
  }
  return { status: "success" as const, result: file.name };
}

export function DropzoneBasicDemo() {
  const dropzone = useDropzone({
    onDropFile: fakeUpload,
    validation: {
      maxSize: 5 * 1024 * 1024,
      maxFiles: 5,
      accept: { "image/*": [], "application/pdf": [".pdf"] },
    },
  });

  const hasFiles = dropzone.fileStatuses.length > 0;
  const successCount = dropzone.fileStatuses.filter(
    (f) => f.status === "success"
  ).length;

  return (
    <div className="w-full max-w-md space-y-4">
      <Dropzone {...dropzone}>
        <DropZoneArea className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50">
          <DropzoneTrigger className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            {/* Icon with animation */}
            <div className="relative flex size-16 items-center justify-center rounded-2xl border-2 border-muted-foreground/30 border-dashed bg-muted/50 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:shadow-md">
              <CloudUpload className="size-7 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
              <Sparkles className="absolute -top-1 -right-1 size-4 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100" />
            </div>

            {/* Text content */}
            <div className="relative space-y-2">
              <p className="font-semibold text-sm leading-none">
                Drop files here or{" "}
                <span className="text-primary underline-offset-4 transition-all hover:underline">
                  browse
                </span>
              </p>
              <DropzoneDescription className="text-xs">
                Images & PDFs · Up to 5 MB each
              </DropzoneDescription>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      {hasFiles && (
        <div className="fade-in slide-in-from-top-2 animate-in space-y-3 duration-300">
          {/* Header with stats */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground text-sm">
                Upload Queue
              </p>
              {successCount > 0 && (
                <Badge
                  className="fade-in zoom-in animate-in duration-200"
                  variant="default"
                >
                  {successCount} completed
                </Badge>
              )}
            </div>
            <Badge variant="secondary">{dropzone.fileStatuses.length}</Badge>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {dropzone.fileStatuses.map((status, index) => (
              <div
                className="slide-in-from-top-2 fade-in animate-in duration-300"
                key={status.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FileCard
                  canRetry={dropzone.canRetry(status.id)}
                  className="shadow-sm transition-shadow hover:shadow-md"
                  fileStatus={status}
                  onRemove={() => dropzone.onRemove(status.id)}
                  onRetry={() => dropzone.onRetry(status.id)}
                >
                  <FileCardPreview
                    renderPreview={(file) =>
                      file.type.startsWith("image/") ? undefined : (
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <FileText className="size-5 text-muted-foreground" />
                        </div>
                      )
                    }
                    showImageThumbnail
                  />
                  <FileCardInfo />
                  <div className="flex flex-1 flex-col justify-center gap-1.5">
                    <FileCardProgress />
                  </div>
                  <FileCardActions />
                </FileCard>
              </div>
            ))}
          </div>

          {/* Clear all button */}
          {dropzone.fileStatuses.length > 1 && (
            <Button
              className="w-full"
              onClick={() => dropzone.clearAll()}
              size="sm"
              variant="outline"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
