"use client";

import { useState } from "react";
import type { PinterestBoard } from "@/types";

interface Props {
  boards: PinterestBoard[];
  onSelect: (board: PinterestBoard) => void;
}

const WASHI = ["washi-tape", "washi-tape-green", "washi-tape-pink"];
const ANNOTATIONS = ["so many good ones →", "this one first!", "obsessed with this"];

const BOARD_IMAGES: Record<string, string[]> = {
  outfits: [
    "/boards/outfits/4689ac4088ad9ec95c11856224feeacf.jpg",
    "/boards/outfits/562af25b03bb6d9b45eae9ecb34daaf5.jpg",
    "/boards/outfits/65bf036e5557d311848f468beb3acd3b.jpg",
    "/boards/outfits/9a9b05cbe65db7894aae07334dbd694d.jpg",
  ],
  nails: [
    "/boards/nails/3030e092895c19d7b2d1fa64cf843893.jpg",
    "/boards/nails/3fb42491452d5dd3571c802c5a5d7283.jpg",
    "/boards/nails/4279c0aba4eefe0d5d0379da6f2d59e4.jpg",
    "/boards/nails/9a25b5e2fda18eec275602b7c23bf0b0.jpg",
  ],
  "home decor": [
    "/boards/home-decor/023395da784545a7ea7be9f571502a87.jpg",
    "/boards/home-decor/34d4e90bb75e31503497be0cf67507cb.jpg",
    "/boards/home-decor/f4fc649bc566f02bb5c5940b1239af78.jpg",
    "/boards/home-decor/f777612041435d95fed81ee8bbbbcd19.jpg",
  ],
};

// Fan angles for the back cards (behind the front card)
const FAN_ANGLES = [-18, -8, 8, 18];

function BoardCard({ board, index, onSelect }: { board: PinterestBoard; index: number; onSelect: (b: PinterestBoard) => void }) {
  const [hovered, setHovered] = useState(false);
  const images = BOARD_IMAGES[board.name.toLowerCase()] ?? [];
  // First image is the cover (front of deck), rest fan behind
  const [cover, ...rest] = images;

  // Base tilt for each card on the page
  const baseTilts = [-4, 2, -2];
  const baseTilt = baseTilts[index % baseTilts.length];

  return (
    <div
      className={`relative ${WASHI[index % WASHI.length]}`}
      style={{
        // Stagger cards vertically so fans have room
        marginTop: index === 1 ? "60px" : index === 2 ? "20px" : "0px",
      }}
    >
      <button
        onClick={() => onSelect(board)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="text-left magazine-item relative w-full"
        style={{ transform: `rotate(${baseTilt}deg)`, transformOrigin: "bottom center" }}
      >

        {/* Back cards — fan from behind the cover */}
        {rest.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-white p-1.5 pb-8"
            style={{
              transform: hovered
                ? `rotate(${FAN_ANGLES[i]}deg)`
                : `rotate(${(i + 1) * 2}deg)`,
              transformOrigin: "bottom center",
              transition: `transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 50}ms`,
              zIndex: i + 1,
              boxShadow: "2px 4px 12px rgba(0,0,0,0.13)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full object-cover" style={{ height: "140px", boxShadow: "none" }} />
          </div>
        ))}

        {/* Front cover card */}
        <div className="photo-card relative z-10">
          {cover ? (
            <div className="overflow-hidden" style={{ height: "140px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={board.name} className="w-full h-full object-cover" style={{ boxShadow: "none" }} />
            </div>
          ) : (
            <div className="flex items-center justify-center text-4xl" style={{ height: "140px", background: `hsl(${(index * 47 + 330) % 360}, 60%, 85%)` }}>
              ✦
            </div>
          )}
          <div className="pt-2 px-1">
            <p className="font-serif font-bold text-[#2a1414] text-base leading-tight">{board.name}</p>
            <p className="font-sans text-[10px] text-[#9a8a8a] mt-0.5">{board.pin_count} pins</p>
          </div>
        </div>
      </button>

      <p
        className="handwriting text-[#aaa] text-base mt-3"
        style={{ transform: "rotate(-1deg)", textAlign: index % 2 === 1 ? "right" : "left", marginLeft: index % 2 === 1 ? "0" : "4px" }}
      >
        {ANNOTATIONS[index % ANNOTATIONS.length]}
      </p>
    </div>
  );
}

export default function BoardSelector({ boards, onSelect }: Props) {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="text-center mb-16 relative">
        <h1 className="font-serif font-black text-[#2d2d2d] leading-none" style={{ fontSize: "clamp(72px, 14vw, 160px)" }}>
          Pick one.
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-24 max-w-4xl mx-auto pb-24 relative">
        {/* Embellishments */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/step2.png" alt="" className="absolute pointer-events-none" style={{ width: "180px", top: "-40px", left: "30%", transform: "rotate(12deg) translateX(-50%)", zIndex: 5, boxShadow: "none", mixBlendMode: "multiply" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/step3.png" alt="" className="absolute pointer-events-none" style={{ width: "150px", top: "38%", right: "-30px", transform: "rotate(-8deg)", zIndex: 5, boxShadow: "none", mixBlendMode: "multiply" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/step1.png" alt="" className="absolute pointer-events-none" style={{ width: "140px", top: "55%", left: "38%", transform: "rotate(6deg) translateX(-50%)", zIndex: 5, boxShadow: "none", mixBlendMode: "multiply" }} />

        {boards.map((board, i) => (
          <BoardCard key={board.id} board={board} index={i} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
