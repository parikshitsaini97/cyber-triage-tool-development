"use client"

import { useState } from "react"
import {
  FileSearch,
  Mail,
  Binary,
  KeyRound,
  Globe,
  Database,
  FileText,
  Flag,
  type LucideIcon,
} from "lucide-react"
import { artifacts } from "@/lib/triage-data"
import { Panel, PanelHeader, SeverityBadge, Chip } from "./ui"

const catIcon: Record<string, LucideIcon> = {
  Email: Mail,
  Executable: Binary,
  Credentials: KeyRound,
  Browser: Globe,
  Registry: Database,
  Document: FileText,
}

const filters = ["All", "Flagged", "Email", "Executable", "Credentials", "Browser", "Registry", "Document"]

export function ExtractView() {
  const [filter, setFilter] = useState("All")

  const visible = artifacts.filter((a) => {
    if (filter === "All") return true
    if (filter === "Flagged") return a.flagged
    return a.category === filter
  })

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Artifact Extraction"
          desc="Recovered emails, binaries, credentials, deleted files and web activity"
          icon={<FileSearch className="size-4" />}
        />
        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  : "rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              }
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-border">
          {visible.map((a) => {
            const Icon = catIcon[a.category] ?? FileText
            return (
              <li key={a.id} className="flex items-start gap-3 px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-mono text-sm text-foreground">{a.title}</span>
                    {a.flagged ? (
                      <Chip tone="danger">
                        <Flag className="size-3" /> flagged
                      </Chip>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {a.source} · {a.timestamp}
                  </p>
                </div>
                <SeverityBadge severity={a.severity} />
              </li>
            )
          })}
        </ul>
        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No artifacts in this category.
          </p>
        ) : null}
      </Panel>
    </div>
  )
}
