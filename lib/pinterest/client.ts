import type { PinterestBoard, PinterestPin } from "@/types";

const PINTEREST_API_BASE = "https://api.pinterest.com/v5";

export function getPinterestAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.PINTEREST_APP_ID!,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
    response_type: "code",
    scope: "boards:read,pins:read",
    state: crypto.randomUUID(),
  });
  return `https://www.pinterest.com/oauth/?${params}`;
}

export async function exchangeCodeForToken(
  code: string
): Promise<{ access_token: string; token_type: string }> {
  const credentials = Buffer.from(
    `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PINTEREST_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinterest token exchange failed: ${err}`);
  }

  return res.json();
}

export async function getBoards(accessToken: string): Promise<PinterestBoard[]> {
  const boards: PinterestBoard[] = [];
  let bookmark: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: "25" });
    if (bookmark) params.set("bookmark", bookmark);

    const res = await fetch(`${PINTEREST_API_BASE}/boards?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to fetch boards: ${res.statusText} — ${body}`);
    }

    const data = await res.json();
    boards.push(...data.items);
    bookmark = data.bookmark;
  } while (bookmark);

  return boards;
}

export async function getPins(
  accessToken: string,
  boardId: string
): Promise<PinterestPin[]> {
  const pins: PinterestPin[] = [];
  let bookmark: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: "25" });
    if (bookmark) params.set("bookmark", bookmark);

    const res = await fetch(
      `${PINTEREST_API_BASE}/boards/${boardId}/pins?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) throw new Error(`Failed to fetch pins: ${res.statusText}`);

    const data = await res.json();
    pins.push(...data.items);
    bookmark = data.bookmark;
  } while (bookmark);

  return pins;
}
