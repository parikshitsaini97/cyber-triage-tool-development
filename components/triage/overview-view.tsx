"use client";

import { useEffect, useState } from "react";
import { Loader2, Activity, HardDrive, ShieldAlert, FileCode, Network, Search } from "lucide-react";

interface OverviewData {
  evidenceCount: number;
  threatCount: number;
  flaggedArtifacts: number;
  activeIocs: number;
  openCases: number;
}

export function OverviewView() {
  const [stats, setStats] = useState<OverviewData>({
    evidenceCount: 0,
    threatCount: 0,
    flaggedArtifacts: 0,
    activeIocs: 0,
    openCases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();

        setStats({
          evidenceCount: data.evidence?.length || 0,
          threatCount: data.classifications?.filter((c: any) => c.severity === "critical" || c.severity === "high").length || 0,
          flaggedArtifacts: data.artifacts?.filter((a: any) => a.flagged).length || 0,
          activeIocs: data.iocs?.filter((i: any) => i.status === "active").length || 0,
          openCases: data.investigations?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch triage overview metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-emerald-500" /> Command Center Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Real-time summary metrics compiled across all active DFIR triage pipeline stages.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Evidence</span>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.evidenceCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Ingested items</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">High/Critical</span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-red-500">{stats.threatCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Rules triggered</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Flagged Files</span>
            <FileCode className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-orange-500">{stats.flaggedArtifacts}</div>
          <p className="text-xs text-muted-foreground mt-1">Suspicious paths</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active IOCs</span>
            <Network className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-yellow-500">{stats.activeIocs}</div>
          <p className="text-xs text-muted-foreground mt-1">Unmitigated feeds</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Open Cases</span>
            <Search className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-blue-500">{stats.openCases}</div>
          <p className="text-xs text-muted-foreground mt-1">Active investigations</p>
        </div>
      </div>
    </div>
  );
}