"use client";

import { AlertCircle, FileWarning, Upload } from "lucide-react";
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

interface UploadError {
  code: "virus_scan_failed" | "quota_exceeded" | "network";
  detail?: string;
}

async function guardedUpload(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (file.name.toLowerCase().includes("quota")) {
    return {
      status: "error" as const,
      error: { code: "quota_exceeded" as const },
    };
  }

  if (file.name.toLowerCase().includes("virus")) {
    return {
      status: "error" as const,
      error: {
        code: "virus_scan_failed" as const,
        detail: "The scan service blocked this file.",
      },
    };
  }

  return { status: "success" as const, result: file.name };
}

function getUploadErrorMessage(error: UploadError) {
  if (error.code === "quota_exceeded") {
    return "Storage limit reached. Remove a file before uploading more.";
  }

  if (error.code === "virus_scan_failed") {
    return "Security scan failed. Choose a different file.";
  }

  return "Upload interrupted. Check your connection and retry.";
}

export function DropzoneCustomErrorsDemo() {
  const dropzone = useDropzone<string, UploadError>({
    onDropFile: guardedUpload,
    shapeUploadError: getUploadErrorMessage,
    validation: {
      maxFiles: 4,
      maxSize: 2 * 1024 * 1024,
      accept: {
        "application/pdf": [".pdf"],
        "image/*": [],
      },
    },
  });

  const failed = dropzone.fileStatuses.filter(
    (file) => file.status === "error"
  ).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Dropzone {...dropzone}>
        <DropZoneArea className="group rounded-xl transition-all hover:border-primary/60 aria-invalid:border-destructive">
          <DropzoneTrigger className="flex w-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/60 shadow-sm transition-all group-hover:bg-primary/5">
              {dropzone.isInvalid ? (
                <AlertCircle className="size-5 text-destructive" />
              ) : (
                <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Validated upload</p>
              <DropzoneDescription className="text-xs">
                PDFs and images only, max 2 MB
              </DropzoneDescription>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      <div className="rounded-xl border bg-muted/20 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileWarning className="size-4 text-muted-foreground" />
            <p className="font-semibold text-sm">Error-shaped queue</p>
          </div>
          {failed > 0 && <Badge variant="destructive">{failed} failed</Badge>}
        </div>

        {dropzone.fileStatuses.length > 0 ? (
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
        ) : (
          <p className="text-muted-foreground text-sm">
            Try dropping a file with "quota" or "virus" in its name to see a
            shaped upload error.
          </p>
        )}
      </div>
    </div>
  );
}
