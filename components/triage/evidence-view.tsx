"use client"

import {
  HardDrive,
  Cpu,
  Network,
  Smartphone,
  Database,
  Globe,
  Lock,
  CircleCheck,
  FileX2,
  Loader,
  type LucideIcon,
} from "lucide-react"
import { evidence, type EvidenceItem } from "@/lib/triage-data"
import { Panel, PanelHeader, Meter, Chip } from "./ui"

const typeIcon: Record<EvidenceItem["type"], LucideIcon> = {
  "Disk Image": HardDrive,
  "Memory Dump": Cpu,
  "Network Capture": Network,
  "Mobile Extract": Smartphone,
  "Log Archive": Database,
  "Cloud Export": Globe,
}

function StatusPill({ status }: { status: EvidenceItem["status"] }) {
  if (status === "Verified")
    return (
      <Chip tone="success">
        <CircleCheck className="size-3" /> Verified
      </Chip>
    )
  if (status === "Acquiring")
    return (
      <Chip tone="primary">
        <Loader className="size-3 animate-spin" /> Acquiring
      </Chip>
    )
  if (status === "Integrity Failed")
    return (
      <Chip tone="danger">
        <FileX2 className="size-3" /> Integrity Failed
      </Chip>
    )
  return <Chip>Queued</Chip>
}

export function EvidenceView() {
  const verified = evidence.filter((e) => e.status === "Verified").length
  const failed = evidence.filter((e) => e.status === "Integrity Failed").length
  const totalTb = "666 GB"

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">Total Data Under Custody</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{totalTb}</p>
          <p className="mt-1 text-xs text-muted-foreground">{evidence.length} evidence sources</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">Hash-Verified</p>
          <p className="mt-1 font-mono text-2xl font-bold text-[oklch(0.78_0.18_145)]">
            {verified}/{evidence.length}
          </p>
          <Meter className="mt-2" value={(verified / evidence.length) * 100} tone="success" />
        </Panel>
        <Panel className="p-4">
          <p className="text-xs text-muted-foreground">Integrity Alerts</p>
          <p className="mt-1 font-mono text-2xl font-bold text-[oklch(0.8_0.18_22)]">{failed}</p>
          <p className="mt-1 text-xs text-muted-foreground">SHA-256 mismatch on M365 export</p>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Evidence Register"
          desc="Forensically sound acquisition with hash verification and write-blocking"
          icon={<HardDrive className="size-4" />}
        />
        <div className="divide-y divide-border">
          {evidence.map((e) => {
            const Icon = typeIcon[e.type]
            return (
              <div key={e.id} className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[2fr_1.4fr_1fr] md:items-center">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{e.id}</span>
                      <span className="truncate text-sm font-medium text-foreground">{e.label}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.type} · {e.source} · {e.size}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    <span className="text-foreground/70">sha256:</span> {e.sha256}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {e.writeBlocked ? (
                      <Chip>
                        <Lock className="size-3" /> Write-blocked
                      </Chip>
                    ) : null}
                    <span className="font-mono text-[10px] text-muted-foreground">{e.method}</span>
                  </div>
                </div>

                <div className="space-y-2 md:text-right">
                  <div className="flex items-center justify-between gap-2 md:justify-end">
                    <StatusPill status={e.status} />
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
                  <p className="font-mono text-[10px] text-muted-foreground">{e.acquiredAt}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
