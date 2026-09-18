"use client";

import { useEffect, useState } from "react";
import { Loader2, Network, ShieldAlert, CheckCircle2 } from "lucide-react";

interface IOCItem {
  id: string;
  type: string;
  value: string;
  threat: string;
  status: "active" | "blocked";
}

export function CorrelateView() {
  const [iocs, setIocs] = useState<IOCItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIocs() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();
        setIocs(data.iocs || []);
      } catch (error) {
        console.error("Failed to fetch IOC correlation telemetry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIocs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
          <Network className="h-5 w-5" /> IOC Correlation
        </h3>
        <p className="text-sm text-muted-foreground">
          Correlated indicators of compromise cross-referenced against threat intelligence feeds via <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/triage</code>.
        </p>
      </div>
      <div className="p-6 pt-0">
        {iocs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No correlated IOCs recorded.</p>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">IOC ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Indicator Value</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Associated Threat</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Mitigation Status</th>
                </tr>
              </thead>
              <tbody>
                {iocs.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs">{item.id}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 align-middle font-mono text-xs max-w-[220px] truncate">{item.value}</td>
                    <td className="p-4 align-middle font-medium">{item.threat}</td>
                    <td className="p-4 align-middle">
                      {item.status === "active" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-500 px-2.5 py-0.5 text-xs font-semibold">
                          <ShieldAlert className="h-3 w-3" /> Active Threat
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 text-xs font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Blocked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
