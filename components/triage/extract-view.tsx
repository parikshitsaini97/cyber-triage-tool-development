"use client";

import { useEffect, useState } from "react";
import { Loader2, FileCode, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ArtifactItem {
  id: string;
  name: string;
  path: string;
  type: string;
  size: string;
  flagged: boolean;
}

export function ExtractView() {
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtifacts() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();
        setArtifacts(data.artifacts || []);
      } catch (error) {
        console.error("Failed to fetch extracted artifacts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArtifacts();
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
          <FileCode className="h-5 w-5" /> Artifact Extraction
        </h3>
        <p className="text-sm text-muted-foreground">
          Extracted forensic strings, registry hives, and execution trails ingested from <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/triage</code>.
        </p>
      </div>
      <div className="p-6 pt-0">
        {artifacts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No extracted artifacts recorded.</p>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Artifact Name</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">System Path</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Size</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {artifacts.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs">{item.id}</td>
                    <td className="p-4 align-middle font-medium">{item.name}</td>
                    <td className="p-4 align-middle font-mono text-xs max-w-[220px] truncate">{item.path}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 align-middle font-mono text-xs">{item.size}</td>
                    <td className="p-4 align-middle">
                      {item.flagged ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-500 px-2.5 py-0.5 text-xs font-semibold">
                          <AlertTriangle className="h-3 w-3" /> Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 text-xs font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Clean
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