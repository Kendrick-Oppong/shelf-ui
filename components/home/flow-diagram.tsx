"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

// ─── Types ───────────────────────────────────────────────────────────────────

type NodeStatus = "active" | "idle" | "success" | "error";
type EdgeVariant = "default" | "success" | "error";

interface Node {
  id: string;
  label: string;
  status: NodeStatus;
  sub: string;
  width: number;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  label?: string;
  to: string;
  variant?: EdgeVariant;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const NODE_H = 58;
const CANVAS_W = 640;
const CANVAS_H = 520;

const NODES: Node[] = [
  {
    id: "drop",
    label: "File Drop",
    sub: "drag & drop · browse",
    status: "active",
    x: 220,
    y: 30,
    width: 200,
  },
  {
    id: "validate",
    label: "Validate",
    sub: "MIME · size · type",
    status: "idle",
    x: 220,
    y: 150,
    width: 200,
  },
  {
    id: "queue",
    label: "Queue",
    sub: "managed upload queue",
    status: "success",
    x: 40,
    y: 280,
    width: 190,
  },
  {
    id: "rejected",
    label: "Rejected",
    sub: "error surfaced to UI",
    status: "error",
    x: 410,
    y: 280,
    width: 190,
  },
  {
    id: "supabase",
    label: "Supabase",
    sub: "RLS-aware · signed URLs",
    status: "success",
    x: 0,
    y: 420,
    width: 180,
  },
  {
    id: "s3",
    label: "AWS S3",
    sub: "presigned · R2 · MinIO",
    status: "idle",
    x: 230,
    y: 420,
    width: 180,
  },
  {
    id: "cloudinary",
    label: "Cloudinary",
    sub: "transforms · presets",
    status: "idle",
    x: 460,
    y: 420,
    width: 180,
  },
];

// Derive center-bottom and center-top from node layout
function cx(n: Node) {
  return n.x + n.width / 2;
}
function bottom(n: Node) {
  return n.y + NODE_H;
}
function top(n: Node) {
  return n.y;
}

const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES: Edge[] = [
  { from: "drop", to: "validate" },
  { from: "validate", to: "queue", label: "VALID", variant: "success" },
  { from: "validate", to: "rejected", label: "INVALID", variant: "error" },
  { from: "queue", to: "supabase" },
  { from: "queue", to: "s3" },
  { from: "queue", to: "cloudinary" },
];

// ─── Status tokens ────────────────────────────────────────────────────────────

const STATUS: Record<
  NodeStatus,
  {
    border: string;
    bg: string;
    dot: string;
    glow: string;
    badge: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  active: {
    border: "border-primary/50",
    bg: "bg-primary/5",
    dot: "bg-primary",
    glow: "shadow-[0_0_10px_2px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]",
    badge: "ACTIVE",
    badgeBg: "bg-primary/8",
    badgeBorder: "border-primary/30",
    badgeText: "text-primary",
  },
  idle: {
    border: "border-border",
    bg: "bg-card",
    dot: "bg-muted-foreground/40",
    glow: "",
    badge: "IDLE",
    badgeBg: "bg-muted/30",
    badgeBorder: "border-border",
    badgeText: "text-muted-foreground",
  },
  success: {
    border: "border-success/40",
    bg: "bg-success/5",
    dot: "bg-success",
    glow: "shadow-[0_0_10px_2px_color-mix(in_srgb,var(--color-success)_35%,transparent)]",
    badge: "LIVE",
    badgeBg: "bg-success/8",
    badgeBorder: "border-success/30",
    badgeText: "text-success",
  },
  error: {
    border: "border-destructive/40",
    bg: "bg-destructive/5",
    dot: "bg-destructive",
    glow: "shadow-[0_0_10px_2px_color-mix(in_srgb,var(--color-destructive)_35%,transparent)]",
    badge: "ERR",
    badgeBg: "bg-destructive/8",
    badgeBorder: "border-destructive/30",
    badgeText: "text-destructive",
  },
};

const EDGE_STYLE: Record<
  EdgeVariant,
  {
    stroke: string;
    dot: string;
    labelBorder: string;
    labelText: string;
    labelBg: string;
  }
> = {
  default: {
    stroke: "stroke-border",
    dot: "fill-primary",
    labelBorder: "",
    labelText: "",
    labelBg: "",
  },
  success: {
    stroke: "stroke-success/50",
    dot: "fill-success",
    labelBorder: "border-success/30",
    labelText: "text-success",
    labelBg: "bg-success/8",
  },
  error: {
    stroke: "stroke-destructive/50",
    dot: "fill-destructive",
    labelBorder: "border-destructive/30",
    labelText: "text-destructive",
    labelBg: "bg-destructive/8",
  },
};

const EDGE_DELAYS = [0, 0.25, 0.55, 0.1, 0.4, 0.7];

// ─── Edge path builder ────────────────────────────────────────────────────────

function buildCurve(from: Node, to: Node): string {
  const x1 = cx(from);
  const y1 = bottom(from);
  const x2 = cx(to);
  const y2 = top(to);
  const mid = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
}

// ─── SVG edge ─────────────────────────────────────────────────────────────────

function SvgEdge({ edge, index }: Readonly<{ edge: Edge; index: number }>) {
  const from = NODE_MAP[edge.from];
  const to = NODE_MAP[edge.to];
  const variant = edge.variant ?? "default";
  const style = EDGE_STYLE[variant];
  const d = buildCurve(from, to);
  const midX = (cx(from) + cx(to)) / 2;
  const midY = (bottom(from) + top(to)) / 2;

  return (
    <g>
      <path
        className={style.stroke}
        d={d}
        fill="none"
        strokeDasharray="4 3"
        strokeWidth="1"
      />
      <motion.circle
        animate={{ offsetDistance: ["0%", "100%"] }}
        className={style.dot}
        r="2.5"
        style={{ offsetPath: `path("${d}")` }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          delay: EDGE_DELAYS[index] ?? 0,
        }}
      />
      {edge.label && (
        <foreignObject height={20} width={52} x={midX - 26} y={midY - 12}>
          <div
            className={cn(
              "flex h-full w-full items-center justify-center rounded-full border font-semibold text-[8px] uppercase tracking-widest",
              style.labelBg,
              style.labelBorder,
              style.labelText
            )}
          >
            {edge.label}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// ─── Flow node ────────────────────────────────────────────────────────────────

function FlowNode({ node, index }: Readonly<{ node: Node; index: number }>) {
  const statusStyle = STATUS[node.status];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "absolute flex items-center gap-3 rounded-2xl border px-4 backdrop-blur-sm",
        statusStyle.border,
        statusStyle.bg
      )}
      initial={{ opacity: 0, y: 8 }}
      key={node.id}
      style={{ left: node.x, top: node.y, width: node.width, height: NODE_H }}
      transition={{
        delay: index * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Status dot */}
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          statusStyle.dot,
          statusStyle.glow
        )}
      />

      {/* Labels */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[12px] text-foreground leading-tight">
          {node.label}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground leading-snug">
          {node.sub}
        </p>
      </div>

      {/* Badge */}
      <span
        className={cn(
          "shrink-0 rounded-full border px-2 py-0.5 font-semibold text-[8px] uppercase tracking-widest",
          statusStyle.badgeBg,
          statusStyle.badgeBorder,
          statusStyle.badgeText
        )}
      >
        {statusStyle.badge}
      </span>
    </motion.div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function FlowCanvas() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-center px-4 py-6">
        <div
          className="relative shrink-0"
          style={{ width: CANVAS_W, height: CANVAS_H }}
        >
          {/* SVG edges layer */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            focusable="false"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          >
            {EDGES.map((edge, i) => (
              <SvgEdge edge={edge} index={i} key={`${edge.from}→${edge.to}`} />
            ))}
          </svg>

          {/* Nodes layer */}
          {NODES.map((node, i) => (
            <FlowNode index={i} key={node.id} node={node} />
          ))}

          {/* Storage adapters label */}
          <motion.p
            animate={{ opacity: 1 }}
            className="absolute right-0 bottom-0 left-0 text-center font-medium text-[10px] text-muted-foreground/50 uppercase tracking-[0.12em]"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Storage adapters
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function FlowDiagram() {
  return (
    <Reveal className="pb-28">
      <div className="container-shelf">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 p-2 shadow-lg backdrop-blur-sm">
          <div className="section-eyebrow mt-3 ml-6">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Upload pipeline</span>
          </div>
          <FlowCanvas />
        </div>
      </div>
    </Reveal>
  );
}
