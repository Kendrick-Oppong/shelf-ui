"use client";

import {
  type ButtonHTMLAttributes,
  cloneElement,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  type FileRejection,
  useDropzone as useReactDropzone,
} from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UploadStatus = "pending" | "success" | "error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: any is used for flexible generics
export interface FileStatus<TResult = any, TError = any> {
  error?: TError;
  file: File;
  id: string;
  result?: TResult;
  status: UploadStatus;
  tries: number;
}

export interface UseDropzoneOptions<TResult, TError> {
  /** Automatically retry failed uploads */
  autoRetry?: boolean;
  /** Maximum number of retry attempts */
  maxRetryCount?: number;
  /** Called when all pending/uploading files are finished (success or error) */
  onAllUploaded?: () => void;
  /** Async upload handler – must return { status, result } or { status: "error", error } */
  onDropFile: (
    file: File
  ) => Promise<
    { status: "success"; result: TResult } | { status: "error"; error: TError }
  >;
  /** Called when a single file upload succeeds */
  onFileUploaded?: (result: TResult, fileId: string) => void;
  /** Called when a root validation error occurs */
  onRootError?: (error: string) => void;
  /** Format raw error objects into user-friendly strings */
  shapeUploadError?: (error: TError) => string;
  /** When maxFiles is exceeded, remove oldest files instead of showing an error */
  shiftOnMaxFiles?: boolean;
  /** Validation rules (same as react-dropzone) */
  validation?: {
    accept?: Record<string, string[]>;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action<TResult, TError> =
  | { type: "ADD_FILES"; files: Array<{ id: string; file: File }> }
  | { type: "REMOVE_FILE"; id: string }
  | { type: "SET_PENDING"; id: string }
  | { type: "SET_SUCCESS"; id: string; result: TResult }
  | { type: "SET_ERROR"; id: string; error: TError }
  | { type: "CLEAR_ALL" };

function fileStatusReducer<TResult, TError>(
  state: FileStatus<TResult, TError>[],
  action: Action<TResult, TError>
): FileStatus<TResult, TError>[] {
  switch (action.type) {
    case "ADD_FILES":
      return [
        ...state,
        ...action.files.map(({ id, file }) => ({
          id,
          file,
          status: "pending" as const,
          tries: 0,
        })),
      ];
    case "REMOVE_FILE":
      return state.filter((f) => f.id !== action.id);
    case "SET_PENDING":
      return state.map((f) =>
        f.id === action.id ? { ...f, status: "pending" as const } : f
      );
    case "SET_SUCCESS":
      return state.map((f) =>
        f.id === action.id
          ? { ...f, status: "success" as const, result: action.result }
          : f
      );
    case "SET_ERROR":
      return state.map((f) =>
        f.id === action.id
          ? {
              ...f,
              status: "error" as const,
              error: action.error,
              tries: f.tries + 1,
            }
          : f
      );
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function formatRejectionError(
  error: FileRejection["errors"][0],
  maxSize?: number
): string {
  if (error.code === "file-too-large") {
    const maxSizeMB = maxSize ? (maxSize / 1024 / 1024).toFixed(1) : "unknown";
    return `File too large. Max size: ${maxSizeMB}MB.`;
  }
  if (error.code === "file-invalid-type") {
    return "File type not allowed.";
  }
  return error.message;
}

function removeOldestFiles(
  currentFiles: FileStatus[],
  acceptedCount: number,
  maxFiles: number
): string[] {
  const overflow = currentFiles.length + acceptedCount - maxFiles;
  if (overflow <= 0) {
    return [];
  }
  return currentFiles.slice(0, overflow).map((f) => f.id);
}

// ---------------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: any is the default generic
export function useDropzone<TResult = any, TError = any>({
  onDropFile,
  validation = {},
  autoRetry = false,
  maxRetryCount = 3,
  shiftOnMaxFiles = false,
  shapeUploadError = String,
  onRootError,
  onFileUploaded,
  onAllUploaded,
}: UseDropzoneOptions<TResult, TError>) {
  const [fileStatuses, dispatch] = useReducer(
    fileStatusReducer<TResult, TError>,
    []
  );
  const [rootError, setRootError] = useState<string | undefined>();

  // Ref to always read current fileStatuses inside callbacks without
  // causing stale closures or unnecessary re-creations of uploadFile/handleDrop.
  const fileStatusesRef = useRef(fileStatuses);
  useEffect(() => {
    fileStatusesRef.current = fileStatuses;
  }, [fileStatuses]);

  // Tracks in-flight uploads to prevent duplicate uploads for the same id.
  const uploadingRef = useRef<Set<string>>(new Set());

  // Fire onAllUploaded when every file has settled (success or error).
  // Uses an effect so we read committed state, not the mid-dispatch snapshot.
  useEffect(() => {
    if (fileStatuses.length === 0) {
      return;
    }
    const allSettled = fileStatuses.every((f) => f.status !== "pending");
    if (allSettled) {
      onAllUploaded?.();
    }
  }, [fileStatuses, onAllUploaded]);

  function shapeError<TError>(
    error: TError,
    shapeUploadError?: (e: TError) => string
  ): TError {
    return shapeUploadError
      ? (shapeUploadError(error) as unknown as TError)
      : error;
  }

  function scheduleRetry<TError>(
    id: string,
    file: File,
    fileStatusesRef: React.RefObject<FileStatus<unknown, TError>[]>,
    maxRetryCount: number,
    uploadFile: (id: string, file: File) => Promise<void>
  ) {
    const current = fileStatusesRef.current.find((f) => f.id === id);
    if (current && current.tries < maxRetryCount) {
      setTimeout(() => uploadFile(id, file), 1000 * (current.tries + 1));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // biome-ignore lint/correctness/useExhaustiveDependencies: shapeError and scheduleRetry are stable module-level functions
  const uploadFile = useCallback(
    async (id: string, file: File) => {
      if (uploadingRef.current.has(id)) {
        return;
      }

      uploadingRef.current.add(id);
      dispatch({ type: "SET_PENDING", id });

      try {
        const result = await onDropFile(file);

        if (result.status === "success") {
          dispatch({ type: "SET_SUCCESS", id, result: result.result });
          onFileUploaded?.(result.result, id);
          return;
        }

        // Error path from a returned { status: "error" } (not a thrown exception)
        dispatch({
          type: "SET_ERROR",
          id,
          error: shapeError(result.error, shapeUploadError),
        });
        if (autoRetry) {
          scheduleRetry(id, file, fileStatusesRef, maxRetryCount, uploadFile);
        }
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          id,
          error: shapeError(err as TError, shapeUploadError),
        });
        if (autoRetry) {
          scheduleRetry(id, file, fileStatusesRef, maxRetryCount, uploadFile);
        }
      } finally {
        uploadingRef.current.delete(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDropFile, autoRetry, maxRetryCount, onFileUploaded, shapeUploadError]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setRootError(undefined);

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        const message = formatRejectionError(firstError, validation.maxSize);
        setRootError(message);
        onRootError?.(message);
        return;
      }

      // Read current statuses from ref, not captured closure value.
      const currentStatuses = fileStatusesRef.current;

      if (shiftOnMaxFiles && validation.maxFiles) {
        const idsToRemove = removeOldestFiles(
          currentStatuses,
          acceptedFiles.length,
          validation.maxFiles
        );
        for (const id of idsToRemove) {
          dispatch({ type: "REMOVE_FILE", id });
        }
      } else if (
        validation.maxFiles &&
        currentStatuses.length + acceptedFiles.length > validation.maxFiles
      ) {
        const msg = `Maximum ${validation.maxFiles} files allowed.`;
        setRootError(msg);
        onRootError?.(msg);
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${file.name}-${Math.random()}`,
        file,
      }));
      dispatch({ type: "ADD_FILES", files: newFiles });

      for (const { id, file } of newFiles) {
        uploadFile(id, file);
      }
    },
    [validation, shiftOnMaxFiles, onRootError, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useReactDropzone({
    onDrop: handleDrop,
    accept: validation.accept,
    minSize: validation.minSize,
    maxSize: validation.maxSize,
    maxFiles: validation.maxFiles,
  });

  const onRemove = useCallback((id: string) => {
    dispatch({ type: "REMOVE_FILE", id });
  }, []);

  const onRetry = useCallback(
    (id: string) => {
      // Read from ref so we always get the latest file list.
      const file = fileStatusesRef.current.find((f) => f.id === id);
      if (file && file.status === "error") {
        uploadFile(id, file.file);
      }
    },
    [uploadFile]
  );

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const canRetry = useCallback(
    (id: string) => {
      const file = fileStatusesRef.current.find((f) => f.id === id);
      return file ? file.tries < maxRetryCount : false;
    },
    [maxRetryCount]
  );

  return {
    fileStatuses,
    isDragActive,
    isInvalid: !!rootError,
    rootError,
    getRootProps,
    getInputProps,
    onRemove,
    onRetry,
    clearAll,
    canRetry,
    shapeUploadError,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DropzoneContext = createContext<ReturnType<typeof useDropzone> | null>(
  null
);

export const Dropzone = ({
  children,
  ...hookReturn
}: ReturnType<typeof useDropzone> & { children: ReactNode }) => (
  <DropzoneContext.Provider value={hookReturn}>
    {children}
  </DropzoneContext.Provider>
);
Dropzone.displayName = "Dropzone";

const useDropzoneContext = () => {
  const ctx = useContext(DropzoneContext);
  if (!ctx) {
    throw new Error("Dropzone subcomponents must be used within <Dropzone>");
  }
  return ctx;
};

// ---------------------------------------------------------------------------
// Subcomponents
// Supports both Radix UI (asChild) and Base UI (render prop) patterns.
// ---------------------------------------------------------------------------

export interface DropZoneAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Radix UI pattern: replace the rendered element with a child component */
  asChild?: boolean;
  ref?: Ref<HTMLDivElement>;
  /**
   * Base UI pattern: render using a function that receives merged props,
   * or pass a React element to clone with merged props.
   *
   * @example Function form
   * ```tsx
   * <DropZoneArea render={(props) => <div {...props}>Drop here</div>} />
   * ```
   *
   * @example Element form
   * ```tsx
   * <DropZoneArea render={<div />}>Drop here</DropZoneArea>
   * ```
   */
  render?:
    | ReactNode
    | ((
        props: HTMLAttributes<HTMLDivElement> & {
          ref?: Ref<HTMLDivElement>;
        }
      ) => ReactNode);
}

export function DropZoneArea({
  className,
  children,
  asChild,
  render,
  ref,
  ...props
}: DropZoneAreaProps) {
  const { getRootProps, isDragActive, isInvalid } = useDropzoneContext();
  const rootProps = getRootProps({
    className: cn(
      "relative cursor-pointer rounded-lg border-2 border-dashed transition-colors",
      isDragActive && "border-primary bg-primary/5",
      isInvalid && "border-destructive bg-destructive/5",
      className
    ),
    ...props,
  });

  // 1. Base UI render prop – function form
  if (typeof render === "function") {
    return render({ ...rootProps, ref });
  }

  // 2. Base UI render prop – element form
  if (render && isValidElement(render)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: flexible child element types
    return cloneElement(render as ReactElement<any>, rootProps);
  }

  // 3. Radix UI asChild pattern
  if (asChild && isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // biome-ignore lint/suspicious/noExplicitAny: flexible child element types
    const child = children as ReactElement<any>;
    return cloneElement(child, rootProps);
  }

  // 4. Default: plain div
  return (
    <div ref={ref} {...rootProps}>
      {children}
    </div>
  );
}
DropZoneArea.displayName = "DropZoneArea";

export function DropzoneTrigger({
  className,
  children,
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
}) {
  const { getInputProps } = useDropzoneContext();
  return (
    <Button
      className={cn("cursor-pointer", className)}
      ref={ref}
      type="button"
      {...props}
    >
      <input {...getInputProps()} />
      {children}
    </Button>
  );
}
DropzoneTrigger.displayName = "DropzoneTrigger";

export function DropzoneMessage({
  className,
  children,
  ref,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  ref?: Ref<HTMLParagraphElement>;
}) {
  const { rootError } = useDropzoneContext();
  if (!(rootError || children)) {
    return null;
  }
  return (
    <p
      className={cn("text-destructive text-sm", className)}
      ref={ref}
      {...props}
    >
      {children ?? rootError}
    </p>
  );
}
DropzoneMessage.displayName = "DropzoneMessage";

export function DropzoneDescription({
  className,
  children,
  ref,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  ref?: Ref<HTMLParagraphElement>;
}) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
}
DropzoneDescription.displayName = "DropzoneDescription";
