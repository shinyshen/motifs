"use client";

import type { AnalysisSession } from "@/types";

interface Props {
  session: AnalysisSession;
}

const ASIDES = [
  "reading your silhouettes...",
  "noting hardware signatures...",
  "mapping your color story...",
  "watching for texture patterns...",
  "tracking proportion habits...",
  "looking for tensions...",
  "identifying your signals...",
  "almost done...",
];

export default function AnalysisProgress({ session }: Props) {
  const pct = session.total_pins > 0
    ? Math.round((session.analyzed_pins / session.total_pins) * 100)
    : 0;
  const aside = ASIDES[Math.min(Math.floor((pct / 100) * ASIDES.length), ASIDES.length - 1)];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-8">
      {/* Big number */}
      <div className="relative mb-6">
        <span
          className="font-serif font-black text-[#2d2d2d] leading-none select-none"
          style={{ fontSize: "clamp(100px, 20vw, 180px)", opacity: 0.08 }}
        >
          {pct}%
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif font-black text-[#2d2d2d]" style={{ fontSize: "clamp(60px, 12vw, 120px)" }}>
            {pct}<span className="text-4xl">%</span>
          </span>
        </div>
      </div>

      <p className="handwriting text-[#f4a0c0] text-2xl mb-10 animate-pulse">{aside}</p>

      {/* Progress bar */}
      <div className="w-72 h-1 mb-4 rounded-full" style={{ backgroundColor: "#e8d0d0" }}>
        <div
          className="h-full bg-[#f4a0c0] transition-all duration-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="font-sans text-xs text-[#aaa] tracking-widest uppercase">
        {session.analyzed_pins} of {session.total_pins} pins
      </p>
    </div>
  );
}
