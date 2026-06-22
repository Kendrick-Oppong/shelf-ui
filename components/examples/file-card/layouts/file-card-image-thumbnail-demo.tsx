"use client";

import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";

function createSvgFile(name: string, colors: [string, string]) {
  const [from, to] = colors;
  const svg = `
    <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${from}" />
          <stop offset="1" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="24" fill="url(#g)" />
      <circle cx="116" cy="42" r="18" fill="white" fill-opacity=".75" />
      <path d="M22 124 58 82l28 30 18-20 34 32Z" fill="white" fill-opacity=".7" />
    </svg>
  `;

  return new File([svg], name, { type: "image/svg+xml" });
}

function useImageStatuses(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      id: "cover",
      file: createSvgFile("cover-image.svg", ["#f59e0b", "#ef4444"]),
      status: "success",
      tries: 1,
    },
    {
      id: "gallery",
      file: createSvgFile("gallery-tile.svg", ["#14b8a6", "#2563eb"]),
      status: "pending",
      tries: 1,
    },
    {
      error: "Image dimensions are too small.",
      file: createSvgFile("thumbnail.svg", ["#a855f7", "#ec4899"]),
      id: "thumbnail",
      status: "error",
      tries: 2,
    },
  ]);

  return statuses;
}

export function FileCardImageThumbnailDemo() {
  const fileStatuses = useImageStatuses();

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Image attachments</h3>
        <Badge variant="secondary">{fileStatuses.length} images</Badge>
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
              <FileCardPreview showImageThumbnail />
              <FileCardInfo />
              <FileCardActions />
            </div>
          </FileCard>
        ))}
      </div>
    </div>
  );
}
