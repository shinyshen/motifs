import { NextRequest, NextResponse } from "next/server";
import { getBoards } from "@/lib/pinterest/client";

function getToken(req: NextRequest): string | null {
  // Use cookie from OAuth flow, or fall back to test token from env
  return (
    req.cookies.get("pinterest_token")?.value ??
    process.env.PINTEREST_TEST_TOKEN ??
    null
  );
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("Using token:", token.slice(0, 10) + "...");
  try {
    const boards = await getBoards(token);
    return NextResponse.json({ boards });
  } catch (err) {
    console.error("Boards fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}
