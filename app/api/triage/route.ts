import { NextResponse } from "next/server";

export async function GET() {
    const dfirData = {
        systemStatus: "CRITICAL",
        totalAlerts: 14,
        suspiciousProcesses: [
            { pid: 4082, name: "powershell.exe", path: "C:\\Windows\\System32", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", severity: "High" },
            { pid: 1104, name: "cmd.exe", path: "C:\\Windows\\System32", hash: "8f48508f7b76408298ed3383a152e05f63d04d80a15320d91d9d71c13d332402", severity: "Medium" }
        ]
    };

    return NextResponse.json(dfirData);
}