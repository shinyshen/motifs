"use client";

import type { AnalysisSession } from "@/types";

interface Props {
  session: AnalysisSession;
}

const STYLIST_ASIDES = [
  "Reading silhouettes...",
  "Noting hardware signatures...",
  "Mapping your color story...",
  "Watching for texture patterns...",
  "Tracking proportion habits...",
  "Looking for aesthetic tensions...",
  "Identifying your style signals...",
  "Almost — pulling it all together...",
];

export default function AnalysisProgress({ session }: Props) {
  const pct = session.total_pins > 0
    ? Math.round((session.analyzed_pins / session.total_pins) * 100)
    : 0;

  const asideIndex = Math.min(
    Math.floor((pct / 100) * STYLIST_ASIDES.length),
    STYLIST_ASIDES.length - 1
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Large rotating number */}
      <div className="relative mb-8">
        <span className="serif text-[120px] font-black text-[#d4cdc4] leading-none select-none">
          {pct}
        </span>
        <span className="serif text-3xl font-bold text-[#8a847c] absolute bottom-6 right-[-24px]">%</span>
      </div>

      <p className="serif text-xl italic text-[#8a847c] mb-8 animate-pulse">
        {STYLIST_ASIDES[asideIndex]}
      </p>

      {/* Progress bar — editorial style */}
      <div className="w-80 h-[2px] bg-[#d4cdc4] mb-4">
        <div
          className="h-full bg-[#1a1714] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="sans text-xs text-[#8a847c] tracking-widest uppercase">
        {session.analyzed_pins} of {session.total_pins} pins analyzed
      </p>

      <p className="sans text-xs text-[#c8a97e] mt-6 max-w-xs">
        This usually takes 1–3 minutes depending on board size.
      </p>
    </div>
  );
}
