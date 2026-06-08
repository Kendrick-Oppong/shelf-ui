import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const ADAPTERS = [
  {
    dot: "bg-green-500",
    name: "Supabase Storage",
    body: "Bucket config, RLS-aware uploads, signed URLs. Plugs into your existing Supabase project — no new setup.",
    code: "useStorageProvider('supabase', config)",
  },
  {
    dot: "bg-orange-500",
    name: "AWS S3",
    body: "Presigned URL upload flow, progress tracking. Works with any S3-compatible storage — R2, Backblaze, MinIO.",
    code: "useStorageProvider('s3', config)",
  },
  {
    dot: "bg-blue-500",
    name: "Cloudinary",
    body: "Upload presets, transformations, auto-optimization. Replace the entire Cloudinary widget with Shelf UI components.",
    code: "useStorageProvider('cloudinary', config)",
  },
] as const;

export function AdaptersSection() {
  return (
    <Reveal className="px-8 pb-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Storage Adapters</span>
        </div>
        <h2 className="mb-12 font-bold text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em]">
          Connect your storage.
          <br />
          In one line.
        </h2>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {ADAPTERS.map(({ dot, name, body, code }) => (
            <div
              className="bg-card p-8 transition-colors hover:bg-card-hover"
              key={name}
            >
              <div className="mb-2 flex items-center gap-2 font-bold text-[13px] text-foreground">
                <span className={cn("size-2 shrink-0 rounded-full", dot)} />
                {name}
              </div>
              <p className="mb-3 font-light text-[12.5px] text-muted-foreground leading-[1.7]">
                {body}
              </p>
              <code className="inline-block rounded-md border border-border bg-accent px-2.5 py-1 font-mono text-[11px] text-primary">
                {code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
