import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { detectCategory, PROMPTS, buildAggregateReport } from "@/lib/claude/analyzer";
import type { PinAnalysis, AnalyzedPin, PinterestPin } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

const BOARD_DIRS: Record<string, string> = {
  nails: join(process.cwd(), "inspo", "nails"),
  "home decor": join(process.cwd(), "inspo", "home decor"),
  outfits: join(process.cwd(), "inspo", "outfits"),
};

export async function POST(req: NextRequest) {
  const { boardName } = await req.json();
  const dir = BOARD_DIRS[boardName.toLowerCase()];
  if (!dir) {
    return NextResponse.json({ error: "Unknown board" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "No ANTHROPIC_API_KEY set" }, { status: 500 });
  }

  const category = detectCategory(boardName);
  const prompt = PROMPTS[category];

  const files = (await readdir(dir)).filter((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  const analyzedPins: AnalyzedPin[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = join(dir, file);
    const imageData = await readFile(filePath);
    const base64 = imageData.toString("base64");
    const ext = file.split(".").pop()!.toLowerCase();
    const mediaType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              { type: "text", text: prompt },
            ],
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const analysis = JSON.parse(jsonMatch[0]) as Omit<PinAnalysis, "pin_id">;
      const pin: PinterestPin = {
        id: `local-${i}`,
        created_at: new Date().toISOString(),
        title: file,
        board_id: boardName,
        media: { images: { "600x": { url: `/inspo-proxy/${boardName}/${file}`, width: 600, height: 400 } } },
      };
      analyzedPins.push({ pin, analysis: { pin_id: pin.id, ...analysis } });
    } catch (err) {
      console.error(`Failed to analyze ${file}:`, err);
    }
  }

  const report = await buildAggregateReport(analyzedPins, category);
  return NextResponse.json({ report, totalAnalyzed: analyzedPins.length });
}
