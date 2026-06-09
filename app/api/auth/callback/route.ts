import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/pinterest/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error ?? "no_code"}`
    );
  }

  try {
    const { access_token } = await exchangeCodeForToken(code);

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    // Store token in httpOnly cookie — never exposed to JS
    response.cookies.set("pinterest_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=token_exchange_failed`
    );
  }
}
