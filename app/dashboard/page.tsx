"use client";

import { useState } from "react";
import type { PinterestBoard, AnalysisSession } from "@/types";
import { getMockAggregateReport, getMockTimeline } from "@/lib/claude/mock-analyzer";
import BoardSelector from "@/components/dashboard/BoardSelector";
import AnalysisProgress from "@/components/dashboard/AnalysisProgress";
import StyleReport from "@/components/dashboard/StyleReport";
import TimelineView from "@/components/dashboard/TimelineView";

type View = "boards" | "analyzing" | "report";

const DEMO_BOARDS: PinterestBoard[] = [
  { id: "1", name: "Style Inspo", description: "Everything I want to wear", pin_count: 142 },
  { id: "2", name: "Outfits", description: "Full looks I love", pin_count: 87 },
  { id: "3", name: "Wardrobe Goals", description: "Building my dream closet", pin_count: 63 },
  { id: "4", name: "Winter Fits", description: "Cold weather dressing", pin_count: 48 },
  { id: "5", name: "Minimal", description: "Less is more", pin_count: 34 },
  { id: "6", name: "Street Style", description: "Real people, real clothes", pin_count: 91 },
];

export default function DashboardPage() {
  const [view, setView] = useState<View>("boards");
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "timeline">("report");
  const [progress, setProgress] = useState(0);

  const handleBoardSelect = async (board: PinterestBoard) => {
    // Start demo analysis with fake progress
    const mockSession: AnalysisSession = {
      id: "demo",
      board_id: board.id,
      board_name: board.name,
      created_at: new Date().toISOString(),
      status: "analyzing",
      total_pins: board.pin_count,
      analyzed_pins: 0,
    };
    setSession(mockSession);
    setView("analyzing");

    // Simulate progress
    let analyzed = 0;
    const total = board.pin_count;
    const interval = setInterval(() => {
      analyzed = Math.min(analyzed + Math.floor(Math.random() * 4) + 1, total);
      setProgress(analyzed);
      setSession((s) => s ? { ...s, analyzed_pins: analyzed } : s);

      if (analyzed >= total) {
        clearInterval(interval);
        const report = getMockAggregateReport(total);
        const timeline = getMockTimeline([]);
        setSession((s) => s ? {
          ...s,
          status: "complete",
          analyzed_pins: total,
          report,
          timeline,
        } : s);
        setView("report");
      }
    }, 120);
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-baseline justify-between mb-14 border-b border-[#d4cdc4] pb-6">
        <h1 className="serif text-5xl font-black text-[#1a1714]">Motifs</h1>
        <div className="flex items-center gap-6">
          {view === "report" && (
            <>
              <button
                onClick={() => setActiveTab("report")}
                className={`sans text-xs tracking-widest uppercase ${activeTab === "report" ? "text-[#1a1714] border-b border-[#1a1714]" : "text-[#8a847c]"}`}
              >
                Style Report
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`sans text-xs tracking-widest uppercase ${activeTab === "timeline" ? "text-[#1a1714] border-b border-[#1a1714]" : "text-[#8a847c]"}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setView("boards")}
                className="sans text-xs tracking-widest uppercase text-[#8a847c] hover:text-[#1a1714] transition-colors"
              >
                ← New Board
              </button>
            </>
          )}
          <span className="sans text-xs text-[#c8a97e] tracking-wider">✦ Demo mode</span>
        </div>
      </header>

      {view === "boards" && (
        <BoardSelector boards={DEMO_BOARDS} onSelect={handleBoardSelect} />
      )}

      {view === "analyzing" && session && (
        <AnalysisProgress session={{ ...session, analyzed_pins: progress }} />
      )}

      {view === "report" && session?.report && (
        <>
          {activeTab === "report" && (
            <StyleReport report={session.report} boardName={session.board_name} />
          )}
          {activeTab === "timeline" && session.timeline && (
            <TimelineView timeline={session.timeline} />
          )}
        </>
      )}
    </div>
  );
}
