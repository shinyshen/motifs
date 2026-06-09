"use client";

import type { StyleTimeline } from "@/types";

interface Props {
  timeline: StyleTimeline;
}

export default function TimelineView({ timeline }: Props) {
  return (
    <div className="space-y-12">
      {/* Evolution narrative */}
      <section>
        <p className="sans text-xs tracking-[0.2em] uppercase text-[#8a847c] mb-3">✦ Style evolution</p>
        <div className="editorial-card p-8 max-w-3xl">
          <p className="serif text-xl italic text-[#2e2a27] leading-relaxed">
            &ldquo;{timeline.evolution_narrative}&rdquo;
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[80px] top-0 bottom-0 w-[1px] bg-[#d4cdc4]" />

          <div className="space-y-10">
            {timeline.snapshots.map((snapshot, i) => (
              <div key={snapshot.quarter} className="flex gap-8 drop-in" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Quarter label */}
                <div className="w-[80px] flex-shrink-0 text-right pt-1">
                  <p className="serif text-xs font-bold text-[#1a1714]">{snapshot.quarter}</p>
                  <p className="sans text-[10px] text-[#8a847c]">{snapshot.pin_count} pins</p>
                </div>

                {/* Dot on timeline */}
                <div className="relative flex-shrink-0 w-4 h-4 mt-1">
                  <div className="absolute inset-0 rounded-full border-2 border-[#1a1714] bg-[#f5f0e8]" />
                </div>

                {/* Content */}
                <div className="flex-1 editorial-card p-5 -mt-1">
                  {/* Color swatches */}
                  <div className="flex gap-2 mb-3">
                    {snapshot.dominant_colors.slice(0, 5).map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-full border border-[#d4cdc4]"
                        style={{ backgroundColor: colorToApproxHex(color) }}
                        title={color}
                      />
                    ))}
                    <span className="sans text-[10px] text-[#8a847c] self-center ml-2">
                      {snapshot.dominant_colors.slice(0, 3).join(" · ")}
                    </span>
                  </div>

                  <p className="sans text-xs text-[#2e2a27] mb-1">
                    <span className="text-[#8a847c] uppercase tracking-wider text-[10px]">Silhouette: </span>
                    {snapshot.silhouette_shift}
                  </p>
                  <p className="sans text-xs text-[#2e2a27] italic">
                    {snapshot.vibe_shift}
                  </p>

                  {/* Sample pins */}
                  {snapshot.sample_pins.length > 0 && (
                    <div className="flex gap-2 mt-4 pin-cluster">
                      {snapshot.sample_pins.slice(0, 4).map((ap, j) => {
                        const url = ap.pin.media.images["400x300"]?.url ?? ap.pin.media.images["600x"].url;
                        const rotations = [-1.5, 1, -0.5, 2];
                        return (
                          <div
                            key={ap.pin.id}
                            className="polaroid w-16 flex-shrink-0"
                            style={{
                              transform: `rotate(${rotations[j % 4]}deg)`,
                              "--rotate": `${rotations[j % 4]}deg`,
                            } as React.CSSProperties}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={ap.pin.title ?? "pin"}
                              className="w-full h-16 object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

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
  return "#8a847c";
}
