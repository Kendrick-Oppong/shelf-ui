"use client";

import { FileText, Mountain, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
  FileCardProgress,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function useSampleFileStatuses(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      id: "1",
      file: new File([""], "quarterly-report.pdf", {
        type: "application/pdf",
      }),
      status: "pending",
      tries: 1,
    },
    {
      id: "2",
      file: new File([""], "mountain-view.jpg", { type: "image/jpeg" }),
      status: "success",
      tries: 1,
      result:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "3",
      file: new File([""], "contract-v2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      status: "error",
      tries: 2,
      error: "File type not allowed.",
    },
  ]);

  return statuses;
}

const statusConfig = {
  pending: { label: "Uploading", variant: "secondary" as const },
  success: { label: "Complete", variant: "default" as const },
  error: { label: "Failed", variant: "destructive" as const },
};

export function FileCardBasicDemo() {
  const fileStatuses = useSampleFileStatuses();

  const successCount = fileStatuses.filter(
    (status) => status.status === "success"
  ).length;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Uploaded Files</h3>
          <Badge className="h-5 px-1.5 text-[10px]" variant="secondary">
            {successCount}/{fileStatuses.length}
          </Badge>
        </div>

        <Button
          className="h-7 gap-1.5 text-xs"
          onClick={() => {}}
          size="sm"
          variant="ghost"
        >
          <Trash2 className="size-3" />
          Clear all
        </Button>
      </div>

      {/* Files */}
      <div className="space-y-2">
        {fileStatuses.map((status) => {
          const config = statusConfig[status.status];

          return (
            <FileCard
              canRetry={status.tries < 3}
              className="group transition-all duration-200 hover:border-primary/50 hover:shadow-md"
              fileStatus={status}
              key={status.id}
              onRemove={() => {}}
              onRetry={() => {}}
            >
              <FileCardPreview
                className="transition-transform duration-200 group-hover:scale-105"
                renderPreview={(file) => {
                  if (file.type.startsWith("image/")) {
                    return (
                      <div className="relative flex size-full items-center justify-center rounded-md bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10">
                        <Mountain className="size-4 text-muted-foreground/40" />
                      </div>
                    );
                  }

                  return file.type === "application/pdf" ? (
                    <div className="flex size-full items-center justify-center rounded-md bg-red-50 dark:bg-red-950/30">
                      <FileText className="size-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/30">
                      <FileText className="size-4 text-blue-500" />
                    </div>
                  );
                }}
                showImageThumbnail
              />

              <div className="flex flex-1 flex-col gap-1.5">
                <FileCardInfo />
                <FileCardProgress />
              </div>

              <Badge className="shrink-0 text-[10px]" variant={config.variant}>
                {config.label}
              </Badge>

              <FileCardActions />
            </FileCard>
          );
        })}
      </div>
    </div>
  );
}
