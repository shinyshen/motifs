"use client";

import { useEffect } from "react";

export default function SparklesCursor() {
  useEffect(() => {
    const sparkle = (x: number, y: number) => {
      const el = document.createElement("div");
      const size = Math.random() * 12 + 6;
      const angle = Math.random() * 360;
      const drift = (Math.random() - 0.5) * 40;
      const symbols = ["✦", "✧", "★", "✶", "*", "⁕"];
      const colors = ["#ffffff", "#e8e8e8", "#d0d0d0", "#c0c0c0", "#b8b8b8", "#ffffff"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        color: ${color};
        pointer-events: none;
        z-index: 99999;
        user-select: none;
        transform: translate(-50%, -50%) rotate(${angle}deg);
        text-shadow: 0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(192,192,192,0.5);
      `;
      document.body.appendChild(el);

      // Drift upward while fading
      let start: number | null = null;
      const anim = (ts: number) => {
        if (!start) start = ts;
        const p = (ts - start) / 700;
        el.style.transform = `translate(calc(-50% + ${drift * p}px), calc(-50% - ${20 * p}px)) rotate(${angle + p * 180}deg)`;
        el.style.opacity = String(1 - p);
        if (p < 1) requestAnimationFrame(anim);
        else el.remove();
      };
      requestAnimationFrame(anim);
    };

    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 40) return; // throttle to ~25 sparkles/sec
      last = now;
      sparkle(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
