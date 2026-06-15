# Shelf UI — AI Coding Skill

> A shadcn-style file UI component library. Copy-paste components for the complete file experience — upload, preview, manage, navigate — with first-class Supabase, S3, and Cloudinary support.

## Key facts

- Components are **not installed as packages** — they are copied into your project via the shadcn CLI
- Every interactive component has two implementations: **Radix UI** and **Base UI** — the API is identical for both
- Every component ships with its underlying **headless hook** — use it to build fully custom UIs
- Uses **CSS custom properties** for all theming — same tokens as shadcn/ui
- Registry URL pattern: `https://shelf-ui.vercel.app/r/{component-name}.json`

## Install a component

```bash
# npm
npx shadcn@latest add @shelf-ui/{component-name}

# pnpm
pnpm dlx shadcn@latest add @shelf-ui/{component-name}

# yarn
yarn dlx shadcn@latest add @shelf-ui/{component-name}

# bun
bunx shadcn@latest add @shelf-ui/{component-name}
```

Components are copied to `components/shelf-ui/`. Hooks go to `hooks/`.

## Component reference

### Upload

| Component | Install | Description |
|---|---|---|
| `Dropzone` | `@shelf-ui/dropzone` | Drag & drop upload zone, single/multi file, accept filtering, error states |
| `FileInput` | `@shelf-ui/file-input` | Button-triggered minimal file input |
| `AvatarUpload` | `@shelf-ui/avatar-upload` | Circular crop + preview upload |
| `CoverUpload` | `@shelf-ui/cover-upload` | Banner/header image upload |
| `GalleryUpload` | `@shelf-ui/gallery-upload` | Multi-image upload with drag-to-reorder |
| `AttachmentButton` | `@shelf-ui/attachment-button` | Inline attach trigger (like Gmail, Notion) |

### Preview & Display

| Component | Install | Description |
|---|---|---|
| `FileCard` | `@shelf-ui/file-card` | Smart preview card — image thumb, PDF icon, video frame, archive |
| `FileGrid` | `@shelf-ui/file-grid` | Grid layout with thumbnails and hover actions |
| `FileList` | `@shelf-ui/file-list` | Stacked list — name, size, date, actions |
| `FileTable` | `@shelf-ui/file-table` | Full table with sortable columns |
| `AttachmentChip` | `@shelf-ui/attachment-chip` | Inline pill with icon + filename + remove |
| `FileIcon` | `@shelf-ui/file-icon` | Correct icon per file extension |
| `ImagePreview` | `@shelf-ui/image-preview` | Lightbox image viewer with zoom |
| `PDFPreview` | `@shelf-ui/pdf-preview` | Inline embedded PDF viewer |
| `VideoPreview` | `@shelf-ui/video-preview` | Inline video player card |

### File Management

| Component | Install | Description |
|---|---|---|
| `FileTree` | `@shelf-ui/file-tree` | Recursive folder/file browser with expand/collapse |
| `FileBreadcrumb` | `@shelf-ui/file-breadcrumb` | Path navigation bar |
| `FolderCard` | `@shelf-ui/folder-card` | Folder with item count |
| `FileContextMenu` | `@shelf-ui/file-context-menu` | Right-click: rename, delete, move, copy link, download |
| `BulkSelectBar` | `@shelf-ui/bulk-select-bar` | Floating action bar when files are selected |
| `FileSearch` | `@shelf-ui/file-search` | Searchable + filterable file list |
| `FileEmptyState` | `@shelf-ui/file-empty-state` | Empty state with upload CTA |

### Upload State & Feedback

| Component | Install | Description |
|---|---|---|
| `UploadProgress` | `@shelf-ui/upload-progress` | Per-file progress bar with cancel |
| `UploadQueue` | `@shelf-ui/upload-queue` | Queue UI — pending, uploading, done, failed |
| `UploadToast` | `@shelf-ui/upload-toast` | Notification for background uploads |
| `StorageQuota` | `@shelf-ui/storage-quota` | Used/total bar with breakdown by type |

## Headless hooks

| Hook | Description |
|---|---|
| `useFileUpload` | Drag, drop, validate, generate previews, manage errors |
| `useUploadQueue` | Concurrency-controlled upload queue |
| `useFileTree` | Recursive directory state with expand/collapse |
| `useFilePreview` | Generate preview URLs per file type |
| `useStorageProvider` | Unified adapter interface: Supabase, S3, Cloudinary |

## Storage adapters

### Supabase Storage

```tsx
import { useStorageProvider } from "@/hooks/use-storage-provider";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const adapter = useStorageProvider("supabase", {
  client: supabase,
  bucket: "uploads",
  // optional: folder prefix
  path: "user-123/",
});
```

### AWS S3

```tsx
const adapter = useStorageProvider("s3", {
  region: "us-east-1",
  bucket: "my-bucket",
  // presigned URL endpoint on your server
  presignUrl: "/api/s3/presign",
});
```

### Cloudinary

```tsx
const adapter = useStorageProvider("cloudinary", {
  cloudName: "my-cloud",
  uploadPreset: "my-preset",
});
```

## Common patterns

### Dropzone with upload queue

```tsx
import { Dropzone } from "@/components/shelf-ui/dropzone";
import { UploadQueue } from "@/components/shelf-ui/upload-queue";
import { useUploadQueue } from "@/hooks/use-upload-queue";
import { useStorageProvider } from "@/hooks/use-storage-provider";

export function FileUploadSection() {
  const adapter = useStorageProvider("supabase", { client, bucket: "uploads" });
  const { queue, add, cancel } = useUploadQueue({ adapter, concurrency: 3 });

  return (
    <div className="space-y-4">
      <Dropzone
        accept={["image/*", ".pdf"]}
        maxSize={10_000_000}
        onDrop={(files) => add(files)}
      />
      <UploadQueue items={queue} onCancel={cancel} />
    </div>
  );
}
```

### File manager with tree + breadcrumb + grid

```tsx
import { FileTree } from "@/components/shelf-ui/file-tree";
import { FileBreadcrumb } from "@/components/shelf-ui/file-breadcrumb";
import { FileGrid } from "@/components/shelf-ui/file-grid";
import { useFileTree } from "@/hooks/use-file-tree";

export function FileManager({ files }) {
  const { tree, path, navigate, expand } = useFileTree(files);

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r">
        <FileTree tree={tree} onExpand={expand} onNavigate={navigate} />
      </aside>
      <main className="flex-1 p-4">
        <FileBreadcrumb path={path} onNavigate={navigate} />
        <FileGrid files={tree.current.children} className="mt-4" />
      </main>
    </div>
  );
}
```

## Props — key components

### Dropzone

| Prop | Type | Default | Description |
|---|---|---|---|
| `accept` | `string[]` | `undefined` | Accepted MIME types or file extensions |
| `maxSize` | `number` | `undefined` | Max file size in bytes |
| `maxFiles` | `number` | `undefined` | Max number of files |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disable the zone |
| `onDrop` | `(files: File[]) => void` | required | Called with accepted files |
| `onReject` | `(files: FileRejection[]) => void` | `undefined` | Called with rejected files |

### FileCard

| Prop | Type | Default | Description |
|---|---|---|---|
| `file` | `File \| StorageFile` | required | File object to display |
| `showActions` | `boolean` | `true` | Show action buttons on hover |
| `onDelete` | `() => void` | `undefined` | Delete handler |
| `onDownload` | `() => void` | `undefined` | Download handler |

## Docs

Full documentation: https://shelf-ui.vercel.app/docs  
Registry: https://shelf-ui.vercel.app/r  
GitHub: https://github.com/Kendrick-Oppong/shelf-ui
