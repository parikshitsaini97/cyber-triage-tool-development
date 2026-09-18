"use client"

import { Layers, Flag, ScanSearch } from "lucide-react"
import { classification } from "@/lib/triage-data"
import { Panel, PanelHeader, Meter, Chip } from "./ui"

export function ClassifyView() {
  const total = classification.reduce((s, c) => s + c.count, 0)
  const flagged = classification.reduce((s, c) => s + c.flagged, 0)
  const maxCount = Math.max(...classification.map((c) => c.count))

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">Objects Classified</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            {total.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">across 7 categories</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">Auto-Flagged for Review</p>
          <p className="mt-1 font-mono text-2xl font-bold text-[oklch(0.8_0.18_22)]">{flagged}</p>
          <p className="mt-1 text-xs text-muted-foreground">ML + rule-based triage</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">De-duplication</p>
          <p className="mt-1 font-mono text-2xl font-bold text-[oklch(0.78_0.18_145)]">31%</p>
          <p className="mt-1 text-xs text-muted-foreground">known-good files filtered</p>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <PanelHeader
            title="Data Classification"
            desc="Every object bucketed by type; anomalies surfaced automatically"
            icon={<Layers className="size-4" />}
          />
          <div className="space-y-4 p-5">
            {classification.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.count.toLocaleString()}
                    </span>
                    {c.flagged > 0 ? (
                      <Chip tone="danger">
                        <Flag className="size-3" /> {c.flagged}
                      </Chip>
                    ) : null}
                  </span>
                </div>
                <Meter
                  value={(c.count / maxCount) * 100}
                  tone={c.flagged > 60 ? "danger" : c.flagged > 20 ? "amber" : "primary"}
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Priority Categories"
            desc="Highest flagged-to-volume ratio"
            icon={<ScanSearch className="size-4" />}
          />
          <ul className="divide-y divide-border">
            {[...classification]
              .sort((a, b) => b.flagged / b.count - a.flagged / a.count)
              .slice(0, 4)
              .map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 px-5 py-4">
                  <span className="grid size-8 place-items-center rounded-full bg-accent font-mono text-xs text-accent-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.flagged} flagged of {c.count.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[oklch(0.8_0.18_22)]">
                    {((c.flagged / c.count) * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
