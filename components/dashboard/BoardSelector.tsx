"use client";

import type { PinterestBoard } from "@/types";

interface Props {
  boards: PinterestBoard[];
  onSelect: (board: PinterestBoard) => void;
}

export default function BoardSelector({ boards, onSelect }: Props) {
  return (
    <div>
      <div className="mb-10">
        <p className="sans text-xs tracking-[0.2em] uppercase text-[#8a847c] mb-2">✦ Step one</p>
        <h2 className="serif text-4xl font-bold text-[#1a1714]">Choose a board to analyze</h2>
        <p className="sans text-sm text-[#8a847c] mt-2">
          We&apos;ll read every saved pin and find your recurring patterns.
        </p>
      </div>

      {boards.length === 0 ? (
        <p className="sans text-sm text-[#8a847c] italic">No boards found on this account.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board, i) => (
            <button
              key={board.id}
              onClick={() => onSelect(board)}
              className="drop-in text-left editorial-card p-5 hover:bg-[#e4ddd3] transition-colors group"
              style={{
                "--rotate": `${[-1, 0.5, -0.5, 1, 0, -1.5][i % 6]}deg` as string,
                animationDelay: `${i * 60}ms`,
              } as React.CSSProperties}
            >
              {board.media?.image_cover_url && (
                <div className="mb-4 overflow-hidden h-36 bg-[#d4cdc4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={board.media.image_cover_url}
                    alt={board.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <p className="serif text-lg font-bold text-[#1a1714] leading-tight mb-1">{board.name}</p>
              {board.description && (
                <p className="sans text-xs text-[#8a847c] line-clamp-2 mb-2">{board.description}</p>
              )}
              <p className="sans text-xs text-[#c8a97e] tracking-wider uppercase">
                {board.pin_count} pins →
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
