# Shelf UI

<div align="center">

<!-- Replace with screenshot once site is live -->
<!-- ![Shelf UI Hero](https://shelf-ui.vercel.app/og.png) -->

**The file UI library your app deserves.**

Copy-paste components for the complete file experience — upload, preview, manage, navigate.
Built on React 19, Tailwind CSS v4, and your choice of Radix UI or Base UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

[Documentation](https://shelf-ui.vercel.app/docs) · [Components](https://shelf-ui.vercel.app/docs/components) · [Changelog](https://shelf-ui.vercel.app/changelog)

</div>

---

## What is Shelf UI?

Shelf UI is an open-source component library built on the [shadcn registry](https://ui.shadcn.com/docs/registry) model. It covers the entire file experience — from the dropzone to the file tree — with first-class integrations for Supabase Storage, AWS S3, and Cloudinary.

Think of it as **shadcn/ui, purpose-built for file UIs.**

- **Copy-paste ownership** — components live in your codebase, not in `node_modules`
- **Dual primitive support** — pick Radix UI or Base UI at init, switch anytime
- **Storage adapters built in** — Supabase, S3, Cloudinary out of the box
- **Headless hooks included** — use the UI layer or go fully headless
- **Shadcn registry native** — install with a single CLI command

## Components

| Component | Category |
| --- | --- |
| `Dropzone` | Upload |
| `FileInput` | Upload |
| `AvatarUpload` | Upload |
| `CoverUpload` | Upload |
| `GalleryUpload` | Upload |
| `AttachmentButton` | Upload |
| `FileCard` | Preview & Display |
| `FileGrid` | Preview & Display |
| `FileList` | Preview & Display |
| `FileTable` | Preview & Display |
| `AttachmentChip` | Preview & Display |
| `FileIcon` | Preview & Display |
| `ImagePreview` | Preview & Display |
| `PDFPreview` | Preview & Display |
| `VideoPreview` | Preview & Display |
| `FileTree` | Management |
| `FileBreadcrumb` | Management |
| `FolderCard` | Management |
| `FileContextMenu` | Management |
| `BulkSelectBar` | Management |
| `FileSearch` | Management |
| `FileEmptyState` | Management |
| `UploadProgress` | Feedback |
| `UploadQueue` | Feedback |
| `UploadToast` | Feedback |
| `StorageQuota` | Feedback |

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
import { Dropzone } from "@/components/shelf-ui/dropzone"

export default function Page() {
  return (
    <Dropzone
      onDrop={(files) => console.log(files)}
      accept={["image/*", ".pdf"]}
      maxSize={10 * 1024 * 1024}
    />
  )
}
```

See [the docs](https://shelf-ui.vercel.app/docs) for all components, props, and examples.

## Storage Adapters

Shelf UI includes first-class adapters for three storage providers:

```tsx
import { useStorageProvider } from "@/hooks/use-storage-provider"

// Supabase Storage
const adapter = useStorageProvider("supabase", {
  client: supabase,
  bucket: "uploads",
})

// AWS S3
const adapter = useStorageProvider("s3", {
  region: "us-east-1",
  bucket: "my-bucket",
})

// Cloudinary
const adapter = useStorageProvider("cloudinary", {
  cloudName: "my-cloud",
  uploadPreset: "my-preset",
})
```

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
