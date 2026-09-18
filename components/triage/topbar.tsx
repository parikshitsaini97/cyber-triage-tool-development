"use client"

import { Search, TriangleAlert, Download } from "lucide-react"
import { caseInfo } from "@/lib/triage-data"
import { Chip } from "./ui"

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-md md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold text-foreground">{caseInfo.name}</h1>
            <Chip tone="primary" className="font-mono">
              {caseInfo.id}
            </Chip>
          </div>
          <p className="truncate text-xs text-muted-foreground">{caseInfo.classification}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search evidence, IOCs, hosts…"
            className="h-9 w-64 rounded-md border border-input bg-card pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </label>
        <span className="flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-[oklch(0.8_0.18_22)]">
          <TriangleAlert className="size-3.5" />
          Active Incident
        </span>
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>
    </header>
  )
}
