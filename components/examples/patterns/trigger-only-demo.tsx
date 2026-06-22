"use client";

import { Paperclip, Send } from "lucide-react";
import {
  Dropzone,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
  useFileObjectUrl,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function fakeUpload(_file: File) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { status: "success" as const };
}

function AttachmentPreview({ file }: { file: File }) {
  const objectUrl = useFileObjectUrl(
    file.type.startsWith("image/") ? file : undefined
  );

  if (objectUrl) {
    return (
      // biome-ignore lint/performance/noImgElement: object URLs cannot be optimized by next/image
      <img
        alt={file.name}
        className="size-full object-cover"
        height={32}
        src={objectUrl}
        width={32}
      />
    );
  }

  return <Paperclip className="size-3 text-muted-foreground" />;
}

// No DropZoneArea — trigger-only mode. Perfect for chat interfaces
// and comment boxes where a large drag target doesn't fit the design.
export function TriggerOnlyDemo() {
  const dropzone = useDropzone({
    onDropFile: fakeUpload,
    validation: { maxFiles: 5, maxSize: 10 * 1024 * 1024 },
  });

  const hasFiles = dropzone.fileStatuses.length > 0;

  return (
    <div className="w-full max-w-md space-y-3">
      {/* Simulated chat / form input surface with enhanced styling */}
      <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/20 shadow-lg transition-shadow duration-200 hover:shadow-xl">
        {/* Input area */}
        <div className="min-h-24 p-4">
          <p className="select-none text-muted-foreground/50 text-sm">
            Type your message here…
          </p>
        </div>

        {/* Attachments preview */}
        {hasFiles && (
          <div className="border-t bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <Badge className="h-5 text-[10px]" variant="secondary">
                {dropzone.fileStatuses.length} attached
              </Badge>
              {dropzone.fileStatuses.slice(0, 3).map((status) => (
                <div
                  className="flex size-8 items-center justify-center overflow-hidden rounded-md border bg-background shadow-sm"
                  key={status.id}
                >
                  <AttachmentPreview file={status.file} />
                </div>
              ))}
              {dropzone.fileStatuses.length > 3 && (
                <div className="flex size-8 items-center justify-center rounded-md border bg-muted font-medium text-[10px] text-muted-foreground">
                  +{dropzone.fileStatuses.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action bar with enhanced buttons */}
        <div className="flex items-center justify-between border-t bg-background/50 px-3 py-2.5 backdrop-blur-sm">
          <Dropzone {...dropzone}>
            <DropzoneTrigger className="group gap-2 font-medium text-muted-foreground text-xs transition-all hover:text-foreground hover:shadow-sm">
              <Paperclip className="size-3.5 transition-transform group-hover:-rotate-12" />
              Attach files
            </DropzoneTrigger>
            <DropzoneMessage />
          </Dropzone>

          <Button
            className="gap-2 shadow-sm transition-all hover:shadow-md"
            size="sm"
            type="button"
          >
            Send
            <Send className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Detailed attachments list with animation */}
      {hasFiles && (
        <div className="space-y-2 rounded-xl border bg-muted/20 p-3">
          <div className="flex items-center justify-between px-1">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Attachments
            </p>
            <Button
              className="h-6 text-xs"
              onClick={() => dropzone.clearAll()}
              size="sm"
              variant="ghost"
            >
              Clear all
            </Button>
          </div>
          <div className="space-y-1.5">
            {dropzone.fileStatuses.map((status, index) => (
              <FileCard
                className="group transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                fileStatus={status}
                key={status.id}
                onRemove={() => dropzone.onRemove(status.id)}
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.08}s both`,
                }}
              >
                <div className="flex w-full items-center gap-3">
                  <FileCardPreview showImageThumbnail />
                  <FileCardInfo maxNameLength={28} />
                  <FileCardActions hideRetry />
                </div>
              </FileCard>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
