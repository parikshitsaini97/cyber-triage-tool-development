"use client";

import { useEffect, useState } from "react";
import { Loader2, HardDrive, FileCheck } from "lucide-react";

interface EvidenceItem {
  id: string;
  source: string;
  type: string;
  hash: string;
  timestamp: string;
  status: "verified" | "pending" | "corrupted";
}

export function EvidenceView() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvidence() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();
        setEvidence(data.evidence || []);
      } catch (error) {
        console.error("Failed to fetch evidence telemetry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvidence();
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
          <HardDrive className="h-5 w-5" /> Collected Evidence & Artifacts
        </h3>
        <p className="text-sm text-muted-foreground">
          Raw logs, memory dumps, and forensic artifacts ingested from <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/triage</code>.
        </p>
      </div>
      <div className="p-6 pt-0">
        {evidence.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No evidence artifacts recorded.</p>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Artifact ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Source</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">SHA-256 Hash</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs">{item.id}</td>
                    <td className="p-4 align-middle font-medium">{item.source}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 align-middle font-mono text-xs max-w-[180px] truncate">
                      {item.hash}
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status === "verified"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                        }`}>
                        <FileCheck className="h-3 w-3" />
                        {item.status}
                      </span>
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