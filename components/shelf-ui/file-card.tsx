"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
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
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
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

type FileCategory = "image" | "video" | "audio" | "document" | "other";

function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith("image/")) {
    return "image";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (mimeType.startsWith("audio/")) {
    return "audio";
  }
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("text") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation")
  ) {
    return "document";
  }
  return "other";
}

/**
 * Creates an object URL for a File and revokes it automatically when the
 * file changes or the component unmounts. Returns null until the file is
 * ready (effectively immediate, but keeps the hook SSR-safe)
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
  /**
   * Upload progress from 0–100. When provided, the progress bar renders as
   * a real fill instead of indeterminate. Omit if your upload API doesn't
   * report progress.
   */
  progress?: number;
  /** The upload result (e.g., a URL string). Available once status is "success". */
  result?: unknown;
  status: UploadStatus;
  tries: number;
}

const FileCardContext = createContext<FileCardContextValue | null>(null);

export function useFileCardContext(): FileCardContextValue {
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
  /**
   * Real upload progress 0–100. When provided, the progress bar shows a
   * real fill; otherwise it uses an indeterminate pulse animation.
   */
  progress?: number;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Root container. Provides context to all FileCard subcomponents.
 *
 * Renders a column flex container. Build your internal layout using the modular
 * `<FileCard*>` subcomponents, wrapping them in a standard `<div className="flex">`
 * where a horizontal row is needed.
 *
 * @example
 * ```tsx
 * <FileCard fileStatus={status} onRemove={...} onRetry={...} canRetry={...}>
 *   <div className="flex items-center gap-3 w-full">
 *     <FileCardPreview />
 *     <FileCardInfo />
 *     <FileCardActions />
 *   </div>
 *   <FileCardProgress />
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
  progress,
  ref,
  ...props
}: FileCardProps) {
  const contextValue = useMemo<FileCardContextValue>(
    () => ({
      file: fileStatus.file,
      status: fileStatus.status,
      error: fileStatus.error,
      tries: fileStatus.tries,
      result: fileStatus.result,
      onRemove,
      onRetry,
      canRetry,
      progress,
    }),
    [
      fileStatus.file,
      fileStatus.status,
      fileStatus.error,
      fileStatus.tries,
      fileStatus.result,
      onRemove,
      onRetry,
      canRetry,
      progress,
    ]
  );

  return (
    <FileCardContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-col gap-2 rounded-lg border border-input bg-background px-3 py-2.5 transition-colors duration-200",
          fileStatus.status === "error" &&
            "border-destructive/60 bg-destructive/[0.03]",
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
   * Full control over what renders inside the preview box.
   * Return null/undefined to fall back to showImageThumbnail or the
   * default type icon.
   */
  renderPreview?: (file: File, status: UploadStatus) => ReactNode;
  /** Render an image thumbnail for image files instead of a generic icon */
  showImageThumbnail?: boolean;
}

/**
 * Shows a small square preview: a custom render (via renderPreview), an
 * image thumbnail (when the file is an image and showImageThumbnail is true),
 * or a MIME-type icon as the default fallback.
 */
export function FileCardPreview({
  className,
  showImageThumbnail = false,
  renderPreview,
  ref,
  ...props
}: FileCardPreviewProps) {
  const { file, status, result } = useFileCardContext();
  const isImage = file.type.startsWith("image/");
  const customPreview = renderPreview?.(file, status);
  const shouldLoadImage =
    showImageThumbnail && isImage && customPreview == null;

  const resultUrl = typeof result === "string" ? result : null;
  const objectUrl = useFileObjectUrl(
    shouldLoadImage && !resultUrl ? file : undefined
  );
  let previewContent = customPreview;

  const finalImageUrl = resultUrl || objectUrl;

  if (previewContent == null && shouldLoadImage && finalImageUrl) {
    previewContent = (
      // biome-ignore lint/performance/noImgElement: object URLs cannot be optimized by next/image
      <img
        alt={file.name}
        className="h-full w-full object-cover"
        height={40}
        src={finalImageUrl}
        width={40}
      />
    );
  }

  previewContent ??= <FileCardTypeIcon />;

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

// ---------------------------------------------------------------------------
// Type icon – adapts to MIME category (exported, usable standalone)
// ---------------------------------------------------------------------------

export interface FileCardTypeIconProps {
  className?: string;
  /** Override the file (defaults to the one in context) */
  file?: File;
}

const CATEGORY_ICON: Record<FileCategory, typeof FileText> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
  other: FileText,
};

const CATEGORY_CLASS: Record<FileCategory, string> = {
  image: "text-violet-500",
  video: "text-blue-500",
  audio: "text-emerald-500",
  document: "text-orange-500",
  other: "text-muted-foreground",
};

/** Renders an appropriate icon for the file's MIME type. */
export function FileCardTypeIcon({
  file: fileProp,
  className,
}: FileCardTypeIconProps) {
  const ctx = useFileCardContext();
  const file = fileProp ?? ctx.file;
  const category = getFileCategory(file.type);
  const Icon = CATEGORY_ICON[category];
  return (
    <Icon className={cn("h-4 w-4", CATEGORY_CLASS[category], className)} />
  );
}
FileCardTypeIcon.displayName = "FileCardTypeIcon";

// ---------------------------------------------------------------------------
// Status icon – adapts to upload status (exported, usable standalone)
// ---------------------------------------------------------------------------

export interface FileCardStatusIconProps {
  className?: string;
  /** Override the status (defaults to context status) */
  status?: UploadStatus;
}

/** Colored icon matching the current upload status. */
export function FileCardStatusIcon({
  status: statusProp,
  className,
}: FileCardStatusIconProps) {
  const ctx = useFileCardContext();
  const status = statusProp ?? ctx.status;

  if (status === "pending") {
    return (
      <Loader2
        className={cn(
          "h-3.5 w-3.5 animate-spin text-muted-foreground",
          className
        )}
      />
    );
  }
  if (status === "error") {
    return (
      <AlertCircle className={cn("h-3.5 w-3.5 text-destructive", className)} />
    );
  }
  return (
    <CheckCircle2 className={cn("h-3.5 w-3.5 text-emerald-500", className)} />
  );
}
FileCardStatusIcon.displayName = "FileCardStatusIcon";

// ---------------------------------------------------------------------------
// Status text – inline "<icon> Uploading / Completed / Failed" label
// ---------------------------------------------------------------------------

const STATUS_LABEL: Record<UploadStatus, string> = {
  pending: "Uploading",
  success: "Completed",
  error: "Failed",
};

export interface FileCardStatusTextProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Custom label overrides */
  labels?: Partial<Record<UploadStatus, string>>;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Inline `<StatusIcon> Uploading / Completed / Failed` label.
 * Designed to sit next to `<FileCardFileSize>` in a metadata row.
 *
 * @example
 * ```tsx
 * <span className="flex items-center gap-1.5">
 *   <FileCardFileSize />
 *   <span className="text-muted-foreground">·</span>
 *   <FileCardStatusText />
 * </span>
 * ```
 */
export function FileCardStatusText({
  className,
  labels,
  ref,
  ...props
}: FileCardStatusTextProps) {
  const { status } = useFileCardContext();
  const label = labels?.[status] ?? STATUS_LABEL[status];

  return (
    <span
      ref={ref}
      {...props}
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        status === "pending" && "text-muted-foreground",
        status === "success" && "text-emerald-500",
        status === "error" && "text-destructive",
        className
      )}
    >
      <FileCardStatusIcon />
      {label}
    </span>
  );
}
FileCardStatusText.displayName = "FileCardStatusText";

// ---------------------------------------------------------------------------
// Info – filename + size/error (the classic single-block subcomponent)
// ---------------------------------------------------------------------------

export interface FileCardInfoProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum characters before the filename is truncated with an ellipsis */
  maxNameLength?: number;
  ref?: Ref<HTMLDivElement>;
}

/** Shows the file name (truncated if long) and formatted size or error text. */
export function FileCardInfo({
  className,
  maxNameLength = 28,
  ref,
  ...props
}: FileCardInfoProps) {
  const { file, status, error } = useFileCardContext();

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
// File name – standalone composable piece
// ---------------------------------------------------------------------------

export interface FileCardFileNameProps extends HTMLAttributes<HTMLSpanElement> {
  maxLength?: number;
  ref?: Ref<HTMLSpanElement>;
}

/** Renders just the filename, truncated if long. */
export function FileCardFileName({
  className,
  maxLength = 28,
  ref,
  ...props
}: FileCardFileNameProps) {
  const { file } = useFileCardContext();
  const displayName = useMemo(
    () => truncateFileName(file.name, maxLength),
    [file.name, maxLength]
  );
  return (
    <span
      ref={ref}
      title={file.name}
      {...props}
      className={cn("truncate font-medium text-sm", className)}
    >
      {displayName}
    </span>
  );
}
FileCardFileName.displayName = "FileCardFileName";

// ---------------------------------------------------------------------------
// File size – standalone composable piece
// ---------------------------------------------------------------------------

export interface FileCardFileSizeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

/** Renders just the formatted file size. */
export function FileCardFileSize({
  className,
  ref,
  ...props
}: FileCardFileSizeProps) {
  const { file } = useFileCardContext();
  const displaySize = useMemo(() => formatBytes(file.size), [file.size]);
  return (
    <span
      ref={ref}
      {...props}
      className={cn("text-muted-foreground text-xs", className)}
    >
      {displaySize}
    </span>
  );
}
FileCardFileSize.displayName = "FileCardFileSize";

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export interface FileCardProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

const progressAriaText: Record<UploadStatus, string> = {
  pending: "indeterminate",
  success: "100%",
  error: "error",
};

/**
 * Progress bar. Uses `progress` (0–100) from context for a real fill when
 * provided, otherwise animates as indeterminate. Hidden automatically when
 * status is "success".
 */
export function FileCardProgress({
  className,
  ref,
  ...props
}: FileCardProgressProps) {
  const { status, progress } = useFileCardContext();
  const hasRealProgress = typeof progress === "number";

  if (status === "success") {
    return null;
  }

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={hasRealProgress ? progress : undefined}
      aria-valuetext={progressAriaText[status]}
      ref={ref}
      role="progressbar"
      {...props}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          !hasRealProgress && "w-full animate-pulse bg-primary/60",
          hasRealProgress && "bg-primary",
          status === "error" && "bg-destructive opacity-70"
        )}
        style={hasRealProgress ? { width: `${progress}%` } : undefined}
      />
    </div>
  );
}
FileCardProgress.displayName = "FileCardProgress";

// ---------------------------------------------------------------------------
// Action buttons
// ---------------------------------------------------------------------------

export type FileCardActionButtonProps = ComponentProps<typeof Button>;

/** Retry button. Calls `onRetry` from context when clicked. */
export function FileCardRetryButton({
  children,
  onClick,
  ...props
}: FileCardActionButtonProps) {
  const { onRetry } = useFileCardContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onRetry?.();
      }
    },
    [onRetry, onClick]
  );

  return (
    <Button
      aria-label="Retry upload"
      onClick={handleClick}
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

/** Remove/cancel button. Calls `onRemove` from context when clicked. */
export function FileCardRemoveButton({
  children,
  onClick,
  ...props
}: FileCardActionButtonProps) {
  const { onRemove, status } = useFileCardContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onRemove?.();
      }
    },
    [onRemove, onClick]
  );

  return (
    <Button
      aria-label="Remove file"
      onClick={handleClick}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? (
        <X
          className={cn("h-4 w-4", status === "error" && "text-destructive")}
        />
      )}
    </Button>
  );
}
FileCardRemoveButton.displayName = "FileCardRemoveButton";

// ---------------------------------------------------------------------------
// Copy URL button – for success state
// ---------------------------------------------------------------------------

export interface FileCardCopyButtonProps extends FileCardActionButtonProps {
  /** URL to copy. Defaults to `result` from context when it's a string. */
  url?: string;
}

/**
 * Copies the uploaded file URL to clipboard with a brief visual confirmation.
 * Renders nothing if no URL is available.
 */
export function FileCardCopyButton({
  url: urlProp,
  children,
  onClick,
  ...props
}: FileCardCopyButtonProps) {
  const { result } = useFileCardContext();
  const [copied, setCopied] = useState(false);

  const url = urlProp ?? (typeof result === "string" ? result : undefined);

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || !url) {
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [url, onClick]
  );

  if (!url) {
    return null;
  }

  return (
    <Button
      aria-label={copied ? "Copied!" : "Copy URL"}
      onClick={handleClick}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ??
        (copied ? (
          <ClipboardCheck className="h-4 w-4 text-emerald-500" />
        ) : (
          <Clipboard className="h-4 w-4" />
        ))}
    </Button>
  );
}
FileCardCopyButton.displayName = "FileCardCopyButton";

// ---------------------------------------------------------------------------
// Download button – for success state
// ---------------------------------------------------------------------------

export interface FileCardDownloadButtonProps
  extends Omit<FileCardActionButtonProps, "asChild"> {
  /** Filename for the downloaded file. Defaults to the original file name. */
  downloadName?: string;
  /** URL to download. Defaults to `result` from context when it's a string. */
  url?: string;
}

/**
 * A download anchor styled as an icon button.
 * Renders nothing if no URL is available.
 */
export function FileCardDownloadButton({
  url: urlProp,
  downloadName,
  children,
  className,
  ...props
}: FileCardDownloadButtonProps) {
  const { result, file } = useFileCardContext();
  const url = urlProp ?? (typeof result === "string" ? result : undefined);

  if (!url) {
    return null;
  }

  return (
    <Button
      aria-label="Download file"
      asChild
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      <a
        className={className}
        download={downloadName ?? file.name}
        href={url}
        rel="noopener noreferrer"
      >
        {children ?? <Download className="h-4 w-4" />}
      </a>
    </Button>
  );
}
FileCardDownloadButton.displayName = "FileCardDownloadButton";

// ---------------------------------------------------------------------------
// FileCardActions – convenience wrapper for retry + remove
// ---------------------------------------------------------------------------

export interface FileCardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Extra actions rendered after retry/remove — e.g. `<FileCardCopyButton />`
   * or `<FileCardDownloadButton />` once the upload succeeds.
   */
  children?: ReactNode;
  /** Hide the remove button */
  hideRemove?: boolean;
  /** Hide the retry button even when the file has errored */
  hideRetry?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Convenience wrapper that renders retry (on error, when canRetry is true)
 * and remove buttons. Pass `children` to append extra actions.
 *
 * @example
 * ```tsx
 * <FileCardActions>
 *   <FileCardCopyButton />
 *   <FileCardDownloadButton />
 * </FileCardActions>
 * ```
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
