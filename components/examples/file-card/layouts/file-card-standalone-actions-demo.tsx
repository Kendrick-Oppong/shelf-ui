"use client";

import { AlertCircle, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardInfo,
  FileCardRemoveButton,
  FileCardRetryButton,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";

function useFailedFiles(): FileStatus[] {
  const [statuses] = useState<FileStatus[]>(() => [
    {
      error: "Connection timed out.",
      file: new File([""], "board-deck.pdf", { type: "application/pdf" }),
      id: "board-deck",
      status: "error",
      tries: 1,
    },
    {
      error: "Upload token expired.",
      file: new File([""], "budget.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      id: "budget",
      status: "error",
      tries: 2,
    },
  ]);

  return statuses;
}

export function FileCardStandaloneActionsDemo() {
  const fileStatuses = useFailedFiles();

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Needs attention</h3>
        <Badge variant="destructive">{fileStatuses.length} failed</Badge>
      </div>

      <div className="flex flex-col gap-2">
        {fileStatuses.map((status) => (
          <FileCard
            canRetry={status.tries < 3}
            fileStatus={status}
            key={status.id}
            onRemove={() => undefined}
            onRetry={() => undefined}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-destructive/10">
              <AlertCircle className="size-4 text-destructive" />
            </div>
            <FileCardInfo maxNameLength={34} />
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <FileCardRetryButton size="icon-sm">
                <RotateCcw className="size-3.5" />
              </FileCardRetryButton>
              <FileCardRemoveButton size="icon-sm">
                <X className="size-3.5" />
              </FileCardRemoveButton>
            </div>
          </FileCard>
        ))}
      </div>
    </div>
  );
}
