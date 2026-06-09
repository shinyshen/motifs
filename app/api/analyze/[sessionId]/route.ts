import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const db = createServerClient();

  const { data: session, error } = await db
    .from("analysis_sessions")
    .select("*")
    .eq("id", params.sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ session });
}
