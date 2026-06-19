"use client";

import { Loader2, RotateCcw, X } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FileStatus, UploadStatus } from "./dropzone";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

const DOUBLE_EXT_REGEX = /(\.[a-z0-9]+)\1$/i;

function cleanWindowFileName(name: string): string {
  // Fix OS issue where "Hide extensions" leads to double extensions (e.g. quota.pdf.pdf)
  return name.replace(DOUBLE_EXT_REGEX, "$1");
}

function truncateFileName(name: string, maxLength = 28): string {
  const cleanName = cleanWindowFileName(name);
  if (cleanName.length <= maxLength) {
    return cleanName;
  }
  if (maxLength <= 3) {
    return cleanName.slice(0, Math.max(maxLength, 0));
  }
  const dotIndex = cleanName.lastIndexOf(".");
  const ext = dotIndex > -1 ? cleanName.slice(dotIndex) : "";
  const base = dotIndex > -1 ? cleanName.slice(0, dotIndex) : cleanName;
  if (ext.length >= maxLength - 3) {
    return `${cleanName.slice(0, maxLength - 3)}...`;
  }
  const keep = maxLength - ext.length - 3;
  return `${base.slice(0, Math.max(keep, 1))}...${ext}`;
}

/**
 * Creates an object URL for a File and revokes it automatically when the
 * file changes or the component unmounts. Returns null until the file is
 * ready (effectively immediate, but keeps the hook SSR-safe).
 *
 * Centralising this means every consumer of object URLs in this file gets
 * leak-free behaviour for free, instead of relying on each call site (or
 * each downstream user) to remember cleanup.
 */
export function useFileObjectUrl(file: File | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface FileCardContextValue {
  canRetry?: boolean;
  error?: unknown;
  file: File;
  onRemove?: () => void;
  onRetry?: () => void;
  status: UploadStatus;
  tries: number;
}

const FileCardContext = createContext<FileCardContextValue | null>(null);

export function useFileCardContext() {
  const ctx = useContext(FileCardContext);
  if (!ctx) {
    throw new Error("FileCard subcomponents must be used within <FileCard>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface FileCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether this file is still eligible for retry (pass dropzone.canRetry(id)) */
  canRetry?: boolean;
  /** The FileStatus entry from useDropzone's fileStatuses array */
  fileStatus: FileStatus<unknown, unknown>;
  /** Called when the remove action is triggered */
  onRemove?: () => void;
  /** Called when the retry action is triggered */
  onRetry?: () => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Root container for a single file's upload row. Composes with
 * FileCardPreview, FileCardInfo, FileCardProgress, and FileCardActions.
 * Renders only the wiring (context provider + row); all visual pieces
 * are opt-in children so you can rearrange or omit any of them.
 *
 * Performance note: the context value is memoized, but that only helps
 * if onRemove/onRetry are themselves stable references. If you pass
 * inline arrow functions from a .map() (e.g. `() => dropzone.onRemove(id)`),
 * they're new on every parent render and will still cause subcomponents to
 * re-render — wrap them in useCallback in the parent if this matters for
 * large lists.
 *
 * @example
 * ```tsx
 * <FileCard fileStatus={status} onRemove={...} onRetry={...} canRetry={dropzone.canRetry(status.id)}>
 *   <FileCardPreview />
 *   <FileCardInfo />
 *   <FileCardProgress />
 *   <FileCardActions />
 * </FileCard>
 * ```
 */
export function FileCard({
  className,
  children,
  fileStatus,
  onRemove,
  onRetry,
  canRetry,
  ref,
  ...props
}: FileCardProps) {
  const contextValue = useMemo<FileCardContextValue>(
    () => ({
      file: fileStatus.file,
      status: fileStatus.status,
      error: fileStatus.error,
      tries: fileStatus.tries,
      onRemove,
      onRetry,
      canRetry,
    }),
    [
      fileStatus.file,
      fileStatus.status,
      fileStatus.error,
      fileStatus.tries,
      onRemove,
      onRetry,
      canRetry,
    ]
  );

  return (
    <FileCardContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex items-center gap-3 rounded-md border border-input bg-background px-3 py-2",
          fileStatus.status === "error" && "border-destructive/50",
          className
        )}
      >
        {children}
      </div>
    </FileCardContext.Provider>
  );
}
FileCard.displayName = "FileCard";

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

export interface FileCardPreviewProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Full control over what renders inside the preview box. Receives the
   * current file and status. Return null/undefined to fall back to
   * showImageThumbnail or the default status icon.
   *
   * @example
   * ```tsx
   * <FileCardPreview
   *   renderPreview={(file, status) =>
   *     file.type === "application/pdf" ? <PdfIcon /> : null
   *   }
   * />
   * ```
   */
  renderPreview?: (file: File, status: UploadStatus) => ReactNode;
  /** Render an image thumbnail for image files instead of a generic icon */
  showImageThumbnail?: boolean;
}

/**
 * Shows a small square preview: a custom render (via renderPreview), an
 * image thumbnail (when the file is an image and showImageThumbnail is
 * true), or a status icon as the default fallback.
 *
 * Object URLs for image thumbnails are created via useFileObjectUrl, which
 * automatically revokes them on unmount or when the file changes — no
 * manual cleanup needed.
 */
export function FileCardPreview({
  className,
  showImageThumbnail = false,
  renderPreview,
  ref,
  ...props
}: FileCardPreviewProps) {
  const { file, status } = useFileCardContext();
  const isImage = file.type.startsWith("image/");
  const customPreview = renderPreview?.(file, status);
  const shouldLoadImage =
    showImageThumbnail && isImage && customPreview == null;

  // Only request an object URL when we'll actually render an image –
  // avoids creating/revoking URLs for rows that never need one.
  const objectUrl = useFileObjectUrl(shouldLoadImage ? file : undefined);
  let previewContent = customPreview;

  if (previewContent == null && shouldLoadImage && objectUrl) {
    previewContent = (
      // biome-ignore lint/performance/noImgElement: object URLs cannot be optimized by next/image
      <img
        alt={file.name}
        className="h-full w-full object-cover"
        height={40}
        src={objectUrl}
        width={40}
      />
    );
  }

  if (previewContent == null) {
    previewContent = <StatusIcon status={status} />;
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted",
        className
      )}
    >
      {previewContent}
    </div>
  );
}
FileCardPreview.displayName = "FileCardPreview";

function StatusIcon({ status }: { status: UploadStatus }) {
  if (status === "pending") {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }
  if (status === "error") {
    return <X className="h-4 w-4 text-destructive" />;
  }
  // success – a simple filled dot keeps this dependency-free; swap for
  // lucide's CheckCircle2 if you'd rather show a check mark.
  return <div className="h-2 w-2 rounded-full bg-primary" />;
}

// ---------------------------------------------------------------------------
// Info (name + size)
// ---------------------------------------------------------------------------

export interface FileCardInfoProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum characters before the filename is truncated with an ellipsis */
  maxNameLength?: number;
  ref?: Ref<HTMLDivElement>;
}

/** Shows the file name (truncated if long) and formatted size. */
export function FileCardInfo({
  className,
  maxNameLength = 28,
  ref,
  ...props
}: FileCardInfoProps) {
  const { file, status, error } = useFileCardContext();

  // Pure derivations of file.name / file.size – memoized so they don't
  // recompute on every render of a row that hasn't actually changed file.
  const displayName = useMemo(
    () => truncateFileName(file.name, maxNameLength),
    [file.name, maxNameLength]
  );
  const displaySize = useMemo(() => formatBytes(file.size), [file.size]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
    >
      <span className="truncate font-medium text-sm" title={file.name}>
        {displayName}
      </span>
      {status === "error" && error ? (
        <span className="truncate text-destructive text-xs">
          {String(error)}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">{displaySize}</span>
      )}
    </div>
  );
}
FileCardInfo.displayName = "FileCardInfo";

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export interface FileCardProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

const progressValueTextMap: Record<UploadStatus, string> = {
  pending: "indeterminate",
  success: "100%",
  error: "error",
};

/**
 * An indeterminate progress bar for "pending", a filled bar for "success",
 * and a destructive-colored bar for "error". Matches the InfiniteProgress
 * pattern used elsewhere in Shelf UI.
 */
export function FileCardProgress({
  className,
  ref,
  ...props
}: FileCardProgressProps) {
  const { status } = useFileCardContext();
  const done = status === "success" || status === "error";

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuetext={progressValueTextMap[status]}
      ref={ref}
      role="progressbar"
      {...props}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full rounded-full bg-primary transition-transform",
          done ? "translate-x-0" : "animate-pulse",
          status === "error" && "bg-destructive"
        )}
      />
    </div>
  );
}
FileCardProgress.displayName = "FileCardProgress";

// ---------------------------------------------------------------------------
// Actions (retry / remove)
// ---------------------------------------------------------------------------

export interface FileCardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Extra actions rendered after retry/remove (e.g. a "view file" link,
   * a "copy URL" button once uploaded). Lets you extend the action row
   * without forking the component for one extra button.
   */
  children?: ReactNode;
  /** Hide the remove button */
  hideRemove?: boolean;
  /** Hide the retry button even if the file is in an error state */
  hideRetry?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export type FileCardActionButtonProps = ComponentProps<typeof Button>;

export function FileCardRetryButton({
  children,
  onClick,
  ...props
}: FileCardActionButtonProps) {
  const { onRetry } = useFileCardContext();

  return (
    <Button
      aria-label="Retry upload"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onRetry?.();
        }
      }}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <RotateCcw className="h-4 w-4" />}
    </Button>
  );
}
FileCardRetryButton.displayName = "FileCardRetryButton";

export function FileCardRemoveButton({
  children,
  onClick,
  ...props
}: FileCardActionButtonProps) {
  const { onRemove } = useFileCardContext();

  return (
    <Button
      aria-label="Remove file"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onRemove?.();
        }
      }}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <X className="h-4 w-4" />}
    </Button>
  );
}
FileCardRemoveButton.displayName = "FileCardRemoveButton";

/**
 * Retry (shown only when status is "error" and canRetry is true) and
 * remove buttons. Pass hideRetry/hideRemove to opt out of either, or
 * pass children to append additional actions after the built-in ones.
 */
export function FileCardActions({
  className,
  hideRetry = false,
  hideRemove = false,
  children,
  ref,
  ...props
}: FileCardActionsProps) {
  const { status, onRetry, onRemove, canRetry } = useFileCardContext();
  const showRetry = !hideRetry && status === "error" && canRetry && onRetry;

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex shrink-0 items-center gap-1", className)}
    >
      {showRetry && <FileCardRetryButton />}
      {!hideRemove && onRemove && <FileCardRemoveButton />}
      {children}
    </div>
  );
}
FileCardActions.displayName = "FileCardActions";
