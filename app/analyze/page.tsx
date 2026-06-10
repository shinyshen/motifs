"use client";

import { useState } from "react";
import Link from "next/link";
import type { PinterestBoard, AnalysisSession } from "@/types";
import { getMockAggregateReport, getMockTimeline } from "@/lib/claude/mock-analyzer";
import BoardSelector from "@/components/dashboard/BoardSelector";
import AnalysisProgress from "@/components/dashboard/AnalysisProgress";
import StyleReport from "@/components/dashboard/StyleReport";
import TimelineView from "@/components/dashboard/TimelineView";

type View = "boards" | "analyzing" | "report";

const DEMO_BOARDS: PinterestBoard[] = [
  { id: "outfits", name: "Outfits", description: "Full looks and style inspo", pin_count: 7 },
  { id: "nails", name: "Nails", description: "Nail art and manicure inspiration", pin_count: 6 },
  { id: "home decor", name: "Home Decor", description: "Interior and home inspiration", pin_count: 5 },
];

export default function AnalyzePage() {
  const [view, setView] = useState<View>("boards");
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "timeline">("report");
  const [progress, setProgress] = useState(0);

  const handleBoardSelect = async (board: PinterestBoard) => {
    const newSession: AnalysisSession = {
      id: "local",
      board_id: board.id,
      board_name: board.name,
      created_at: new Date().toISOString(),
      status: "analyzing",
      total_pins: board.pin_count,
      analyzed_pins: 0,
    };
    setSession(newSession);
    setView("analyzing");

    // Simulate progress ticking while the API runs
    let analyzed = 0;
    const total = board.pin_count;
    const interval = setInterval(() => {
      analyzed = Math.min(analyzed + 1, total - 1);
      setProgress(analyzed);
      setSession((s) => s ? { ...s, analyzed_pins: analyzed } : s);
    }, 1500);

    try {
      const res = await fetch("/api/analyze-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardName: board.name }),
      });
      const data = await res.json();
      clearInterval(interval);
      setProgress(total);
      const timeline = getMockTimeline([]);
      setSession((s) => s ? { ...s, status: "complete", analyzed_pins: total, report: data.report, timeline } : s);
      setView("report");
    } catch (err) {
      clearInterval(interval);
      console.error("Analysis failed:", err);
      // Fall back to mock on error
      const report = getMockAggregateReport(total);
      const timeline = getMockTimeline([]);
      setSession((s) => s ? { ...s, status: "complete", analyzed_pins: total, report, timeline } : s);
      setView("report");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf7f2" }}>
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/motif_logo.png" alt="Motifs" className="h-32 w-auto hover:opacity-70 transition-opacity" style={{ boxShadow: "none" }} />
        </Link>
        <div className="flex items-center gap-6">
          {view === "report" && (
            <>
              <button onClick={() => setActiveTab("report")} className={`font-sans text-xs tracking-widest uppercase ${activeTab === "report" ? "text-[#2d2d2d] border-b border-[#f4a0c0] pb-0.5" : "text-[#aaa]"}`}>Style Report</button>
              <button onClick={() => setActiveTab("timeline")} className={`font-sans text-xs tracking-widest uppercase ${activeTab === "timeline" ? "text-[#2d2d2d] border-b border-[#f4a0c0] pb-0.5" : "text-[#aaa]"}`}>Timeline</button>
              <button onClick={() => { setView("boards"); setProgress(0); }} className="font-sans text-xs tracking-widest uppercase text-[#aaa] hover:text-[#2d2d2d] transition-colors">← Back</button>
            </>
          )}
          <span className="handwriting text-[#f4a0c0] text-base">demo mode</span>
        </div>
      </nav>

      {view === "boards" && <BoardSelector boards={DEMO_BOARDS} onSelect={handleBoardSelect} />}
      {view === "analyzing" && session && <AnalysisProgress session={{ ...session, analyzed_pins: progress }} />}
      {view === "report" && session?.report && (
        <div className="px-8 py-10 max-w-6xl mx-auto">
          {activeTab === "report" && <StyleReport report={session.report} boardName={session.board_name} />}
          {activeTab === "timeline" && session.timeline && <TimelineView timeline={session.timeline} />}
        </div>
      )}
    </div>
  );
}
