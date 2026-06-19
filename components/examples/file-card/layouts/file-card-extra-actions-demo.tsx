"use client";

import { Check, Clipboard, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { FileStatus } from "@/components/shelf-ui/dropzone";
import {
  FileCard,
  FileCardActions,
  FileCardInfo,
  FileCardPreview,
} from "@/components/shelf-ui/file-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function useUploadedFiles(): FileStatus<string>[] {
  const [statuses] = useState<FileStatus<string>[]>(() => [
    {
      file: new File([""], "signed-contract.pdf", {
        type: "application/pdf",
      }),
      id: "signed-contract",
      result: "https://example.com/files/signed-contract.pdf",
      status: "success",
      tries: 1,
    },
    {
      file: new File([""], "invoice-1042.pdf", { type: "application/pdf" }),
      id: "invoice",
      result: "https://example.com/files/invoice-1042.pdf",
      status: "success",
      tries: 1,
    },
  ]);

  return statuses;
}

export function FileCardExtraActionsDemo() {
  const fileStatuses = useUploadedFiles();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Uploaded documents</h3>
        <Badge>{fileStatuses.length} ready</Badge>
      </div>

      <div className="flex flex-col gap-2">
        {fileStatuses.map((status) => (
          <FileCard
            fileStatus={status}
            key={status.id}
            onRemove={() => undefined}
          >
            <FileCardPreview />
            <FileCardInfo />
            <FileCardActions hideRetry>
              <Button
                aria-label={`Copy link for ${status.file.name}`}
                onClick={() => setCopiedId(status.id)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                {copiedId === status.id ? (
                  <Check className="size-3.5" />
                ) : (
                  <Clipboard className="size-3.5" />
                )}
              </Button>
              <Button
                aria-label={`Open ${status.file.name}`}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ExternalLink className="size-3.5" />
              </Button>
            </FileCardActions>
          </FileCard>
        ))}
      </div>
    </div>
  );
}
