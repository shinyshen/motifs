"use client";

import type { AggregateStyleReport } from "@/types";

interface Props {
  report: AggregateStyleReport;
  boardName: string;
}

export default function StyleReport({ report, boardName }: Props) {
  return (
    <div className="space-y-16">
      {/* Hero summary */}
      <section>
        <p className="sans text-xs tracking-[0.2em] uppercase text-[#8a847c] mb-3">✦ Your style report</p>
        <h2 className="serif text-5xl font-black text-[#1a1714] leading-tight mb-6 max-w-2xl">
          {boardName}
        </h2>
        <div className="editorial-card p-8 max-w-3xl">
          <p className="serif text-xl italic text-[#2e2a27] leading-relaxed mb-4">
            &ldquo;{report.stylist_summary}&rdquo;
          </p>
          <p className="sans text-xs text-[#8a847c] tracking-wider uppercase">
            Based on {report.total_pins_analyzed} pins
          </p>
        </div>
      </section>

      {/* Color palette */}
      <section>
        <SectionLabel>Color Story</SectionLabel>
        <p className="sans text-sm text-[#8a847c] mb-6 max-w-xl">{report.color_story}</p>
        <div className="flex flex-wrap gap-3">
          {report.dominant_colors.map(({ color, frequency }) => (
            <div key={color} className="flex flex-col items-center gap-2">
              {/* Color swatch — circular, hand-drawn feel via border */}
              <div
                className="w-14 h-14 rounded-full border-2 border-[#d4cdc4]"
                style={{ backgroundColor: colorToApproxHex(color) }}
                title={color}
              />
              <p className="sans text-[10px] text-[#8a847c] text-center max-w-[60px] leading-tight">
                {color}
              </p>
              <p className="sans text-[10px] text-[#c8a97e] font-medium">
                {Math.round(frequency * 100)}%
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Silhouette patterns */}
      <section>
        <SectionLabel>Silhouette & Proportions</SectionLabel>
        <div className="space-y-3 max-w-lg">
          {report.silhouette_patterns.slice(0, 5).map(({ pattern, frequency }) => (
            <div key={pattern} className="flex items-center gap-4">
              {/* Bar */}
              <div className="flex-1 h-[3px] bg-[#e8d9c4]">
                <div
                  className="h-full bg-[#1a1714] transition-all duration-1000"
                  style={{ width: `${frequency * 100}%` }}
                />
              </div>
              <p className="sans text-xs text-[#2e2a27] w-52 text-right">{pattern}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Texture signatures */}
      <section>
        <SectionLabel>Texture & Material Signatures</SectionLabel>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          {report.texture_signatures.map(({ texture, frequency }) => (
            <span
              key={texture}
              className="editorial-card px-3 py-1.5 sans text-xs text-[#2e2a27]"
              style={{ fontSize: `${0.65 + frequency * 0.6}rem` }}
            >
              {texture}
            </span>
          ))}
        </div>
      </section>

      {/* Hardware & details */}
      <section>
        <SectionLabel>Hardware & Details</SectionLabel>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {report.hardware_signatures.map(({ detail, frequency }) => (
            <div key={detail} className="flex items-start gap-2">
              <span className="text-[#c8a97e] text-xs mt-0.5">✦</span>
              <div>
                <p className="sans text-xs text-[#2e2a27]">{detail}</p>
                <p className="sans text-[10px] text-[#8a847c]">{Math.round(frequency * 100)}% of pins</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Garment frequency */}
      <section>
        <SectionLabel>What You Keep Saving</SectionLabel>
        <div className="space-y-2 max-w-sm">
          {report.garment_frequency.slice(0, 8).map(({ garment, count }) => (
            <div key={garment} className="flex items-center justify-between">
              <p className="sans text-sm text-[#2e2a27]">{garment}</p>
              <p className="serif font-bold text-lg text-[#c8a97e]">{count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Style signals cloud */}
      <section>
        <SectionLabel>Top Aesthetic Signals</SectionLabel>
        <div className="space-y-2 max-w-2xl">
          {report.top_style_signals.slice(0, 6).map(({ signal, count }) => (
            <div key={signal} className="flex items-start gap-3 border-b border-[#e8d9c4] pb-2">
              <span className="sans text-xs text-[#c8a97e] font-bold w-6 text-right flex-shrink-0 mt-0.5">
                {count}×
              </span>
              <p className="sans text-sm text-[#2e2a27] italic">{signal}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aesthetic tensions */}
      {report.aesthetic_tensions.length > 0 && (
        <section>
          <SectionLabel>Tensions & Contradictions</SectionLabel>
          <div className="space-y-3 max-w-xl">
            {report.aesthetic_tensions.map((tension, i) => (
              <div key={i} className="editorial-card px-5 py-4 border-l-2 border-l-[#c8a97e]">
                <p className="sans text-sm text-[#2e2a27] italic">{tension}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shopping note */}
      <section className="border-t-2 border-[#1a1714] pt-10">
        <p className="sans text-xs tracking-[0.2em] uppercase text-[#8a847c] mb-3">✦ Stylist&apos;s note</p>
        <p className="serif text-2xl font-bold text-[#1a1714] max-w-2xl leading-relaxed">
          {report.shopping_note}
        </p>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h3 className="serif text-2xl font-bold text-[#1a1714]">{children}</h3>
      <div className="flex-1 h-[1px] bg-[#d4cdc4]" />
    </div>
  );
}

// Very rough color name → hex approximation for swatches
function colorToApproxHex(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("black") || n.includes("ink") || n.includes("ebony")) return "#2a2520";
  if (n.includes("white") || n.includes("ivory") || n.includes("cream")) return "#f5f0e8";
  if (n.includes("red") || n.includes("oxblood") || n.includes("burgundy")) return "#7c2d2d";
  if (n.includes("blue") || n.includes("navy") || n.includes("cobalt")) return "#2d3f6b";
  if (n.includes("green") || n.includes("olive") || n.includes("forest")) return "#4a5d3a";
  if (n.includes("tan") || n.includes("camel") || n.includes("sand") || n.includes("beige")) return "#c8a97e";
  if (n.includes("grey") || n.includes("gray") || n.includes("ash")) return "#8a847c";
  if (n.includes("brown") || n.includes("chocolate") || n.includes("mocha")) return "#5c3d2e";
  if (n.includes("pink") || n.includes("blush") || n.includes("rose")) return "#d4a5a5";
  if (n.includes("purple") || n.includes("plum") || n.includes("mauve")) return "#7c5c7c";
  if (n.includes("yellow") || n.includes("mustard") || n.includes("gold")) return "#c8a040";
  if (n.includes("orange") || n.includes("rust") || n.includes("terracotta")) return "#c86040";
  return "#8a847c"; // fallback
}
