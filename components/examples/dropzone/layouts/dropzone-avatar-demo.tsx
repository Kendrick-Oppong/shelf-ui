"use client";

import { Camera, Check, Loader2, User, X } from "lucide-react";
import {
  DropZoneArea,
  Dropzone,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone";
import { useFileObjectUrl } from "@/components/shelf-ui/file-card";
import { Button } from "@/components/ui/button";

async function fakeUpload(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { status: "success" as const, result: file.name };
}

export function DropzoneAvatarDemo() {
  const dropzone = useDropzone({
    onDropFile: fakeUpload,
    validation: {
      maxFiles: 1,
      maxSize: 2 * 1024 * 1024,
      accept: { "image/*": [] },
    },
    shiftOnMaxFiles: true,
  });

  const current = dropzone.fileStatuses[0];
  const isPending = current?.status === "pending";
  const previewUrl = useFileObjectUrl(current?.file);

  return (
    <div className="flex flex-col items-center gap-6">
      <Dropzone {...dropzone}>
        <DropZoneArea className="rounded-full border-0 bg-transparent p-0 ring-0">
          <DropzoneTrigger
            aria-label={
              previewUrl ? "Change profile photo" : "Upload profile photo"
            }
            className="group relative size-32 place-items-center overflow-hidden rounded-full border-0 bg-transparent p-0 ring-2 ring-border ring-offset-2 ring-offset-background transition-all hover:ring-primary focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="absolute inset-0 overflow-hidden rounded-full bg-linear-to-br from-muted to-muted/80">
              {previewUrl ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url("${previewUrl}")` }}
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <User
                    className="size-12 text-muted-foreground/40"
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Camera className="size-5 text-white" />
              </div>
              <span className="font-medium text-[11px] text-white/95">
                {previewUrl ? "Change" : "Upload"}
              </span>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>

        <DropzoneMessage className="mt-3 text-center" />
      </Dropzone>

      <div className="flex flex-col items-center gap-3 text-center">
        <div>
          <p className="font-semibold text-sm">Profile Photo</p>
          <p className="text-muted-foreground text-xs">
            JPG, PNG or WebP &middot; Max 2 MB
          </p>
        </div>

        {previewUrl && (
          <div className="fade-in slide-in-from-bottom-2 flex animate-in gap-2 duration-300">
            <Button
              onClick={() => dropzone.clearAll()}
              size="sm"
              variant="outline"
            >
              <X className="mr-1.5 size-3.5" />
              Remove
            </Button>
            <Button size="sm" variant="default">
              <Check className="mr-1.5 size-3.5" />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
