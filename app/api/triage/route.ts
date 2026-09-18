import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        evidence: [
            {
                id: "EVD-8021",
                source: "DC01-MAIN.corp.internal",
                type: "Memory Dump",
                hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                timestamp: "2026-09-19T02:14:00Z",
                status: "verified"
            },
            {
                id: "EVD-8022",
                source: "FW-EDGE-PRIMARY",
                type: "PCAP Stream",
                hash: "4a8a08f09d37b73795649038408b5f33fe7ed5802f4fc01861e38b3463991206",
                timestamp: "2026-09-19T02:30:15Z",
                status: "verified"
            },
            {
                id: "EVD-8023",
                source: "WS-FINANCE-04",
                type: "MFT Artifact",
                hash: "7d0107297e5989f5c490a6e3559d83df2327777778b02e779a502c34a1b023e1",
                timestamp: "2026-09-19T03:01:40Z",
                status: "pending"
            }
        ],
        classifications: [
            {
                id: "RULE-901",
                category: "Credential Dumping",
                severity: "critical",
                confidence: 96,
                description: "LSASS memory handle opened by untrusted binary."
            },
            {
                id: "RULE-442",
                category: "Lateral Movement",
                severity: "high",
                confidence: 84,
                description: "WinRM remote session established with non-standard admin privileges."
            }
        ],
        artifacts: [
            {
                id: "ART-101",
                name: "lsass_dump.dmp",
                path: "C:\\Windows\\System32\\lsass.exe",
                type: "Process Memory",
                size: "142 MB",
                flagged: true
            },
            {
                id: "ART-102",
                name: "powershell_history.txt",
                path: "C:\\Users\\Administrator\\AppData\\Roaming\\PowerShell\\...",
                type: "Command Log",
                size: "12 KB",
                flagged: true
            },
            {
                id: "ART-103",
                name: "netuse_exec.sys",
                path: "C:\\Windows\\Temp\\netuse_exec.sys",
                type: "Driver Artifact",
                size: "84 KB",
                flagged: false
            }
        ],
        iocs: [
            {
                id: "IOC-301",
                type: "IPv4 Address",
                value: "185.220.101.5",
                threat: "Cobalt Strike C2 Node",
                status: "active"
            },
            {
                id: "IOC-302",
                type: "Domain",
                value: "update-service-auth.com",
                threat: "Exfiltration Endpoint",
                status: "blocked"
            },
            {
                id: "IOC-303",
                type: "SHA-256",
                value: "4a8a08f09d37b73795649038408b5f33fe7ed5802f4fc01861e38b3463991206",
                threat: "Custom Reverse Shell Payload",
                status: "blocked"
            }
        ],
        investigations: [
            {
                id: "INV-501",
                subject: "DC01 Lateral Access via WinRM",
                analyst: "Parikshit Saini",
                priority: "Critical",
                status: "In Progress",
                summary: "Suspicious WinRM connection initiated from WS-FINANCE-04 targeting DC01-MAIN using harvested domain credentials."
            },
            {
                id: "INV-502",
                subject: "LSASS Process Memory Inspection",
                analyst: "Parikshit Saini",
                priority: "High",
                status: "Containment Pending",
                summary: "Extracted memory dump contains credential dumping signatures. Host isolation recommended."
            }
        ]
    });
}