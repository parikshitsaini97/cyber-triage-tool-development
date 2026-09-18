"use client"

import { useState } from "react"
import type { StageId } from "@/lib/triage-data"
import { Sidebar } from "@/components/triage/sidebar"
import { Topbar } from "@/components/triage/topbar"
import { OverviewView } from "@/components/triage/overview-view"
import { EvidenceView } from "@/components/triage/evidence-view"
import { ClassifyView } from "@/components/triage/classify-view"
import { ExtractView } from "@/components/triage/extract-view"
import { CorrelateView } from "@/components/triage/correlate-view"
import { InvestigateView } from "@/components/triage/investigate-view"

const meta: Record<StageId, { title: string; sub: string }> = {
  overview: { title: "Command Center", sub: "Case posture at a glance" },
  evidence: { title: "Evidence & Acquisition", sub: "Collect and verify digital evidence" },
  classify: { title: "Classification", sub: "Organize the acquired data set" },
  extract: { title: "Artifact Extraction", sub: "Surface investigative artifacts" },
  correlate: { title: "IOC Correlation", sub: "Discover and link indicators of compromise" },
  investigate: { title: "Investigation", sub: "Reconstruct the incident and build the case" },
}

const order: StageId[] = ["overview", "evidence", "classify", "extract", "correlate", "investigate"]

export default function Page() {
  const [stage, setStage] = useState<StageId>("overview")

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar active={stage} onSelect={setStage} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <div className="border-b border-border bg-card/30 px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {meta[stage].title}
              </h2>
              <p className="text-xs text-muted-foreground">{meta[stage].sub}</p>
            </div>
          </div>
          {/* Mobile stage switcher */}
          <div className="mt-3 flex gap-2 overflow-x-auto md:hidden">
            {order.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setStage(id)}
                className={
                  stage === id
                    ? "shrink-0 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                    : "shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground"
                }
              >
                {meta[id].title}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-5">
          {stage === "overview" && <OverviewView onNavigate={setStage} />}
          {stage === "evidence" && <EvidenceView />}
          {stage === "classify" && <ClassifyView />}
          {stage === "extract" && <ExtractView />}
          {stage === "correlate" && <CorrelateView />}
          {stage === "investigate" && <InvestigateView />}
        </main>
      </div>
    </div>
  )
}
