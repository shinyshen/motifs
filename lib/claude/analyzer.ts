import Anthropic from "@anthropic-ai/sdk";
import type { PinAnalysis, AnalyzedPin, AggregateStyleReport, StyleTimeline, QuarterlySnapshot } from "@/types";
import { format, parseISO, startOfQuarter } from "date-fns";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

export type BoardCategory = "outfits" | "nails" | "home decor" | "general";

export function detectCategory(boardName: string): BoardCategory {
  const name = boardName.toLowerCase();
  if (name.includes("nail")) return "nails";
  if (name.includes("home") || name.includes("decor") || name.includes("interior") || name.includes("room")) return "home decor";
  if (name.includes("outfit") || name.includes("style") || name.includes("fashion") || name.includes("clothes") || name.includes("wardrobe") || name.includes("fit")) return "outfits";
  return "general";
}

export const PROMPTS: Record<BoardCategory, string> = {
  outfits: `You are a sharp-eyed stylist analyzing a fashion image. Describe what you actually see with specificity and nuance. Return ONLY valid JSON:
{
  "primary_colors": ["descriptive names like 'oxblood', 'warm ivory', 'washed black'"],
  "color_mood": "overall palette feeling e.g. 'moody and saturated'",
  "silhouette": "actual shape e.g. 'voluminous top, slim bottom'",
  "proportions": "where volume sits e.g. 'small top energy, wide leg bottom'",
  "texture_and_material": "materials present e.g. 'buttery leather', 'chunky knit'",
  "hardware_and_details": "notable details e.g. 'silver studs', 'raw hems', or 'deliberately detail-free'",
  "style_signals": ["2-4 vibe observations e.g. 'feels borrowed from menswear'"],
  "garment_types": ["actual garments visible e.g. 'wide leg trouser', 'moto jacket'"],
  "formality_feel": "occasion energy e.g. 'could go to a gallery or a coffee shop'",
  "season_vibe": "e.g. 'transitional fall', 'deep winter layers'",
  "one_line_summary": "one punchy sentence capturing the overall vibe"
}
No explanations — JSON only.`,

  nails: `You are a nail art expert analyzing a nail image. Return ONLY valid JSON:
{
  "primary_colors": ["exact descriptive shades e.g. 'Ballet Slipper pink', 'deep forest green', 'warm nude beige'"],
  "color_mood": "palette vibe e.g. 'muted and tonal' or 'high contrast graphic'",
  "silhouette": "nail shape e.g. 'almond', 'coffin', 'square', 'oval', 'stiletto', 'squoval', 'round'",
  "proportions": "nail length e.g. 'short and practical', 'medium', 'long dramatic extension'",
  "texture_and_material": "finish and technique e.g. 'chrome gel', 'matte dip powder', 'glossy acrylic', 'nail art on natural'",
  "hardware_and_details": "embellishments or art e.g. '3D gems', 'hand-painted florals', 'gold foil', 'negative space design', or 'clean and undecorated'",
  "style_signals": ["2-4 vibe observations e.g. 'quiet luxury', 'maximalist Y2K', 'soft aesthetic', 'editorial'"],
  "garment_types": ["nail art style tags e.g. 'abstract', 'floral', 'geometric', 'gradient ombre', 'solid', 'French tip variation'"],
  "formality_feel": "occasion energy e.g. 'every day wearable', 'special occasion only', 'editorial / avant garde'",
  "season_vibe": "e.g. 'summer brights', 'cozy autumn tones', 'winter moody'",
  "one_line_summary": "one punchy sentence e.g. 'Minimal glazed donut nails — clean, quiet, expensive-looking'"
}
No explanations — JSON only.`,

  "home decor": `You are an interior design expert analyzing a home decor or interior image. Return ONLY valid JSON:
{
  "primary_colors": ["descriptive names e.g. 'warm terracotta', 'aged linen', 'deep hunter green'"],
  "color_mood": "palette feeling e.g. 'earthy and warm' or 'cool and airy'",
  "silhouette": "room layout or composition e.g. 'low-slung and horizontal', 'tall and airy with vertical emphasis'",
  "proportions": "scale of furniture/objects e.g. 'oversized sofa, small accent pieces', 'balanced and symmetrical'",
  "texture_and_material": "materials present e.g. 'raw linen', 'walnut wood', 'aged brass', 'rattan', 'concrete'",
  "hardware_and_details": "finishing details e.g. 'brushed gold hardware', 'exposed seams on cushions', 'hand-thrown ceramics', or 'deliberately minimal'",
  "style_signals": ["2-4 vibe observations e.g. 'Japandi influence', 'maximalist collector energy', 'quiet European farmhouse'"],
  "garment_types": ["key furniture or decor items e.g. 'boucle armchair', 'arched mirror', 'vintage Persian rug', 'statement pendant light'"],
  "formality_feel": "room energy e.g. 'lived-in and relaxed', 'curated and formal', 'cozy hygge'",
  "season_vibe": "e.g. 'warm summer light', 'cozy winter den', 'fresh spring neutral'",
  "one_line_summary": "one punchy sentence e.g. 'Warm minimalism with an edited collector's eye — nothing unnecessary, nothing cold'"
}
No explanations — JSON only.`,

  general: `You are a visual analyst examining this image for aesthetic signals. Return ONLY valid JSON:
{
  "primary_colors": ["descriptive color names"],
  "color_mood": "overall palette feeling",
  "silhouette": "dominant shape or composition",
  "proportions": "scale and balance",
  "texture_and_material": "materials or textures visible",
  "hardware_and_details": "notable details or finishing touches",
  "style_signals": ["2-4 vibe observations"],
  "garment_types": ["key objects or elements visible"],
  "formality_feel": "overall mood or occasion energy",
  "season_vibe": "seasonal or atmospheric feeling",
  "one_line_summary": "one punchy sentence capturing the overall aesthetic"
}
No explanations — JSON only.`,
};

export async function analyzePin(imageUrl: string, pinId: string, category: BoardCategory = "general"): Promise<PinAnalysis> {
  const prompt = PROMPTS[category];
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          { type: "text", text: prompt },
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
  analyzedPins: AnalyzedPin[],
  category: BoardCategory = "general"
): Promise<AggregateStyleReport> {
  const summaries = analyzedPins
    .map((ap) => `[Pin ${ap.pin.id} — ${ap.pin.created_at.slice(0, 10)}]\n${JSON.stringify(ap.analysis)}`)
    .join("\n\n");

  const categoryContext: Record<BoardCategory, string> = {
    outfits: "fashion and outfit pins. Use styling and wardrobe language. Shopping note should identify garment gaps.",
    nails: "nail art and nail inspiration pins. Use nail-specific language (shape, finish, technique, embellishment). Shopping note should suggest nail products, salons, or press-on sets to explore.",
    "home decor": "home decor and interior design pins. Use interior design language. Shopping note should identify furniture, textile, or object gaps to source.",
    general: "style inspiration pins. Shopping note should identify key pieces or aesthetic gaps.",
  };

  const prompt = `You are a perceptive creative analyst who has just reviewed ${analyzedPins.length} saved ${categoryContext[category]} Based on these analyses, write a holistic style report. Return ONLY valid JSON:

{
  "dominant_colors": [{"color": "descriptive name", "frequency": 0.0}],
  "color_story": "narrative about the color patterns and any evolution",
  "silhouette_patterns": [{"pattern": "description", "frequency": 0.0}],
  "texture_signatures": [{"texture": "material/texture/finish", "frequency": 0.0}],
  "hardware_signatures": [{"detail": "specific detail or embellishment", "frequency": 0.0}],
  "garment_frequency": [{"garment": "item or element type", "count": 0}],
  "aesthetic_tensions": ["tensions or contradictions you notice across the saves"],
  "top_style_signals": [{"signal": "vibe observation", "count": 0}],
  "stylist_summary": "2-3 sentence note, specific and observational not data-report-ish",
  "shopping_note": "1-2 sentences identifying gaps or opportunities based on what's saved",
  "total_pins_analyzed": ${analyzedPins.length}
}

Frequency values are 0.0-1.0. Be specific. Find the tensions and signatures that reveal genuine taste.

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
