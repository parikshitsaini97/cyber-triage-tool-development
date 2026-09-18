"use client"

import {
  HardDriveDownload,
  Crosshair,
  FileSearch,
  Clock,
  ArrowRight,
  ShieldAlert,
  CircleCheck,
} from "lucide-react"
import {
  caseInfo,
  evidence,
  iocs,
  artifacts,
  timeline,
  findings,
  pipelineStages,
  type StageId,
} from "@/lib/triage-data"
import { Panel, PanelHeader, SeverityBadge, Meter, Chip } from "./ui"

function ThreatGauge({ score }: { score: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="relative grid size-36 place-items-center">
      <svg className="size-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="oklch(0.27 0.02 248)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="oklch(0.62 0.23 22)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-3xl font-bold text-foreground">{score}</p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Threat Score</p>
      </div>
    </div>
  )
}

const stats = [
  { label: "Evidence Items", value: evidence.length, sub: "sources acquired", icon: HardDriveDownload },
  { label: "Active IOCs", value: iocs.length, sub: "indicators tracked", icon: Crosshair },
  { label: "Flagged Artifacts", value: artifacts.filter((a) => a.flagged).length, sub: "require review", icon: FileSearch },
  { label: "Timeline Events", value: timeline.length, sub: "reconstructed", icon: Clock },
]

export function OverviewView({ onNavigate }: { onNavigate: (id: StageId) => void }) {
  const completed = evidence.filter((e) => e.status === "Verified").length
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            <ThreatGauge score={caseInfo.threatScore} />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={caseInfo.priority} />
                <Chip tone="danger">{caseInfo.status}</Chip>
                <Chip>{caseInfo.lead}</Chip>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{caseInfo.summary}</p>
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <p className="text-muted-foreground">Subject Host</p>
                  <p className="font-mono text-foreground">{caseInfo.subjectHost}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Opened</p>
                  <p className="font-mono text-foreground">{caseInfo.opened}</p>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Triage Pipeline" desc="Progress across investigation stages" />
          <div className="space-y-1 p-3">
            {pipelineStages.map((stage, i) => {
              const done = i < 3
              const current = i === 3
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => onNavigate(stage.id)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-accent/50"
                >
                  <span
                    className={
                      done
                        ? "grid size-7 place-items-center rounded-full bg-[oklch(0.72_0.18_145_/_15%)] text-[oklch(0.78_0.18_145)]"
                        : current
                          ? "grid size-7 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40"
                          : "grid size-7 place-items-center rounded-full bg-muted text-muted-foreground"
                    }
                  >
                    {done ? <CircleCheck className="size-4" /> : <span className="font-mono text-xs">{i + 1}</span>}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-foreground">{stage.label}</span>
                    <span className="block text-xs text-muted-foreground">{stage.blurb}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                <s.icon className="size-4.5" />
              </span>
              <span className="font-mono text-2xl font-bold text-foreground">{s.value}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <PanelHeader
            title="Key Findings"
            desc="Confirmed activity along the kill chain"
            icon={<ShieldAlert className="size-4" />}
            action={
              <button
                type="button"
                onClick={() => onNavigate("investigate")}
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </button>
            }
          />
          <ul className="divide-y divide-border">
            {findings.map((f) => (
              <li key={f.id} className="flex items-start gap-3 px-5 py-3">
                <SeverityBadge severity={f.severity} className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{f.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {f.mitre} · {f.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader
            title="Acquisition Status"
            desc={`${completed} of ${evidence.length} sources verified`}
            icon={<HardDriveDownload className="size-4" />}
            action={
              <button
                type="button"
                onClick={() => onNavigate("evidence")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Manage
              </button>
            }
          />
          <ul className="space-y-3 p-5">
            {evidence.slice(0, 5).map((e) => (
              <li key={e.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate text-foreground">{e.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{e.progress}%</span>
                </div>
                <Meter
                  value={e.progress}
                  tone={
                    e.status === "Integrity Failed"
                      ? "danger"
                      : e.status === "Acquiring"
                        ? "amber"
                        : "success"
                  }
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
