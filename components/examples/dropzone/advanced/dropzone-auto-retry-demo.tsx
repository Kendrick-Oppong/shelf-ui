"use client";

import { RotateCcw, ShieldCheck, UploadCloud } from "lucide-react";
import { useRef } from "react";
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

export function DropzoneAutoRetryDemo() {
  const attemptsRef = useRef(new Map<string, number>());

  const dropzone = useDropzone({
    autoRetry: true,
    maxRetryCount: 3,
    onDropFile: async (file) => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const attempts = (attemptsRef.current.get(file.name) ?? 0) + 1;
      attemptsRef.current.set(file.name, attempts);

      if (attempts < 3) {
        return {
          status: "error" as const,
          error: `Temporary network error. Attempt ${attempts} of 3.`,
        };
      }

      return { status: "success" as const, result: file.name };
    },
    validation: {
      maxFiles: 3,
      maxSize: 5 * 1024 * 1024,
    },
  });

  const pending = dropzone.fileStatuses.filter(
    (file) => file.status === "pending"
  ).length;
  const failed = dropzone.fileStatuses.filter(
    (file) => file.status === "error"
  ).length;
  const completed = dropzone.fileStatuses.filter(
    (file) => file.status === "success"
  ).length;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Dropzone {...dropzone}>
        <DropZoneArea className="group rounded-xl transition-all hover:border-primary/60">
          <DropzoneTrigger className="flex w-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/60 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:bg-primary/5">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">Auto-retry upload</p>
              <DropzoneDescription className="text-xs">
                The first two attempts fail, then the retry succeeds
              </DropzoneDescription>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      {dropzone.fileStatuses.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <p className="font-semibold text-sm">Retry state</p>
            </div>
            <div className="flex items-center gap-1">
              {pending > 0 && (
                <Badge variant="secondary">{pending} pending</Badge>
              )}
              {failed > 0 && (
                <Badge variant="destructive">{failed} failed</Badge>
              )}
              {completed > 0 && <Badge>{completed} done</Badge>}
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
                <FileCardPreview />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <FileCardInfo />
                  <FileCardProgress />
                  <p className="text-muted-foreground text-xs">
                    Attempts: {status.tries}
                  </p>
                </div>
                <FileCardActions />
              </FileCard>
            ))}
          </div>

          {failed > 0 ? (
            <Button
              onClick={dropzone.retryFailed}
              size="sm"
              type="button"
              variant="outline"
            >
              <RotateCcw className="size-3.5" />
              Retry failed now
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
