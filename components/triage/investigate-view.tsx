"use client"

import { Clock, ScanSearch, ShieldCheck } from "lucide-react"
import { timeline, findings, type Severity } from "@/lib/triage-data"
import { Panel, PanelHeader, SeverityBadge, Chip } from "./ui"

const dot: Record<Severity, string> = {
  critical: "bg-[oklch(0.62_0.23_22)] shadow-[0_0_10px_oklch(0.62_0.23_22)]",
  high: "bg-[oklch(0.8_0.16_85)] shadow-[0_0_10px_oklch(0.8_0.16_85_/_60%)]",
  medium: "bg-[oklch(0.78_0.13_195)]",
  low: "bg-[oklch(0.72_0.18_145)]",
  info: "bg-muted-foreground",
}

const statusTone: Record<string, "danger" | "primary" | "success"> = {
  Confirmed: "danger",
  Investigating: "primary",
  Contained: "success",
}

export function InvestigateView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Panel>
          <PanelHeader
            title="Reconstructed Timeline"
            desc="Correlated across disk, memory, network and logs"
            icon={<Clock className="size-4" />}
          />
          <ol className="relative space-y-1 p-5">
            <span className="absolute bottom-6 left-[27px] top-6 w-px bg-border" aria-hidden />
            {timeline.map((ev) => (
              <li key={ev.id} className="relative flex gap-4 py-2">
                <span className="relative z-10 mt-1 grid size-4 shrink-0 place-items-center">
                  <span className={`size-2.5 rounded-full ${dot[ev.severity]}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-primary">{ev.time}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{ev.host}</span>
                    <Chip>{ev.source}</Chip>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{ev.event}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    ATT&CK {ev.technique}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader
              title="Investigation Findings"
              desc="Analyst conclusions with linked evidence"
              icon={<ScanSearch className="size-4" />}
            />
            <ul className="divide-y divide-border">
              {findings.map((f) => (
                <li key={f.id} className="space-y-2 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <SeverityBadge severity={f.severity} />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{f.narrative}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone={statusTone[f.status]}>{f.status}</Chip>
                    <span className="font-mono text-[10px] text-muted-foreground">{f.mitre}</span>
                    {f.evidenceRefs.map((r) => (
                      <span
                        key={r}
                        className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="flex items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[oklch(0.72_0.18_145_/_15%)] text-[oklch(0.78_0.18_145)]">
              <ShieldCheck className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Case ready for reporting</p>
              <p className="text-xs text-muted-foreground">
                Kill chain reconstructed · 4 findings documented · chain of custody intact
              </p>
            </div>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Generate Report
            </button>
          </Panel>
        </div>
      </div>
    </div>
  )
}
