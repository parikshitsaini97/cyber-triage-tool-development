"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert, Tag } from "lucide-react";

interface ClassificationItem {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
  description: string;
}

export function ClassifyView() {
  const [classifications, setClassifications] = useState<ClassificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClassifications() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();
        setClassifications(data.classifications || []);
      } catch (error) {
        console.error("Failed to fetch classification telemetry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClassifications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <span className="inline-flex items-center rounded-full bg-red-500/15 text-red-500 px-2.5 py-0.5 text-xs font-semibold">Critical</span>;
      case "high":
        return <span className="inline-flex items-center rounded-full bg-orange-500/15 text-orange-500 px-2.5 py-0.5 text-xs font-semibold">High</span>;
      case "medium":
        return <span className="inline-flex items-center rounded-full bg-yellow-500/15 text-yellow-500 px-2.5 py-0.5 text-xs font-semibold">Medium</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">Low</span>;
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" /> Threat Classification
        </h3>
        <p className="text-sm text-muted-foreground">
          Categorized threat indicators and confidence scores retrieved from <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/triage</code>.
        </p>
      </div>
      <div className="p-6 pt-0">
        {classifications.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No threat classifications recorded.</p>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Rule ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Severity</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Confidence</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {classifications.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs">{item.id}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        <Tag className="h-3 w-3" />
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{getSeverityBadge(item.severity)}</td>
                    <td className="p-4 align-middle font-mono text-xs">{item.confidence}%</td>
                    <td className="p-4 align-middle text-sm">{item.description}</td>
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
