import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  // If a test token is set, skip the login page entirely
  if (process.env.PINTEREST_TEST_TOKEN) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Decorative background words */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-[15%] left-[8%] text-[120px] font-black serif text-[#d4cdc4] opacity-40 leading-none">
          STYLE
        </span>
        <span className="absolute bottom-[20%] right-[6%] text-[90px] font-black serif text-[#d4cdc4] opacity-30 leading-none rotate-[-3deg]">
          MOTIFS
        </span>
      </div>

      <div className="relative z-10 text-center max-w-xl">
        <p className="sans text-xs tracking-[0.2em] uppercase text-[#8a847c] mb-6">
          ✦ A personal style intelligence tool
        </p>

        <h1 className="serif text-[72px] font-black leading-[0.9] tracking-tight text-[#1a1714] mb-8">
          Motifs
        </h1>

        <p className="sans text-base text-[#2e2a27] leading-relaxed mb-10 max-w-sm mx-auto">
          Connect your Pinterest boards. Let AI read your saves like a sharp-eyed stylist — and tell you what it sees.
        </p>

        <Link
          href="/api/auth/login"
          className="inline-block bg-[#1a1714] text-[#f5f0e8] sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#2e2a27] transition-colors"
        >
          Connect Pinterest →
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-6 text-left border-t border-[#d4cdc4] pt-10">
          {[
            { label: "Pattern Recognition", desc: "Textures, silhouettes, hardware signatures across every saved pin." },
            { label: "Style Evolution", desc: "How your palette and proportions have shifted — quarter by quarter." },
            { label: "Stylist Notes", desc: "What you keep saving and what&apos;s conspicuously missing from your boards." },
          ].map((f) => (
            <div key={f.label}>
              <p className="serif text-xs font-bold uppercase tracking-wider text-[#1a1714] mb-1">
                {f.label}
              </p>
              <p className="sans text-xs text-[#8a847c] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
