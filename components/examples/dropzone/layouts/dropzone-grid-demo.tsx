"use client";

import {
  CheckCircle2,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  DropZoneArea,
  Dropzone,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function fakeUpload(file: File) {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 600)
  );
  return { status: "success" as const, result: file.name };
}

// Stable object URL per file — prevents creating a new URL on every render
function useStableObjectUrls(
  files: { id: string; file: File; status: string }[]
) {
  const urlsRef = useRef<Map<string, string>>(new Map());

  // Revoke URLs for removed files
  useEffect(() => {
    const currentIds = new Set(files.map((f) => f.id));
    for (const [id, url] of urlsRef.current) {
      if (!currentIds.has(id)) {
        URL.revokeObjectURL(url);
        urlsRef.current.delete(id);
      }
    }
  }, [files]);

  // Revoke all on unmount
  useEffect(
    () => () => {
      for (const url of urlsRef.current.values()) {
        URL.revokeObjectURL(url);
      }
    },
    []
  );

  return (file: File, id: string) => {
    if (!urlsRef.current.has(id)) {
      urlsRef.current.set(id, URL.createObjectURL(file));
    }
    return urlsRef.current.get(id) ?? "";
  };
}

export function DropzoneGridDemo() {
  const MAX = 6;

  const dropzone = useDropzone({
    onDropFile: fakeUpload,
    validation: {
      maxFiles: MAX,
      maxSize: 5 * 1024 * 1024,
      accept: { "image/*": [] },
    },
  });

  const getUrl = useStableObjectUrls(dropzone.fileStatuses);
  const count = dropzone.fileStatuses.length;
  const successCount = dropzone.fileStatuses.filter(
    (s) => s.status === "success"
  ).length;

  return (
    <div className="w-full max-w-md space-y-4">
      <Dropzone {...dropzone}>
        {/* Drop zone — only show when not at limit */}
        {count < MAX && (
          <DropZoneArea className="group rounded-xl transition-all duration-200">
            <DropzoneTrigger className="flex w-full flex-col items-center gap-4 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl border bg-muted/60 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-muted group-hover:shadow">
                <ImageIcon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  Upload images{" "}
                  <span className="text-primary underline-offset-2 hover:underline">
                    or browse
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  Up to {MAX} images · Max 5 MB each
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        )}

        <DropzoneMessage className="mt-1" />

        {count > 0 && (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">Gallery</p>
                <Badge variant="secondary">
                  {successCount}/{count} uploaded
                </Badge>
              </div>
              <Button
                className="h-7 gap-1.5 text-xs"
                onClick={() => dropzone.clearAll()}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="size-3" />
                Clear all
              </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2">
              {dropzone.fileStatuses.map((status) => {
                const url = getUrl(status.file, status.id);
                const isPending = status.status === "pending";
                const isSuccess = status.status === "success";

                return (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm"
                    key={status.id}
                  >
                    <Image
                      alt={status.file.name}
                      className={cn(
                        "m-0! object-cover transition-transform duration-300 group-hover:scale-105",
                        isPending && "opacity-60 grayscale"
                      )}
                      fill
                      sizes="(max-width: 768px) 33vw, 120px"
                      src={url}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/25" />

                    {/* Status badges */}
                    {isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-8 items-center justify-center rounded-full bg-background/80 shadow backdrop-blur-sm">
                          <Loader2 className="size-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}

                    {isSuccess && (
                      <div className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-background/80 opacity-0 shadow backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <CheckCircle2 className="size-3 text-primary" />
                      </div>
                    )}

                    {/* Remove */}
                    <Button
                      aria-label={`Remove ${status.file.name}`}
                      className="absolute top-1.5 right-1.5 size-6 rounded-full bg-background/80 opacity-0 shadow backdrop-blur-sm transition-opacity group-hover:opacity-100"
                      onClick={() => dropzone.onRemove(status.id)}
                      size="icon-xs"
                      type="button"
                      variant="ghost"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                );
              })}

              {count < MAX && (
                <DropZoneArea className="aspect-square rounded-xl border-0 p-0">
                  <DropzoneTrigger className="group/add flex size-full cursor-pointer items-center justify-center rounded-xl border border-dashed bg-muted/30 p-0 transition-colors hover:border-primary/50 hover:bg-primary/5">
                    <Plus className="size-5 text-muted-foreground transition-colors group-hover/add:text-primary" />
                  </DropzoneTrigger>
                </DropZoneArea>
              )}

              {Array.from({ length: MAX }, (_, slotIndex) => slotIndex)
                .slice(count + (count < MAX ? 1 : 0))
                .map((slot) => (
                  <div
                    className="aspect-square rounded-xl border border-dashed bg-muted/20"
                    key={`placeholder-${slot}`}
                  />
                ))}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
