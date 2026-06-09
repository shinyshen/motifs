"use client";

import { useState, useEffect } from "react";
import type { PinterestBoard, AnalysisSession } from "@/types";
import BoardSelector from "@/components/dashboard/BoardSelector";
import AnalysisProgress from "@/components/dashboard/AnalysisProgress";
import StyleReport from "@/components/dashboard/StyleReport";
import TimelineView from "@/components/dashboard/TimelineView";

type View = "boards" | "analyzing" | "report";

export default function DashboardPage() {
  const [view, setView] = useState<View>("boards");
  const [boards, setBoards] = useState<PinterestBoard[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [activeTab, setActiveTab] = useState<"report" | "timeline">("report");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setBoards(data.boards ?? []);
      })
      .catch(() => setError("Failed to load boards"))
      .finally(() => setLoading(false));
  }, []);

  // Poll for session status when analyzing
  useEffect(() => {
    if (!sessionId || view !== "analyzing") return;

    const poll = async () => {
      const res = await fetch(`/api/analyze/${sessionId}`);
      const data = await res.json();
      setSession(data.session);

      if (data.session.status === "complete") {
        setView("report");
      } else if (data.session.status === "error") {
        setError("Analysis failed. Please try again.");
        setView("boards");
      }
    };

    const interval = setInterval(poll, 3000);
    poll(); // immediate first check
    return () => clearInterval(interval);
  }, [sessionId, view]);

  const handleBoardSelect = async (board: PinterestBoard) => {
    setError(null);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId: board.id, boardName: board.name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to start analysis");
      return;
    }
    setSessionId(data.sessionId);
    setView("analyzing");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="serif text-2xl text-[#8a847c] italic animate-pulse">
          Loading your boards...
        </p>
      </div>
    );
  }

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
          <button
            onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/"))}
            className="sans text-xs text-[#8a847c] hover:text-[#1a1714] transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 sans text-sm rounded">
          {error}
        </div>
      )}

      {view === "boards" && (
        <BoardSelector boards={boards} onSelect={handleBoardSelect} />
      )}

      {view === "analyzing" && session && (
        <AnalysisProgress session={session} />
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
