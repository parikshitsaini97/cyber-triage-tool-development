"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, UserCheck, ShieldAlert, Clock } from "lucide-react";

interface InvestigationItem {
  id: string;
  subject: string;
  analyst: string;
  priority: string;
  status: string;
  summary: string;
}

export function InvestigateView() {
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestigations() {
      try {
        const response = await fetch("/api/triage");
        const data = await response.json();
        setInvestigations(data.investigations || []);
      } catch (error) {
        console.error("Failed to fetch investigation telemetry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestigations();
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
          <Search className="h-5 w-5" /> Active Incident Investigations
        </h3>
        <p className="text-sm text-muted-foreground">
          Assigned analyst cases, priority levels, and active containment plans fetched from <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/triage</code>.
        </p>
      </div>
      <div className="p-6 pt-0">
        {investigations.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No active cases recorded.</p>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Case ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Subject</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Lead Analyst</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Priority</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Summary</th>
                </tr>
              </thead>
              <tbody>
                {investigations.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs">{item.id}</td>
                    <td className="p-4 align-middle font-medium">{item.subject}</td>
                    <td className="p-4 align-middle text-xs">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <UserCheck className="h-3 w-3" /> {item.analyst}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.priority === "Critical"
                        ? "bg-red-500/15 text-red-500"
                        : "bg-orange-500/15 text-orange-500"
                        }`}>
                        <ShieldAlert className="h-3 w-3" /> {item.priority}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                        <Clock className="h-3 w-3" /> {item.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-xs text-muted-foreground max-w-[280px] truncate">
                      {item.summary}
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