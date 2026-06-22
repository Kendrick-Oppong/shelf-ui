# Shelf UI

<div align="center">

![Shelf UI Hero](https://shelf-ui.vercel.app/opengraph-image)

**The file UI library your app deserves.**

Copy-paste components for the complete file experience — upload, preview, manage, navigate.
Built on React 19, Tailwind CSS v4, and your choice of Radix UI or Base UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

[Documentation](https://shelf-ui.vercel.app/docs) · [Components](https://shelf-ui.vercel.app/docs/uploads/dropzone) · [Changelog](https://shelf-ui.vercel.app/changelog)

</div>

---

## What is Shelf UI?

Shelf UI is an open-source component library built on the [shadcn registry](https://ui.shadcn.com/docs/registry) model. It covers the entire file experience — from the drag-and-drop zone to the file tree — with first-class integrations for Supabase Storage, AWS S3, and Cloudinary.

Think of it as **shadcn/ui, purpose-built for file UIs.**

- **Copy-paste ownership** — components live in your codebase, not in `node_modules`
- **Dual primitive support** — pick Radix UI or Base UI at init, switch anytime
- **Storage adapters built in** — Supabase, S3, Cloudinary out of the box
- **Headless hooks included** — use the UI layer or go fully headless
- **Shadcn registry native** — install with a single CLI command

## Components

### Upload

| Component | Status | Description |
| --- | --- | --- |
| `Dropzone` | ✅ Available | Drag-and-drop zone with upload state, validation, and retry. Ships with layout examples for avatar, grid, trigger-only, and batch queue patterns. |

### Preview & Display

| Component | Status | Description |
| --- | --- | --- |
| `FileCard` | ✅ Available | Composable upload-status row with preview, info, progress, and actions. |
| `Patterns` | ✅ Available | Composition recipes built from Dropzone and FileCard — no new components needed. |
| `AttachmentChip` | 🔜 Soon | Compact inline pill for displaying a file attachment (chat/email style). |

### Management

| Component | Status | Description |
| --- | --- | --- |
| `FileTree` | 🔜 Soon | Recursive folder/file browser with expand/collapse and keyboard navigation. |
| `FileBreadcrumb` | 🔜 Soon | Path navigation bar for folder hierarchies. |

### Storage Adapters

| Adapter | Status |
| --- | --- |
| Supabase Storage | ✅ Available |
| AWS S3 | ✅ Available |
| Cloudinary | ✅ Available |

## Getting Started

### Prerequisites

- React 19+
- Tailwind CSS v4
- TypeScript
- shadcn/ui initialized — run `npx shadcn@latest init` if not set up

### Add the registry

Add Shelf UI to your `components.json`:

```json
{
  "registries": {
    "@shelf-ui": "https://shelf-ui.vercel.app/r/{name}.json"
  }
}
```

### Install a component

```bash
# npm
npx shadcn@latest add @shelf-ui/dropzone

# pnpm
pnpm dlx shadcn@latest add @shelf-ui/dropzone

# yarn
yarn dlx shadcn@latest add @shelf-ui/dropzone

# bun
bunx shadcn@latest add @shelf-ui/dropzone
```

### Usage

```tsx
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  useDropzone,
} from "@/components/shelf-ui/dropzone"
import { FileCard, FileCardInfo, FileCardActions, FileCardProgress } from "@/components/shelf-ui/file-card"

export default function UploadPage() {
  const dropzone = useDropzone({
    onDropFile: async (file) => {
      // upload to your storage provider
      const url = await uploadToS3(file)
      return { status: "success", result: url }
    },
    validation: { maxFiles: 10, maxSize: 10 * 1024 * 1024 },
  })

  return (
    <div>
      <Dropzone {...dropzone}>
        <DropZoneArea>
          <DropzoneTrigger>Drop files here or click to browse</DropzoneTrigger>
        </DropZoneArea>
      </Dropzone>

      {dropzone.fileStatuses.map((status) => (
        <FileCard
          key={status.id}
          fileStatus={status}
          onRemove={() => dropzone.onRemove(status.id)}
          onRetry={() => dropzone.onRetry(status.id)}
          canRetry={dropzone.canRetry(status.id)}
        >
          <div className="flex w-full items-center gap-3">
            <FileCardInfo />
            <FileCardActions />
          </div>
          <FileCardProgress />
        </FileCard>
      ))}
    </div>
  )
}
```

See [the docs](https://shelf-ui.vercel.app/docs) for all components, props, and examples.

## Storage Adapters

Shelf UI includes adapter guides for three storage providers:

- **[Supabase Storage](https://shelf-ui.vercel.app/docs/adapters/supabase)** — `supabase.storage.from(bucket).upload()`
- **[AWS S3](https://shelf-ui.vercel.app/docs/adapters/aws-s3)** — presigned URL upload via `fetch`
- **[Cloudinary](https://shelf-ui.vercel.app/docs/adapters/cloudinary)** — unsigned upload preset

Each adapter guide shows the exact `onDropFile` handler to pass to `useDropzone`.

## Contributing

Contributions are welcome. Please read the [contributing guide](CONTRIBUTING.md) before opening a pull request.

```bash
git clone https://github.com/kendrickoppong/shelf-ui.git
cd shelf-ui
pnpm install
pnpm dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow — how to add a component, run the registry build, write docs, and submit a changeset.

## Local Development

```bash
pnpm dev          # Start the docs site
pnpm check        # Lint with Ultracite/Biome
pnpm typecheck    # TypeScript
pnpm registry:build   # Build registry JSON
pnpm registry:check   # Validate registry output
```

## License

MIT — built by [Kendrick Oppong](https://github.com/kendrickoppong)
