import { NextResponse } from "next/server";
import { getPinterestAuthUrl } from "@/lib/pinterest/client";

export async function GET() {
  const url = getPinterestAuthUrl();
  return NextResponse.redirect(url);
}
