# Sentinel Triage - DFIR Platform

A Digital Forensics and Incident Response (DFIR) triage dashboard built with Next.js, TypeScript, and Tailwind CSS. The platform visualizes live security telemetry across five incident pipeline stages.

## Features

- **Command Center:** Aggregated metrics across all active pipeline stages.
- **01 Evidence & Acquisition:** Raw logs, memory dumps, and forensic artifacts ingested from `/api/triage`.
- **02 Classification:** Threat indicators with confidence scores and severity levels.
- **03 Artifact Extraction:** Forensic strings, system paths, and process memory dumps.
- **04 IOC Correlation:** Threat intelligence matching for IPs, hashes, and domains.
- **05 Investigation:** Active analyst case assignments, containment status, and summaries.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Backend API:** `/api/triage`

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/parikshitsaini97/cyber-triage-tool-development.git](https://github.com/parikshitsaini97/cyber-triage-tool-development.git)
   cd cyber-triage-tool-development