import { NextRequest, NextResponse } from "next/server";
import { getPins } from "@/lib/pinterest/client";
import { createServerClient } from "@/lib/supabase/client";
import type { AnalyzedPin } from "@/types";

const USE_MOCK = !process.env.ANTHROPIC_API_KEY;

function getToken(req: NextRequest): string | null {
  return (
    req.cookies.get("pinterest_token")?.value ??
    process.env.PINTEREST_TEST_TOKEN ??
    null
  );
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { boardId, boardName } = body;
  if (!boardId || !boardName) {
    return NextResponse.json({ error: "boardId and boardName required" }, { status: 400 });
  }

  const db = createServerClient();

  const { data: session, error: sessionErr } = await db
    .from("analysis_sessions")
    .insert({ board_id: boardId, board_name: boardName, status: "analyzing" })
    .select()
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  analyzeBoard(token, boardId, session.id, db).catch(async (err) => {
    console.error("Analysis failed:", err);
    await db
      .from("analysis_sessions")
      .update({ status: "error", updated_at: new Date().toISOString() })
      .eq("id", session.id);
  });

  return NextResponse.json({ sessionId: session.id });
}

async function analyzeBoard(
  token: string,
  boardId: string,
  sessionId: string,
  db: ReturnType<typeof createServerClient>
) {
  const pins = await getPins(token, boardId);
  const imagePins = pins.filter(
    (p) => p.media?.images?.["400x300"]?.url || p.media?.images?.["600x"]?.url
  );

  await db
    .from("analysis_sessions")
    .update({ total_pins: imagePins.length, updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  const analyzedPins: AnalyzedPin[] = [];

  if (USE_MOCK) {
    // Mock mode: use pre-written analyses, simulate progress
    const { getMockAnalysis, getMockAggregateReport, getMockTimeline } = await import("@/lib/claude/mock-analyzer");

    for (let i = 0; i < imagePins.length; i++) {
      const pin = imagePins[i];
      const analysis = getMockAnalysis(pin.id, i);
      analyzedPins.push({ pin, analysis });

      await db.from("pin_analyses").insert({
        session_id: sessionId,
        pin_id: pin.id,
        pin_data: pin,
        analysis,
      });

      await db
        .from("analysis_sessions")
        .update({ analyzed_pins: i + 1, updated_at: new Date().toISOString() })
        .eq("id", sessionId);

      // Simulate a little delay so the progress bar is visible
      await new Promise((r) => setTimeout(r, 200));
    }

    const report = getMockAggregateReport(analyzedPins.length);
    const timeline = getMockTimeline(analyzedPins);

    await db
      .from("analysis_sessions")
      .update({ status: "complete", report, timeline, updated_at: new Date().toISOString() })
      .eq("id", sessionId);

  } else {
    // Real mode: call Claude for each pin
    const { analyzePin, buildAggregateReport, buildTimeline } = await import("@/lib/claude/analyzer");

    for (let i = 0; i < imagePins.length; i++) {
      const pin = imagePins[i];
      const imageUrl = pin.media.images["400x300"]?.url ?? pin.media.images["600x"].url;

      try {
        const analysis = await analyzePin(imageUrl, pin.id);
        analyzedPins.push({ pin, analysis });

        await db.from("pin_analyses").insert({
          session_id: sessionId,
          pin_id: pin.id,
          pin_data: pin,
          analysis,
        });

        await db
          .from("analysis_sessions")
          .update({ analyzed_pins: i + 1, updated_at: new Date().toISOString() })
          .eq("id", sessionId);
      } catch (err) {
        console.error(`Failed to analyze pin ${pin.id}:`, err);
      }

      if (i < imagePins.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const [report, timeline] = await Promise.all([
      buildAggregateReport(analyzedPins),
      buildTimeline(analyzedPins),
    ]);

    await db
      .from("analysis_sessions")
      .update({ status: "complete", report, timeline, updated_at: new Date().toISOString() })
      .eq("id", sessionId);
  }
}
