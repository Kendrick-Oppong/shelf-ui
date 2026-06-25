/* eslint-disable react-refresh/only-export-components */
"use client";

import {
  type ButtonHTMLAttributes,
  cloneElement,
  createContext,
  type Dispatch,
  type HTMLAttributes,
  isValidElement,
  type MouseEvent,
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
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UploadStatus = "pending" | "success" | "error";

export interface FileStatus<TResult = unknown, TError = unknown> {
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
  /** Format react-dropzone validation rejections into user-friendly strings */
  shapeRejectionError?: (rejection: FileRejection) => string;
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
  | {
      // Atomically removes overflow (oldest-first) and adds new files in a
      // single state transition. This avoids the race that occurs when
      // "remove oldest" and "add new" are dispatched as two separate actions
      type: "ADD_FILES_WITH_SHIFT";
      files: Array<{ id: string; file: File }>;
      maxFiles: number;
    }
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
    case "ADD_FILES_WITH_SHIFT": {
      const incoming = action.files.map(({ id, file }) => ({
        id,
        file,
        status: "pending" as const,
        tries: 0,
      }));
      const combined = [...state, ...incoming];
      // Keep only the most recent maxFiles entries – drop oldest first.
      const overflow = combined.length - action.maxFiles;
      return overflow > 0 ? combined.slice(overflow) : combined;
    }
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

// Pure, module-level helpers used inside the upload pipeline.
function shapeError<TError>(
  error: TError,
  shapeUploadError?: (e: TError) => string
): TError {
  return shapeUploadError
    ? (shapeUploadError(error) as unknown as TError)
    : error;
}

function getRetryDelay(tries: number): number {
  return 1000 * Math.max(tries, 1);
}

function scheduleRetry<TResult, TError>(
  id: string,
  file: File,
  fileStatusesRef: { current: FileStatus<TResult, TError>[] },
  maxRetryCount: number,
  isMountedRef: { current: boolean },
  pendingTimeoutsRef: { current: Set<ReturnType<typeof setTimeout>> },
  uploadFile: (id: string, file: File) => Promise<void>
) {
  const current = fileStatusesRef.current.find((f) => f.id === id);
  if (!(current && current.tries < maxRetryCount)) {
    return;
  }
  const timeoutId = setTimeout(() => {
    pendingTimeoutsRef.current.delete(timeoutId);
    const currentFile = fileStatusesRef.current.find((f) => f.id === id);
    // Guard against dispatching after teardown or retrying a removed file.
    if (
      isMountedRef.current &&
      currentFile?.status === "error" &&
      currentFile.tries < maxRetryCount
    ) {
      uploadFile(id, file);
    }
  }, getRetryDelay(current.tries));

  pendingTimeoutsRef.current.add(timeoutId);
  return timeoutId;
}

function clearRetryTimeouts(pendingTimeoutsRef: {
  current: Set<ReturnType<typeof setTimeout>>;
}) {
  for (const timeoutId of pendingTimeoutsRef.current) {
    clearTimeout(timeoutId);
  }
  pendingTimeoutsRef.current.clear();
}

function createFileId(file: File): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${file.name}-${Math.random()}`;
}

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Main Hook
// ---------------------------------------------------------------------------

export function useDropzone<TResult = unknown, TError = unknown>({
  onDropFile,
  validation = {},
  autoRetry = false,
  maxRetryCount = 3,
  shiftOnMaxFiles = false,
  shapeUploadError = String,
  shapeRejectionError,
  onRootError,
  onFileUploaded,
  onAllUploaded,
}: UseDropzoneOptions<TResult, TError>) {
  const [fileStatuses, baseDispatch] = useReducer(
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

  const dispatch = useCallback<Dispatch<Action<TResult, TError>>>((action) => {
    fileStatusesRef.current = fileStatusReducer(
      fileStatusesRef.current,
      action
    );
    baseDispatch(action);
  }, []);

  // Tracks in-flight uploads to prevent duplicate uploads for the same id.
  const uploadingRef = useRef<Set<string>>(new Set());

  // Break the recursive dependency for scheduleRetry
  const uploadFileRef = useRef<(id: string, file: File) => Promise<void>>(null);

  // Tracks whether the component is still mounted, so pending retry
  // timeouts can bail out instead of dispatching after teardown.
  const isMountedRef = useRef(true);
  const pendingTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set()
  );
  const wasAllSettledRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearRetryTimeouts(pendingTimeoutsRef);
    };
  }, []);

  // Fire onAllUploaded when every file has settled (success or error).
  // Uses an effect so we read committed state, not the mid-dispatch snapshot.
  useEffect(() => {
    if (fileStatuses.length === 0) {
      wasAllSettledRef.current = false;
      return;
    }
    const allSettled = fileStatuses.every((f) => f.status !== "pending");
    if (allSettled && !wasAllSettledRef.current) {
      onAllUploaded?.();
    }
    wasAllSettledRef.current = allSettled;
  }, [fileStatuses, onAllUploaded]);

  const uploadFile = useCallback(
    async (id: string, file: File) => {
      // Deduplication guard – prevents double-uploads if called twice for the same id.
      if (uploadingRef.current.has(id)) {
        return;
      }

      uploadingRef.current.add(id);
      dispatch({ type: "SET_PENDING", id });

      try {
        const result = await onDropFile(file);
        if (!fileStatusesRef.current.some((f) => f.id === id)) {
          return;
        }

        if (result.status === "success") {
          dispatch({ type: "SET_SUCCESS", id, result: result.result });
          if (fileStatusesRef.current.some((f) => f.id === id)) {
            onFileUploaded?.(result.result, id);
          }
          return;
        }

        // Error path from a returned { status: "error" } (not a thrown exception)
        dispatch({
          type: "SET_ERROR",
          id,
          error: shapeError(result.error, shapeUploadError),
        });
        if (autoRetry) {
          scheduleRetry(
            id,
            file,
            fileStatusesRef,
            maxRetryCount,
            isMountedRef,
            pendingTimeoutsRef,
            (retryId, retryFile) =>
              uploadFileRef.current?.(retryId, retryFile) ?? Promise.resolve()
          );
        }
      } catch (err) {
        if (!fileStatusesRef.current.some((f) => f.id === id)) {
          return;
        }
        dispatch({
          type: "SET_ERROR",
          id,
          error: shapeError(err as TError, shapeUploadError),
        });
        if (autoRetry) {
          scheduleRetry(
            id,
            file,
            fileStatusesRef,
            maxRetryCount,
            isMountedRef,
            pendingTimeoutsRef,
            (retryId, retryFile) =>
              uploadFileRef.current?.(retryId, retryFile) ?? Promise.resolve()
          );
        }
      } finally {
        uploadingRef.current.delete(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      onDropFile,
      autoRetry,
      maxRetryCount,
      onFileUploaded,
      shapeUploadError,
      dispatch,
    ]
  );

  // Keep ref in sync so scheduleRetry can call it
  useEffect(() => {
    uploadFileRef.current = uploadFile;
  }, [uploadFile]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setRootError(undefined);

      if (rejectedFiles.length > 0) {
        const firstRejection = rejectedFiles[0];
        const firstError = firstRejection.errors[0];
        const message =
          shapeRejectionError?.(firstRejection) ??
          formatRejectionError(firstError, validation.maxSize);
        setRootError(message);
        onRootError?.(message);
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        id: createFileId(file),
        file,
      }));

      if (shiftOnMaxFiles && validation.maxFiles) {
        // Single atomic dispatch – the reducer handles overflow removal and
        // insertion together
        dispatch({
          type: "ADD_FILES_WITH_SHIFT",
          files: newFiles,
          maxFiles: validation.maxFiles,
        });
      } else if (
        validation.maxFiles &&
        fileStatusesRef.current.length + acceptedFiles.length >
          validation.maxFiles
      ) {
        const msg = `Maximum ${validation.maxFiles} files allowed.`;
        setRootError(msg);
        onRootError?.(msg);
        return;
      } else {
        dispatch({ type: "ADD_FILES", files: newFiles });
      }

      for (const { id, file } of newFiles) {
        if (fileStatusesRef.current.some((status) => status.id === id)) {
          uploadFile(id, file);
        }
      }
    },
    [
      validation,
      shiftOnMaxFiles,
      onRootError,
      uploadFile,
      dispatch,
      shapeRejectionError,
    ]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useReactDropzone({
    onDrop: handleDrop,
    accept: validation.accept,
    minSize: validation.minSize,
    maxSize: validation.maxSize,
    maxFiles: shiftOnMaxFiles ? undefined : validation.maxFiles,
    noClick: true,
  });

  const onRemove = useCallback(
    (id: string) => {
      uploadingRef.current.delete(id);
      dispatch({ type: "REMOVE_FILE", id });
    },
    [dispatch]
  );

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
    clearRetryTimeouts(pendingTimeoutsRef);
    uploadingRef.current.clear();
    dispatch({ type: "CLEAR_ALL" });
    setRootError(undefined);
  }, [dispatch]);

  const canRetry = useCallback(
    (id: string) => {
      // Files not yet in state (or already removed) can't be retried.
      const file = fileStatusesRef.current.find((f) => f.id === id);
      return file ? file.tries < maxRetryCount : false;
    },
    [maxRetryCount]
  );

  const retryFailed = useCallback(() => {
    for (const file of fileStatusesRef.current) {
      if (file.status === "error" && file.tries < maxRetryCount) {
        uploadFile(file.id, file.file);
      }
    }
  }, [maxRetryCount, uploadFile]);

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
    open,
    retryFailed,
    removeFile: onRemove,
    retryFile: onRetry,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type DropzoneContextValue = ReturnType<
  typeof useDropzone<unknown, unknown>
>;

const DropzoneContext = createContext<DropzoneContextValue | null>(null);

export function Dropzone<TResult = unknown, TError = unknown>({
  children,
  ...hookReturn
}: ReturnType<typeof useDropzone<TResult, TError>> & { children: ReactNode }) {
  return (
    <DropzoneContext.Provider value={hookReturn}>
      {children}
    </DropzoneContext.Provider>
  );
}
Dropzone.displayName = "Dropzone";

export function DropzoneProvider({
  children,
  value,
}: Readonly<{
  children: ReactNode;
  value: DropzoneContextValue;
}>) {
  return (
    <DropzoneContext.Provider value={value}>
      {children}
    </DropzoneContext.Provider>
  );
}
DropzoneProvider.displayName = "DropzoneProvider";

export function useDropzoneContext() {
  const ctx = useContext(DropzoneContext);
  if (!ctx) {
    throw new Error("Dropzone subcomponents must be used within <Dropzone>");
  }
  return ctx;
}

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
}: Readonly<DropZoneAreaProps>) {
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
  const rootRef = (rootProps as { ref?: Ref<HTMLDivElement> }).ref;
  // eslint-disable-next-line react-hooks/refs
  const mergedRef = composeRefs(rootRef, ref);
  const areaProps = {
    ...rootProps,
    ref: mergedRef,
  };

  // 1. Base UI render prop – function form
  if (typeof render === "function") {
    return render(areaProps);
  }

  // 2. Base UI render prop – element form
  if (render && isValidElement(render)) {
    return cloneElement(render as ReactElement<unknown>, areaProps);
  }

  // 3. Radix UI asChild pattern
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<unknown>;
    return cloneElement(child, areaProps);
  }

  // 4. Default: plain div
  return <div {...areaProps}>{children}</div>;
}
DropZoneArea.displayName = "DropZoneArea";

export function DropzoneTrigger({
  className,
  children,
  disabled,
  onClick,
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
}) {
  const { getInputProps, open } = useDropzoneContext();
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      event.stopPropagation();
      open();
    },
    [disabled, onClick, open]
  );

  return (
    <>
      <input {...getInputProps()} />
      <button
        className={cn("cursor-pointer", className)}
        disabled={disabled}
        onClick={handleClick}
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </button>
    </>
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
