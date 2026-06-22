"use client";

import { Files, Sparkles, Upload } from "lucide-react";
import {
  DropZoneArea,
  Dropzone,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardProgress,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function fakeUpload(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { status: "success" as const, result: file.name };
}

export function EmptyStateDemo() {
  const dropzone = useDropzone({
    onDropFile: fakeUpload,
    validation: { maxFiles: 3, maxSize: 2 * 1024 * 1024 },
  });

  const hasFiles = dropzone.fileStatuses.length > 0;
  const remaining = 3 - dropzone.fileStatuses.length;
  const successCount = dropzone.fileStatuses.filter(
    (s) => s.status === "success"
  ).length;

  return (
    <div className="w-full max-w-md space-y-4">
      <Dropzone {...dropzone}>
        <DropZoneArea className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:border-primary/50 hover:shadow-md">
          {/* Animated gradient background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <DropzoneTrigger className="relative flex w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="relative">
              <div className="flex size-14 items-center justify-center rounded-2xl border-2 bg-linear-to-br from-background to-muted/60 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <Upload className="size-6 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
              </div>
              {/* Sparkle decoration */}
              <div className="absolute -top-1 -right-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Sparkles className="size-4 animate-pulse text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-base">Drop your files here</p>
              <p className="text-muted-foreground text-sm">
                or{" "}
                <span className="font-medium text-primary underline-offset-4 transition-all group-hover:underline">
                  click to browse
                </span>
              </p>
              <p className="text-muted-foreground/70 text-xs">
                Maximum 3 files · 2 MB each
              </p>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      {/* File list or empty state */}
      <div
        className={cn(
          "rounded-xl border transition-all duration-300",
          hasFiles
            ? "bg-gradient-to-br from-muted/30 to-muted/10 p-4 shadow-sm"
            : "border-dashed bg-muted/20"
        )}
      >
        {hasFiles ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">Upload Queue</p>
                <Badge className="h-5 text-[10px]" variant="secondary">
                  {successCount}/{dropzone.fileStatuses.length}
                </Badge>
              </div>
              {remaining > 0 ? (
                <Badge className="text-xs" variant="outline">
                  {remaining} slot{remaining === 1 ? "" : "s"} left
                </Badge>
              ) : (
                <Badge className="text-xs">Full</Badge>
              )}
            </div>
            <div className="space-y-2">
              {dropzone.fileStatuses.map((status, index) => (
                <FileCard
                  canRetry={dropzone.canRetry(status.id)}
                  className="transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                  fileStatus={status}
                  key={status.id}
                  onRemove={() => dropzone.onRemove(status.id)}
                  onRetry={() => dropzone.onRetry(status.id)}
                  style={{
                    animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex w-full items-center gap-3">
                    <FileCardInfo />
                    <FileCardActions />
                  </div>
                  <FileCardProgress />
                </FileCard>
              ))}
            </div>
            <Button
              className="mt-2 h-8 w-full text-xs"
              onClick={() => dropzone.clearAll()}
              size="sm"
              variant="ghost"
            >
              Clear all files
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border-2 border-dashed bg-muted/40">
              <Files className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                No files uploaded yet
              </p>
              <p className="text-muted-foreground/60 text-xs">
                Your uploads will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
