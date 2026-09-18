"use client"

import {
  Gauge,
  HardDriveDownload,
  Layers,
  FileSearch,
  Waypoints,
  ScanSearch,
  Radar,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { StageId } from "@/lib/triage-data"

const nav: { id: StageId; label: string; icon: LucideIcon; step?: string }[] = [
  { id: "overview", label: "Command Center", icon: Gauge },
  { id: "evidence", label: "Evidence & Acquisition", icon: HardDriveDownload, step: "01" },
  { id: "classify", label: "Classification", icon: Layers, step: "02" },
  { id: "extract", label: "Artifact Extraction", icon: FileSearch, step: "03" },
  { id: "correlate", label: "IOC Correlation", icon: Waypoints, step: "04" },
  { id: "investigate", label: "Investigation", icon: ScanSearch, step: "05" },
]

export function Sidebar({
  active,
  onSelect,
}: {
  active: StageId
  onSelect: (id: StageId) => void
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <span className="grid size-9 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
          <Radar className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Sentinel Triage
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            DFIR Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Triage Pipeline
        </p>
        {nav.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-primary/30"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.step ? (
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    isActive ? "text-primary" : "text-muted-foreground/60",
                  )}
                >
                  {item.step}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-md bg-sidebar-accent/50 p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Chain of Custody
            </span>
            <span className="size-2 rounded-full bg-[oklch(0.72_0.18_145)] shadow-[0_0_8px_oklch(0.72_0.18_145)]" />
          </div>
          <p className="mt-1.5 text-xs text-sidebar-foreground">Sealed &amp; hash-verified</p>
          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            Every action is logged &amp; signed
          </p>
        </div>
      </div>
    </aside>
  )
}
