"use client";

import { FileText, FolderOpen } from "lucide-react";
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
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function uploadDocument(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { status: "success" as const, result: file.name };
}

export function DocumentsOnlyQueueDemo() {
  const dropzone = useDropzone({
    onDropFile: uploadDocument,
    validation: {
      maxFiles: 6,
      maxSize: 8 * 1024 * 1024,
      accept: {
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
    },
  });

  const hasFiles = dropzone.fileStatuses.length > 0;

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-background">
            <FolderOpen className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-sm">Contract packet</p>
            <p className="text-muted-foreground text-xs">
              Dense queue for document-heavy workflows
            </p>
          </div>
        </div>
        <Badge variant="secondary">{dropzone.fileStatuses.length}/6</Badge>
      </div>

      <Dropzone {...dropzone}>
        <DropZoneArea className="rounded-xl">
          <DropzoneTrigger className="flex w-full items-center justify-center gap-2 px-4 py-5 text-sm">
            <FileText className="size-4 text-muted-foreground" />
            Add documents
          </DropzoneTrigger>
          <DropzoneDescription className="px-4 pb-4 text-center text-xs">
            PDF, TXT, or DOCX up to 8 MB
          </DropzoneDescription>
        </DropZoneArea>
        <DropzoneMessage className="mt-2" />
      </Dropzone>

      {hasFiles ? (
        <div className="flex flex-col gap-2">
          {dropzone.fileStatuses.map((status) => (
            <FileCard
              canRetry={dropzone.canRetry(status.id)}
              fileStatus={status}
              key={status.id}
              onRemove={() => dropzone.onRemove(status.id)}
              onRetry={() => dropzone.onRetry(status.id)}
            >
              <div className="flex w-full items-center gap-3">
                <FileCardInfo maxNameLength={36} />
                <FileCardActions />
              </div>
            </FileCard>
          ))}
          <Button
            onClick={dropzone.clearAll}
            size="sm"
            type="button"
            variant="ghost"
          >
            Clear queue
          </Button>
        </div>
      ) : null}
    </div>
  );
}
