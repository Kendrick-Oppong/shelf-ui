import { Reveal } from "./reveal";

const ADAPTERS = [
  {
    color: "bg-emerald-500",
    glow: "shadow-[0_0_24px_4px_color-mix(in_srgb,#10b981_30%,transparent)]",
    ring: "border-emerald-500/20 bg-emerald-500/6",
    badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badgeText: "Live",
    name: "Supabase Storage",
    tagline: "The Postgres-native choice.",
    body: "Bucket config, RLS-aware uploads, signed URLs. Plugs into your existing Supabase project with zero extra setup.",
    features: [
      "Row-level security",
      "Signed URL generation",
      "Bucket management",
    ],
    code: "useStorageProvider('supabase', config)",
  },
  {
    color: "bg-orange-500",
    glow: "shadow-[0_0_24px_4px_color-mix(in_srgb,#f97316_30%,transparent)]",
    ring: "border-orange-500/20 bg-orange-500/6",
    badge: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    badgeText: "Live",
    name: "AWS S3",
    tagline: "Works everywhere S3 works.",
    body: "Presigned URL flow, progress tracking, multipart uploads. Compatible with R2, Backblaze B2, and MinIO out of the box.",
    features: [
      "Presigned URL uploads",
      "Multipart support",
      "R2 · Backblaze · MinIO",
    ],
    code: "useStorageProvider('s3', config)",
  },
  {
    color: "bg-blue-500",
    glow: "shadow-[0_0_24px_4px_color-mix(in_srgb,#3b82f6_30%,transparent)]",
    ring: "border-blue-500/20 bg-blue-500/6",
    badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badgeText: "Live",
    name: "Cloudinary",
    tagline: "Media transforms, built in.",
    body: "Upload presets, on-the-fly transformations, auto-optimization. Replace the Cloudinary widget entirely with Shelf UI components.",
    features: [
      "Upload presets",
      "On-the-fly transforms",
      "Auto format & quality",
    ],
    code: "useStorageProvider('cloudinary', config)",
  },
] as const;

export function AdaptersSection() {
  return (
    <Reveal className="pb-28">
      <div className="container-shelf">
        <div className="section-eyebrow">
          <div className="eyebrow-line" />
          <span className="eyebrow-text">Storage Adapters</span>
        </div>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-bold text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[1.08] tracking-[-0.035em]">
            Your storage.
            <br />
            <span className="text-muted-foreground/60">
              One consistent API.
            </span>
          </h2>
          <p className="max-w-sm font-light text-[13.5px] text-muted-foreground leading-[1.8]">
            Swap providers without touching your components. The adapter handles
            everything — auth, uploads, URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADAPTERS.map((adapter) => (
            <div
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 sm:last:col-span-2 lg:last:col-span-1 ${adapter.ring}`}
              key={adapter.name}
            >
              {/* Top row */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-3 rounded-full ${adapter.color} ${adapter.glow}`}
                  />
                  <span className="font-bold text-[13px] text-foreground">
                    {adapter.name}
                  </span>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 font-semibold text-[10px] ${adapter.badge}`}
                >
                  {adapter.badgeText}
                </span>
              </div>

              {/* Tagline */}
              <p className="mb-2 font-bold text-[15px] text-foreground tracking-[-0.02em]">
                {adapter.tagline}
              </p>
              <p className="mb-5 font-light text-[12.5px] text-muted-foreground leading-[1.7]">
                {adapter.body}
              </p>

              {/* Feature list */}
              <ul className="mb-6 flex flex-col gap-1.5">
                {adapter.features.map((feature) => (
                  <li
                    className="flex items-center gap-2 text-[12px] text-muted-foreground"
                    key={feature}
                  >
                    <div className={`size-1.5 rounded-full ${adapter.color}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Code */}
              <code className="block w-full truncate rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] text-primary">
                {adapter.code}
              </code>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center font-light text-[12.5px] text-muted-foreground">
          More adapters coming —{" "}
          <span className="text-primary">
            Firebase Storage, Azure Blob, ImageKit, Uploadthing
          </span>
        </p>
      </div>
    </Reveal>
  );
}
