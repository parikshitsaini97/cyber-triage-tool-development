"use client"

import { useState } from "react"
import { Waypoints, Crosshair, Globe, Binary, KeyRound, Database, Mail, ArrowRight, type LucideIcon } from "lucide-react"
import { iocs, correlations, type Ioc } from "@/lib/triage-data"
import { Panel, PanelHeader, SeverityBadge, Meter, Chip } from "./ui"

const typeIcon: Record<Ioc["type"], LucideIcon> = {
  IPv4: Globe,
  Domain: Globe,
  "SHA-256": Binary,
  Mutex: KeyRound,
  Registry: Database,
  Email: Mail,
}

export function CorrelateView() {
  const [selected, setSelected] = useState<string | null>(null)
  const iocById = (id: string) => iocs.find((i) => i.id === id)

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Panel>
          <PanelHeader
            title="Indicators of Compromise"
            desc="Enriched with threat intel and mapped to MITRE ATT&CK"
            icon={<Crosshair className="size-4" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">Indicator</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">MITRE</th>
                  <th className="px-3 py-2.5 font-medium">Hits</th>
                  <th className="px-3 py-2.5 font-medium">Confidence</th>
                  <th className="px-5 py-2.5 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody>
                {iocs.map((ioc) => {
                  const Icon = typeIcon[ioc.type]
                  const active = selected === ioc.id
                  return (
                    <tr
                      key={ioc.id}
                      onClick={() => setSelected(active ? null : ioc.id)}
                      className={
                        "cursor-pointer border-b border-border/60 transition-colors " +
                        (active ? "bg-primary/5" : "hover:bg-accent/40")
                      }
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" />
                          <span className="font-mono text-xs text-foreground">{ioc.indicator}</span>
                          {ioc.enriched ? <Chip tone="primary">enriched</Chip> : null}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{ioc.type}</td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs text-foreground">{ioc.mitre}</span>
                        <span className="block text-[10px] text-muted-foreground">{ioc.mitreName}</span>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-foreground">{ioc.hits}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Meter value={ioc.confidence} className="w-14" />
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {ioc.confidence}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <SeverityBadge severity={ioc.severity} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Attack Correlation"
            desc="Automatically inferred relationships between indicators"
            icon={<Waypoints className="size-4" />}
          />
          <div className="space-y-3 p-5">
            {correlations.map((link) => {
              const from = iocById(link.from)
              const to = iocById(link.to)
              return (
                <div key={link.id} className="rounded-md border border-border bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="min-w-0 flex-1 truncate font-mono text-foreground">
                      {from?.indicator}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate text-right font-mono text-foreground">
                      {to?.indicator}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{link.relation}</span>
                    <span className="font-mono text-[11px] text-primary">{link.strength}%</span>
                  </div>
                  <Meter className="mt-1.5" value={link.strength} />
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}
