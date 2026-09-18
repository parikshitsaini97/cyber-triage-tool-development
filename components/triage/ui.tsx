import type React from "react"
import { cn } from "@/lib/utils"
import type { Severity } from "@/lib/triage-data"

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm shadow-black/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  desc,
  icon,
  action,
}: {
  title: string
  desc?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          {desc ? <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

const severityStyles: Record<Severity, string> = {
  critical: "border-[oklch(0.62_0.23_22_/_40%)] bg-[oklch(0.62_0.23_22_/_15%)] text-[oklch(0.78_0.18_22)]",
  high: "border-[oklch(0.8_0.16_85_/_40%)] bg-[oklch(0.8_0.16_85_/_14%)] text-[oklch(0.85_0.16_85)]",
  medium: "border-[oklch(0.78_0.13_195_/_40%)] bg-[oklch(0.78_0.13_195_/_14%)] text-[oklch(0.82_0.13_195)]",
  low: "border-[oklch(0.72_0.18_145_/_38%)] bg-[oklch(0.72_0.18_145_/_13%)] text-[oklch(0.78_0.18_145)]",
  info: "border-border bg-muted text-muted-foreground",
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        severityStyles[severity],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {severity}
    </span>
  )
}

export function Chip({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode
  className?: string
  tone?: "default" | "primary" | "danger" | "success"
}) {
  const tones = {
    default: "border-border bg-muted text-muted-foreground",
    primary: "border-primary/40 bg-primary/10 text-primary",
    danger: "border-destructive/40 bg-destructive/10 text-[oklch(0.78_0.18_22)]",
    success: "border-[oklch(0.72_0.18_145_/_40%)] bg-[oklch(0.72_0.18_145_/_12%)] text-[oklch(0.78_0.18_145)]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Meter({
  value,
  className,
  tone = "primary",
}: {
  value: number
  className?: string
  tone?: "primary" | "danger" | "amber" | "success"
}) {
  const tones = {
    primary: "bg-primary",
    danger: "bg-[oklch(0.62_0.23_22)]",
    amber: "bg-[oklch(0.8_0.16_85)]",
    success: "bg-[oklch(0.72_0.18_145)]",
  }
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all", tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
