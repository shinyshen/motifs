import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  if (process.env.PINTEREST_TEST_TOKEN) {
    redirect("/analyze");
  }

  return (
    <main className="min-h-screen overflow-hidden" style={{ backgroundColor: "#faf7f2" }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/motif_logo.png" alt="Motifs" className="h-32 w-auto" style={{ boxShadow: "none" }} />
        <div className="flex items-center gap-6">
          <span className="handwriting text-[#555] text-lg hidden md:block">your Pinterest style analysis &#x2661;</span>
          <Link
            href="/analyze"
            className="font-sans text-xs tracking-[0.2em] uppercase bg-[#f4a0c0] text-white px-5 py-2.5 font-semibold hover:bg-[#d4809a] transition-colors"
            style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}
          >
            Try it →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-8 pt-4 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Left */}
          <div>
            <h1
              className="font-serif font-black text-[#2d2d2d] leading-[0.88] mb-6"
              style={{ fontSize: "clamp(52px, 9vw, 110px)" }}
            >
              So you&apos;ve been<br />
              <span className="italic text-[#f4a0c0]">pinning.</span>
            </h1>

            <p className="handwriting text-[#4a4a4a] text-xl mb-3 rotate-[-1deg] inline-block">
              is it a hot girl summer? manic pixie girl spring? city girl fall? let&apos;s find out.
            </p>

            <div style={{ marginTop: "-20px" }}>
              <Link
                href="/analyze"
                className="relative inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ boxShadow: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/buttons.png" alt="" className="w-96" style={{ display: "block" }} />
                <span className="absolute inset-0 flex items-center justify-center text-white font-sans text-base tracking-[0.2em] uppercase font-semibold" style={{ transform: "translateY(-4px)" }}>
                  Analyze my Pinterest
                </span>
              </Link>
            </div>
          </div>

          {/* Right — collage graphic */}
          <div className="hidden md:flex items-start justify-center" style={{ marginTop: "-40px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/front_page_graphic.png"
              alt="style collage"
              className="w-full max-w-lg"
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </section>

      {/* ARCHETYPE STRIP */}
      <div className="border-y border-black/10 py-4 overflow-hidden" style={{ backgroundColor: "#f4a0c0", backgroundImage: "radial-gradient(circle, #f7b8cf 28%, transparent 28%)", backgroundSize: "32px 32px", backgroundPosition: "16px 50%" }}>
        <div className="flex whitespace-nowrap" style={{ animation: "marquee 24s linear infinite" }}>
          {["hot girl summer", "manic pixie dream girl", "cool city girl", "old money", "downtown rocker", "quiet luxury", "coastal grandmother", "y2k revival", "dark academia"].flatMap((a, i) => [
            <span key={`a-${i}`} className="font-serif italic font-bold text-white text-lg flex-shrink-0 px-8">{a}</span>,
            <span key={`d-${i}`} className="font-serif text-white/50 text-lg flex-shrink-0">·</span>,
          ])}
          {["hot girl summer", "manic pixie dream girl", "cool city girl", "old money", "downtown rocker", "quiet luxury", "coastal grandmother", "y2k revival", "dark academia"].flatMap((a, i) => [
            <span key={`b-${i}`} className="font-serif italic font-bold text-white text-lg flex-shrink-0 px-8">{a}</span>,
            <span key={`e-${i}`} className="font-serif text-white/50 text-lg flex-shrink-0">·</span>,
          ])}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="px-8 pb-14 pt-16 max-w-6xl mx-auto">
        <h2 className="font-serif font-black text-[#2d2d2d] mb-12" style={{ fontSize: "clamp(32px, 5vw, 60px)" }}>
          How it works.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "/step1.png", step: "Show us your pins", desc: "Just connect your Pinterest.", h: "200px" },
            { icon: "/step2.png", step: "Pick your favorite board", desc: "Style inspo, bedroom decor, whatever you've been saving to.", h: "200px" },
            { icon: "/step3.png", step: "Let us snoop", desc: "We'll look for patterns you might not even notice.", h: "200px" },
            { icon: "/step4.png", step: "Go shop 'til you drop", desc: "Aesthetic breakdown, must-source pieces, and even your style evolution.", h: "160px", mb: "24px" },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="flex items-end justify-center" style={{ height: "200px", marginBottom: "16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt={item.step} style={{ height: item.h, width: "auto", boxShadow: "none", mixBlendMode: "multiply", marginBottom: item.mb ?? "0px" }} />
              </div>
              <p className="font-serif font-bold text-[#2d2d2d] text-base mb-2">{item.step}</p>
              <p className="font-sans text-[#555] text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center" style={{ backgroundColor: "#f4a0c0", backgroundImage: "radial-gradient(circle, #f7b8cf 28%, transparent 28%)", backgroundSize: "32px 32px", backgroundPosition: "16px 50%" }}>
        <p className="handwriting text-[#3a3a3a] text-2xl mb-3">so... what does your pinterest say about you?</p>
        <h2 className="font-serif font-black text-[#3a3a3a] mb-8" style={{ fontSize: "clamp(36px, 6vw, 80px)" }}>
          Find out now.
        </h2>
        <Link href="/analyze">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/motifs_button.png" alt="Motifs" className="mx-auto hover:opacity-80 transition-opacity" style={{ height: "480px", width: "auto", boxShadow: "none", marginTop: "-40px", marginBottom: "-40px" }} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-5 flex items-center justify-between border-t border-black/10" style={{ backgroundColor: "#faf7f2" }}>
        <span className="font-serif text-sm text-[#555]">motifs &#x2661; 2026</span>
      </footer>
    </main>
  );
}
