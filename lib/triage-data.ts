export type Severity = "critical" | "high" | "medium" | "low" | "info"

export type StageId =
  | "overview"
  | "evidence"
  | "classify"
  | "extract"
  | "correlate"
  | "investigate"

export interface CaseInfo {
  id: string
  name: string
  classification: string
  status: "Active" | "Under Review" | "Closed"
  priority: Severity
  lead: string
  opened: string
  subjectHost: string
  threatScore: number
  summary: string
}

export interface EvidenceItem {
  id: string
  label: string
  type: "Disk Image" | "Memory Dump" | "Network Capture" | "Mobile Extract" | "Log Archive" | "Cloud Export"
  source: string
  size: string
  sha256: string
  acquiredAt: string
  method: string
  progress: number
  status: "Verified" | "Acquiring" | "Queued" | "Integrity Failed"
  writeBlocked: boolean
}

export interface ClassificationBucket {
  id: string
  label: string
  count: number
  flagged: number
  share: number
}

export interface ExtractedArtifact {
  id: string
  category: string
  title: string
  detail: string
  source: string
  timestamp: string
  severity: Severity
  flagged: boolean
}

export interface Ioc {
  id: string
  indicator: string
  type: "IPv4" | "Domain" | "SHA-256" | "Mutex" | "Registry" | "Email"
  severity: Severity
  hits: number
  firstSeen: string
  lastSeen: string
  mitre: string
  mitreName: string
  confidence: number
  source: string
  enriched: boolean
}

export interface TimelineEvent {
  id: string
  time: string
  host: string
  source: string
  event: string
  technique: string
  severity: Severity
  iocId?: string
}

export interface CorrelationLink {
  id: string
  from: string
  to: string
  relation: string
  strength: number
}

export interface Finding {
  id: string
  title: string
  severity: Severity
  status: "Confirmed" | "Investigating" | "Contained"
  mitre: string
  narrative: string
  evidenceRefs: string[]
}

export const caseInfo: CaseInfo = {
  id: "CASE-2024-0731",
  name: "Operation Nightjar",
  classification: "Targeted Intrusion / Data Exfiltration",
  status: "Active",
  priority: "critical",
  lead: "A. Rao — Lead Examiner",
  opened: "2024-07-31 08:42 UTC",
  subjectHost: "FIN-WKS-014 (Finance Workstation)",
  threatScore: 87,
  summary:
    "Suspected spear-phishing led to credential theft and lateral movement across the finance segment. Evidence indicates staging of sensitive documents and outbound exfiltration to an unknown host.",
}

export const evidence: EvidenceItem[] = [
  {
    id: "EV-01",
    label: "System Disk — NVMe",
    type: "Disk Image",
    source: "FIN-WKS-014",
    size: "476 GB",
    sha256: "9f2b7c1e4a8d…c6e0d3f1",
    acquiredAt: "2024-07-31 09:10 UTC",
    method: "dc3dd / hardware write-blocker",
    progress: 100,
    status: "Verified",
    writeBlocked: true,
  },
  {
    id: "EV-02",
    label: "Volatile Memory",
    type: "Memory Dump",
    source: "FIN-WKS-014",
    size: "32 GB",
    sha256: "1a4de9007b2f…8ab41c22",
    acquiredAt: "2024-07-31 09:02 UTC",
    method: "WinPmem live acquisition",
    progress: 100,
    status: "Verified",
    writeBlocked: false,
  },
  {
    id: "EV-03",
    label: "Perimeter Capture",
    type: "Network Capture",
    source: "TAP-EGRESS-03",
    size: "18.4 GB",
    sha256: "77c0a5e21bd9…4f9012ea",
    acquiredAt: "2024-07-31 10:24 UTC",
    method: "Full packet capture (SPAN)",
    progress: 100,
    status: "Verified",
    writeBlocked: false,
  },
  {
    id: "EV-04",
    label: "Custodian Mobile",
    type: "Mobile Extract",
    source: "iPhone 13 — J. Mercer",
    size: "126 GB",
    sha256: "e30bb9147caa…10dd77b3",
    acquiredAt: "2024-07-31 13:55 UTC",
    method: "Advanced logical extraction",
    progress: 62,
    status: "Acquiring",
    writeBlocked: true,
  },
  {
    id: "EV-05",
    label: "SIEM Log Archive",
    type: "Log Archive",
    source: "core-siem-01",
    size: "9.1 GB",
    sha256: "b81f2266ac30…9e5510af",
    acquiredAt: "2024-07-31 11:08 UTC",
    method: "API export (signed)",
    progress: 100,
    status: "Verified",
    writeBlocked: false,
  },
  {
    id: "EV-06",
    label: "M365 Mailbox Export",
    type: "Cloud Export",
    source: "j.mercer@corp.example",
    size: "4.7 GB",
    sha256: "3cc7fa90e1b4…dd2081ff",
    acquiredAt: "2024-07-31 12:31 UTC",
    method: "eDiscovery PST export",
    progress: 100,
    status: "Integrity Failed",
    writeBlocked: false,
  },
]

export const classification: ClassificationBucket[] = [
  { id: "c1", label: "Documents", count: 48213, flagged: 214, share: 34 },
  { id: "c2", label: "Executables", count: 6120, flagged: 37, share: 4 },
  { id: "c3", label: "Images & Media", count: 71042, flagged: 12, share: 50 },
  { id: "c4", label: "Email", count: 9841, flagged: 63, share: 7 },
  { id: "c5", label: "Browser Artifacts", count: 4290, flagged: 88, share: 3 },
  { id: "c6", label: "Registry / System", count: 2011, flagged: 45, share: 1 },
  { id: "c7", label: "Credentials & Secrets", count: 342, flagged: 96, share: 1 },
]

export const artifacts: ExtractedArtifact[] = [
  {
    id: "AR-01",
    category: "Email",
    title: "Invoice_Q3_Reconciliation.docm",
    detail: "Macro-enabled attachment from spoofed vendor domain",
    source: "M365 Mailbox Export",
    timestamp: "2024-07-29 07:12 UTC",
    severity: "critical",
    flagged: true,
  },
  {
    id: "AR-02",
    category: "Executable",
    title: "svch0st.exe",
    detail: "Unsigned binary masquerading as system process in %TEMP%",
    source: "System Disk — NVMe",
    timestamp: "2024-07-29 07:18 UTC",
    severity: "critical",
    flagged: true,
  },
  {
    id: "AR-03",
    category: "Credentials",
    title: "LSASS credential material",
    detail: "Plaintext + NTLM hashes recovered from memory (Mimikatz signature)",
    source: "Volatile Memory",
    timestamp: "2024-07-29 07:41 UTC",
    severity: "critical",
    flagged: true,
  },
  {
    id: "AR-04",
    category: "Browser",
    title: "Anonymous file-share upload",
    detail: "POST 214 MB to mega-drop.example over TLS",
    source: "Browser Artifacts",
    timestamp: "2024-07-29 22:03 UTC",
    severity: "high",
    flagged: true,
  },
  {
    id: "AR-05",
    category: "Registry",
    title: "Run key persistence",
    detail: "HKCU\\...\\Run\\Updater → C:\\Users\\Public\\svch0st.exe",
    source: "Registry / System",
    timestamp: "2024-07-29 07:20 UTC",
    severity: "high",
    flagged: true,
  },
  {
    id: "AR-06",
    category: "Document",
    title: "Payroll_Master_2024.xlsx",
    detail: "Sensitive file copied to staging archive prior to exfil",
    source: "System Disk — NVMe",
    timestamp: "2024-07-29 21:40 UTC",
    severity: "medium",
    flagged: true,
  },
  {
    id: "AR-07",
    category: "Document",
    title: "Deleted: exfil_stage.7z",
    detail: "Carved from unallocated space — 2.1 GB archive",
    source: "System Disk — NVMe",
    timestamp: "2024-07-29 21:55 UTC",
    severity: "high",
    flagged: true,
  },
]

export const iocs: Ioc[] = [
  {
    id: "IOC-01",
    indicator: "45.148.10.77",
    type: "IPv4",
    severity: "critical",
    hits: 34,
    firstSeen: "2024-07-29 07:22 UTC",
    lastSeen: "2024-07-29 22:05 UTC",
    mitre: "T1071.001",
    mitreName: "Web Protocols (C2)",
    confidence: 96,
    source: "Perimeter Capture",
    enriched: true,
  },
  {
    id: "IOC-02",
    indicator: "mega-drop.example",
    type: "Domain",
    severity: "high",
    hits: 6,
    firstSeen: "2024-07-29 21:58 UTC",
    lastSeen: "2024-07-29 22:04 UTC",
    mitre: "T1567.002",
    mitreName: "Exfil to Cloud Storage",
    confidence: 89,
    source: "Browser Artifacts",
    enriched: true,
  },
  {
    id: "IOC-03",
    indicator: "a3f1…svch0st.exe",
    type: "SHA-256",
    severity: "critical",
    hits: 3,
    firstSeen: "2024-07-29 07:18 UTC",
    lastSeen: "2024-07-29 21:40 UTC",
    mitre: "T1055",
    mitreName: "Process Injection",
    confidence: 94,
    source: "System Disk — NVMe",
    enriched: true,
  },
  {
    id: "IOC-04",
    indicator: "Global\\NjM0tex01",
    type: "Mutex",
    severity: "medium",
    hits: 1,
    firstSeen: "2024-07-29 07:19 UTC",
    lastSeen: "2024-07-29 07:19 UTC",
    mitre: "T1057",
    mitreName: "Process Discovery",
    confidence: 71,
    source: "Volatile Memory",
    enriched: false,
  },
  {
    id: "IOC-05",
    indicator: "HKCU\\...\\Run\\Updater",
    type: "Registry",
    severity: "high",
    hits: 1,
    firstSeen: "2024-07-29 07:20 UTC",
    lastSeen: "2024-07-29 07:20 UTC",
    mitre: "T1547.001",
    mitreName: "Registry Run Keys",
    confidence: 85,
    source: "Registry / System",
    enriched: true,
  },
  {
    id: "IOC-06",
    indicator: "billing@vend0r-invoices.example",
    type: "Email",
    severity: "high",
    hits: 2,
    firstSeen: "2024-07-29 07:12 UTC",
    lastSeen: "2024-07-29 07:12 UTC",
    mitre: "T1566.001",
    mitreName: "Spearphishing Attachment",
    confidence: 92,
    source: "M365 Mailbox Export",
    enriched: true,
  },
]

export const timeline: TimelineEvent[] = [
  {
    id: "T-01",
    time: "07-29 07:12",
    host: "FIN-WKS-014",
    source: "Mailbox",
    event: "Phishing email delivered with macro attachment",
    technique: "T1566.001",
    severity: "high",
    iocId: "IOC-06",
  },
  {
    id: "T-02",
    time: "07-29 07:18",
    host: "FIN-WKS-014",
    source: "Endpoint",
    event: "svch0st.exe written to %TEMP% and executed",
    technique: "T1204.002",
    severity: "critical",
    iocId: "IOC-03",
  },
  {
    id: "T-03",
    time: "07-29 07:20",
    host: "FIN-WKS-014",
    source: "Registry",
    event: "Run key persistence established",
    technique: "T1547.001",
    severity: "high",
    iocId: "IOC-05",
  },
  {
    id: "T-04",
    time: "07-29 07:22",
    host: "FIN-WKS-014",
    source: "Network",
    event: "First C2 beacon to 45.148.10.77:443",
    technique: "T1071.001",
    severity: "critical",
    iocId: "IOC-01",
  },
  {
    id: "T-05",
    time: "07-29 07:41",
    host: "FIN-WKS-014",
    source: "Memory",
    event: "LSASS access — credential dumping detected",
    technique: "T1003.001",
    severity: "critical",
  },
  {
    id: "T-06",
    time: "07-29 14:07",
    host: "FIN-DC-01",
    source: "Auth Log",
    event: "Lateral auth using stolen finance credentials",
    technique: "T1021.002",
    severity: "high",
  },
  {
    id: "T-07",
    time: "07-29 21:40",
    host: "FIN-WKS-014",
    source: "Filesystem",
    event: "Sensitive files staged into exfil_stage.7z",
    technique: "T1074.001",
    severity: "medium",
  },
  {
    id: "T-08",
    time: "07-29 22:03",
    host: "FIN-WKS-014",
    source: "Network",
    event: "214 MB uploaded to mega-drop.example",
    technique: "T1567.002",
    severity: "critical",
    iocId: "IOC-02",
  },
]

export const correlations: CorrelationLink[] = [
  { id: "L1", from: "IOC-06", to: "IOC-03", relation: "delivered payload", strength: 92 },
  { id: "L2", from: "IOC-03", to: "IOC-01", relation: "initiated C2", strength: 90 },
  { id: "L3", from: "IOC-03", to: "IOC-05", relation: "created persistence", strength: 85 },
  { id: "L4", from: "IOC-01", to: "IOC-02", relation: "preceded exfil", strength: 78 },
]

export const findings: Finding[] = [
  {
    id: "F-01",
    title: "Initial Access via Spearphishing Attachment",
    severity: "critical",
    status: "Confirmed",
    mitre: "T1566.001",
    narrative:
      "A macro-enabled invoice from a look-alike vendor domain was opened by the custodian, dropping svch0st.exe and beginning the intrusion.",
    evidenceRefs: ["AR-01", "AR-02", "IOC-06"],
  },
  {
    id: "F-02",
    title: "Credential Access & Lateral Movement",
    severity: "critical",
    status: "Confirmed",
    mitre: "T1003.001",
    narrative:
      "Memory forensics recovered LSASS credential material consistent with Mimikatz; stolen finance credentials were reused against FIN-DC-01.",
    evidenceRefs: ["AR-03", "IOC-04"],
  },
  {
    id: "F-03",
    title: "Data Staged and Exfiltrated",
    severity: "high",
    status: "Investigating",
    mitre: "T1567.002",
    narrative:
      "Payroll and finance documents were compressed into a staging archive and 214 MB was uploaded to an anonymous file-sharing host over TLS.",
    evidenceRefs: ["AR-06", "AR-07", "IOC-02"],
  },
  {
    id: "F-04",
    title: "Persistence via Registry Run Key",
    severity: "high",
    status: "Contained",
    mitre: "T1547.001",
    narrative:
      "A user-level Run key relaunched svch0st.exe at logon. The key has been documented and removed from the isolated host.",
    evidenceRefs: ["AR-05", "IOC-05"],
  },
]

export const pipelineStages: { id: StageId; label: string; blurb: string }[] = [
  { id: "evidence", label: "Acquire", blurb: "Forensically sound collection" },
  { id: "classify", label: "Classify", blurb: "Categorize the data set" },
  { id: "extract", label: "Extract", blurb: "Surface key artifacts" },
  { id: "correlate", label: "Correlate", blurb: "Link IOCs & events" },
  { id: "investigate", label: "Investigate", blurb: "Build the case" },
]
