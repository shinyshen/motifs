import Anthropic from "@anthropic-ai/sdk";
import type { PinAnalysis, AnalyzedPin, AggregateStyleReport, StyleTimeline, QuarterlySnapshot } from "@/types";
import { format, parseISO, startOfQuarter } from "date-fns";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

const PIN_ANALYSIS_PROMPT = `You are a sharp-eyed stylist analyzing a fashion image. Describe what you actually see with specificity and nuance — not categories, but real observations. Return ONLY valid JSON matching this exact shape:

{
  "primary_colors": ["descriptive names like 'oxblood', 'warm ivory', 'washed black'"],
  "color_mood": "overall palette feeling e.g. 'moody and saturated' or 'bleached and minimal'",
  "silhouette": "actual shape relationship e.g. 'voluminous top, slim bottom'",
  "proportions": "where volume sits e.g. 'small top energy, wide leg bottom'",
  "texture_and_material": "materials present e.g. 'buttery leather', 'chunky knit', 'worn denim'",
  "hardware_and_details": "notable details e.g. 'silver studs', 'raw hems', or 'deliberately detail-free'",
  "style_signals": ["2-4 free-form vibe observations e.g. 'feels borrowed from menswear'"],
  "garment_types": ["actual garments visible e.g. 'wide leg trouser', 'moto jacket'"],
  "formality_feel": "occasion energy e.g. 'could go to a gallery or a coffee shop'",
  "season_vibe": "e.g. 'transitional fall', 'deep winter layers'",
  "one_line_summary": "one punchy sentence e.g. 'Dark academia meets downtown — lots of structure, zero color'"
}

If this is not a fashion/style image, still do your best to extract aesthetic signals. No explanations — JSON only.`;

export async function analyzePin(imageUrl: string, pinId: string): Promise<PinAnalysis> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          { type: "text", text: PIN_ANALYSIS_PROMPT },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON in analysis for pin ${pinId}`);

  const analysis = JSON.parse(jsonMatch[0]) as Omit<PinAnalysis, "pin_id">;
  return { pin_id: pinId, ...analysis };
}

export async function buildAggregateReport(
  analyzedPins: AnalyzedPin[]
): Promise<AggregateStyleReport> {
  const summaries = analyzedPins
    .map((ap) => `[Pin ${ap.pin.id} — ${ap.pin.created_at.slice(0, 10)}]\n${JSON.stringify(ap.analysis)}`)
    .join("\n\n");

  const prompt = `You are a perceptive stylist who has just reviewed ${analyzedPins.length} saved fashion pins. Based on these analyses, write a holistic style report. Return ONLY valid JSON:

{
  "dominant_colors": [{"color": "descriptive name", "frequency": 0.0}],
  "color_story": "narrative about the color patterns and any evolution",
  "silhouette_patterns": [{"pattern": "description", "frequency": 0.0}],
  "texture_signatures": [{"texture": "material/texture", "frequency": 0.0}],
  "hardware_signatures": [{"detail": "specific detail", "frequency": 0.0}],
  "garment_frequency": [{"garment": "type", "count": 0}],
  "aesthetic_tensions": ["e.g. 'pulls between minimal and maximalist — possible style transition'"],
  "top_style_signals": [{"signal": "vibe observation", "count": 0}],
  "stylist_summary": "2-3 sentence stylist note, specific and observational not data-report-ish",
  "shopping_note": "1-2 sentences identifying gaps or opportunities, e.g. 'You keep saving wide leg trousers but almost no tops to match'",
  "total_pins_analyzed": ${analyzedPins.length}
}

Frequency values are 0.0-1.0 (proportion of pins). Be specific and observational. Find the tensions and signatures that reveal genuine style personality.

PIN ANALYSES:
${summaries}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in aggregate analysis");

  return JSON.parse(jsonMatch[0]) as AggregateStyleReport;
}

export async function buildTimeline(analyzedPins: AnalyzedPin[]): Promise<StyleTimeline> {
  // Group by quarter
  const byQuarter = new Map<string, AnalyzedPin[]>();

  for (const ap of analyzedPins) {
    const date = parseISO(ap.pin.created_at);
    const qStart = startOfQuarter(date);
    const key = `Q${Math.ceil((qStart.getMonth() + 1) / 3)} ${format(qStart, "yyyy")}`;
    if (!byQuarter.has(key)) byQuarter.set(key, []);
    byQuarter.get(key)!.push(ap);
  }

  const sortedQuarters = Array.from(byQuarter.keys()).sort((a, b) => {
    const [qa, ya] = a.split(" ");
    const [qb, yb] = b.split(" ");
    return ya !== yb ? Number(ya) - Number(yb) : Number(qa[1]) - Number(qb[1]);
  });

  const snapshots: QuarterlySnapshot[] = [];

  for (const quarter of sortedQuarters) {
    const pins = byQuarter.get(quarter)!;
    const colorMap = new Map<string, number>();
    for (const ap of pins) {
      for (const c of ap.analysis.primary_colors) {
        colorMap.set(c, (colorMap.get(c) ?? 0) + 1);
      }
    }
    const dominant_colors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([c]) => c);

    const silhouettes = pins.map((ap) => ap.analysis.silhouette).filter(Boolean);
    const vibes = pins.flatMap((ap) => ap.analysis.style_signals).filter(Boolean);

    snapshots.push({
      quarter,
      dominant_colors,
      silhouette_shift: silhouettes[0] ?? "varied",
      vibe_shift: vibes.slice(0, 2).join("; ") || "mixed",
      pin_count: pins.length,
      sample_pins: pins.slice(0, 4),
    });
  }

  // Ask Claude to narrate the evolution
  const snapshotSummary = snapshots
    .map((s) => `${s.quarter} (${s.pin_count} pins): colors [${s.dominant_colors.join(", ")}], silhouette: ${s.silhouette_shift}, vibe: ${s.vibe_shift}`)
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a stylist tracking how someone's aesthetic has evolved. Based on these quarterly snapshots, write a 2-3 sentence narrative about the evolution — look for real shifts in palette, silhouette, and vibe. Be specific and observational.

${snapshotSummary}

Return ONLY the narrative text, no JSON.`,
      },
    ],
  });

  const evolution_narrative =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  return { snapshots, evolution_narrative };
}
