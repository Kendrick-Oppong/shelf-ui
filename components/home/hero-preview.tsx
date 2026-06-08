"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadQueueDemo } from "./upload-queue-demo";

const FILE_LIST = [
  {
    ext: "PDF",
    name: "Q3-report-final.pdf",
    size: "2.4 MB",
    colorClass: "bg-destructive/10 text-red-400",
  },
  {
    ext: "PNG",
    name: "hero-shot@2x.png",
    size: "840 KB",
    colorClass: "bg-success/10 text-green-400",
  },
  {
    ext: "ZIP",
    name: "assets-v2.zip",
    size: "12.1 MB",
    colorClass: "bg-primary/10 text-primary",
  },
] as const;

const TYPE_BADGES = ["PDF", "PNG", "MP4", "+8"] as const;

const WINDOW_DOTS = ["bg-destructive", "bg-primary", "bg-success"] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function HeroPreview() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-border shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-border border-b bg-card px-5 py-3.5">
        {WINDOW_DOTS.map((dotClass) => (
          <div className={cn("size-3 rounded-full", dotClass)} key={dotClass} />
        ))}
        <span className="mx-auto font-medium text-[12px] text-muted-foreground">
          shelf-ui · component preview
        </span>
      </div>

      {/* 3-column demo */}
      <div className="grid grid-cols-3 gap-px bg-border">
        {/* Dropzone */}
        <div className="bg-card p-6">
          <div className="mb-4 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
            Dropzone
          </div>
          <motion.div
            animate={{
              borderColor: [
                "color-mix(in srgb, var(--color-primary) 20%, transparent)",
                "color-mix(in srgb, var(--color-primary) 50%, transparent)",
                "color-mix(in srgb, var(--color-primary) 20%, transparent)",
              ],
            }}
            className="flex flex-col items-center gap-2 rounded-[10px] border-[1.5px] border-dashed p-6"
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-primary/12 bg-primary/8">
              <Upload className="size-4 text-primary" />
            </div>
            <div className="text-center text-[11px] text-muted-foreground leading-relaxed">
              <strong className="font-semibold text-foreground">
                Drop files here
              </strong>
              <br />
              or click to browse
            </div>
            <div className="flex gap-1">
              {TYPE_BADGES.map((tag) => (
                <span
                  className="rounded border border-border bg-accent px-1.5 py-0.5 font-semibold text-[9px] text-muted-foreground"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FileList */}
        <div className="bg-card p-6">
          <div className="mb-4 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
            FileList
          </div>
          <motion.div
            animate="visible"
            className="flex flex-col gap-1.5"
            initial="hidden"
            variants={containerVariants}
          >
            {FILE_LIST.map((file) => (
              <motion.div
                className="flex items-center gap-2 rounded-[7px] border border-border bg-accent p-2"
                key={file.name}
                variants={itemVariants}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-[5px] font-extrabold text-[8px]",
                    file.colorClass
                  )}
                >
                  {file.ext}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-[11px] text-foreground">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {file.size}
                  </div>
                </div>
                <CheckCircle2 className="size-4 shrink-0 text-success" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* UploadQueue */}
        <div className="bg-card p-6">
          <div className="mb-4 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
            UploadQueue
          </div>
          <UploadQueueDemo />
        </div>
      </div>
    </div>
  );
}
