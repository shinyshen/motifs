import type { PinAnalysis, AnalyzedPin, AggregateStyleReport, StyleTimeline } from "@/types";

const MOCK_ANALYSES: Omit<PinAnalysis, "pin_id">[] = [
  {
    primary_colors: ["washed black", "warm ivory", "aged silver"],
    color_mood: "monochromatic and intentional — almost no color but a lot of depth",
    silhouette: "oversized top, straight leg bottom",
    proportions: "volume up top, everything relaxed below",
    texture_and_material: "soft cotton jersey, worn denim, matte leather",
    hardware_and_details: "silver zip pulls, minimal visible hardware",
    style_signals: ["borrowed from menswear", "very intentional about being underdone", "effortless but clearly considered"],
    garment_types: ["oversized crewneck", "straight leg jean", "leather loafer"],
    formality_feel: "weekend with taste — could easily go to a gallery",
    season_vibe: "transitional fall",
    one_line_summary: "Menswear-borrowed minimalism — everything fits like it shouldn't but does",
  },
  {
    primary_colors: ["oxblood", "warm camel", "raw denim blue"],
    color_mood: "moody and saturated, pulled from a late autumn palette",
    silhouette: "fitted top, wide leg bottom",
    proportions: "small top energy, dramatic wide leg — strong proportion contrast",
    texture_and_material: "buttery leather, chunky ribbed knit, worn denim",
    hardware_and_details: "silver belt buckle, exposed buttons, nothing excessive",
    style_signals: ["90s references but elevated", "color used as punctuation not wallpaper", "deliberately editorial"],
    garment_types: ["wide leg trouser", "fitted ribbed tank", "leather belt", "moto jacket"],
    formality_feel: "could go to a dinner or a record shop — deliberately ambiguous",
    season_vibe: "deep autumn",
    one_line_summary: "Saturated and structured — the kind of outfit that reads as a statement without trying",
  },
  {
    primary_colors: ["cream", "warm taupe", "dusty rose"],
    color_mood: "bleached and soft — almost washed out, very quiet",
    silhouette: "long and column-like, minimal breaks",
    proportions: "everything elongated, very little volume anywhere",
    texture_and_material: "silk charmeuse, fine wool, sheer organza layering",
    hardware_and_details: "nothing — deliberately detail-free",
    style_signals: ["references quiet luxury", "anti-logo, anti-decoration", "feels expensive by absence"],
    garment_types: ["slip dress", "fine knit cardigan", "pointed toe flat"],
    formality_feel: "gallery opening or a very good lunch",
    season_vibe: "transitional spring",
    one_line_summary: "Quiet luxury done right — softness as a power move",
  },
  {
    primary_colors: ["ink black", "silver", "deep burgundy"],
    color_mood: "dark and deliberate — a palette that absorbs light",
    silhouette: "structured top, slim bottom",
    proportions: "sharp shoulders, everything fitted below",
    texture_and_material: "crisp cotton poplin, patent leather, fine wool crepe",
    hardware_and_details: "silver studs, exposed zip on sleeve, tortoiseshell buttons",
    style_signals: ["downtown with an edge", "references punk but in boardroom fabrics", "intentional tension between sharp and soft"],
    garment_types: ["structured blazer", "slim trouser", "patent leather boot"],
    formality_feel: "boardroom with an edge — or a very cool dinner",
    season_vibe: "deep winter",
    one_line_summary: "Sharp, dark, deliberate — punk sensibility in expensive clothes",
  },
  {
    primary_colors: ["forest green", "warm brown", "aged gold"],
    color_mood: "earthy and rich — nature palette but elevated",
    silhouette: "voluminous top, tapered bottom",
    proportions: "drama up top, clean below — very considered",
    texture_and_material: "chunky knit wool, suede, waxed cotton",
    hardware_and_details: "gold hardware on bag, nothing on clothes",
    style_signals: ["outdoorsy references but clearly urban", "texture-forward approach", "feels collected not curated"],
    garment_types: ["chunky knit sweater", "tapered trouser", "suede chelsea boot", "structured tote"],
    formality_feel: "effortlessly weekend but not sloppy",
    season_vibe: "early winter",
    one_line_summary: "Rich textures, earth tones — looks like it came together naturally but didn't",
  },
];

export function getMockAnalysis(pinId: string, index: number): PinAnalysis {
  const base = MOCK_ANALYSES[index % MOCK_ANALYSES.length];
  return { pin_id: pinId, ...base };
}

export function getMockAggregateReport(totalPins: number): AggregateStyleReport {
  return {
    dominant_colors: [
      { color: "washed black", frequency: 0.72 },
      { color: "warm ivory / cream", frequency: 0.58 },
      { color: "oxblood", frequency: 0.34 },
      { color: "warm camel", frequency: 0.28 },
      { color: "aged silver", frequency: 0.22 },
    ],
    color_story: "Your palette is overwhelmingly dark and neutral — black and ivory form the core, with oxblood and camel appearing as the only real color. Over time there's a slight drift toward warmer neutrals, suggesting a softening from stark monochrome toward something with more texture and warmth.",
    silhouette_patterns: [
      { pattern: "wide leg / relaxed bottom, fitted or cropped top", frequency: 0.61 },
      { pattern: "oversized everything — volume head to toe", frequency: 0.24 },
      { pattern: "long and column-like, minimal breaks", frequency: 0.18 },
      { pattern: "structured top, slim bottom", frequency: 0.14 },
    ],
    texture_signatures: [
      { texture: "worn denim", frequency: 0.64 },
      { texture: "matte leather", frequency: 0.58 },
      { texture: "chunky knit", frequency: 0.42 },
      { texture: "fine wool / crepe", frequency: 0.38 },
      { texture: "silk / charmeuse", frequency: 0.22 },
      { texture: "sheer layering", frequency: 0.16 },
    ],
    hardware_signatures: [
      { detail: "silver hardware (zips, buckles, studs)", frequency: 0.54 },
      { detail: "exposed zippers", frequency: 0.32 },
      { detail: "deliberately detail-free", frequency: 0.28 },
      { detail: "raw or unfinished hems", frequency: 0.18 },
    ],
    garment_frequency: [
      { garment: "wide leg trouser", count: 28 },
      { garment: "oversized knit / sweater", count: 24 },
      { garment: "straight leg jean", count: 21 },
      { garment: "leather jacket / moto jacket", count: 18 },
      { garment: "structured blazer", count: 14 },
      { garment: "slip dress / bias cut dress", count: 9 },
      { garment: "ballet flat / loafer", count: 22 },
      { garment: "chelsea or ankle boot", count: 19 },
    ],
    aesthetic_tensions: [
      "Strong pull between very minimal (quiet luxury, detail-free) and very textured (chunky knits, hardware, layering) — you may be in the middle of a style transition, or deliberately keeping both modes.",
      "Trousers dominate heavily over skirts and dresses (roughly 5:1) but the few dresses saved are very feminine and soft — a sharp contrast to the rest of the board.",
      "Silver hardware appears consistently but the surrounding clothes are often deliberately understated — the hardware is the one place you let yourself have a detail.",
    ],
    top_style_signals: [
      { signal: "borrowed from menswear", count: 31 },
      { signal: "intentional about being underdone", count: 27 },
      { signal: "90s references, elevated", count: 22 },
      { signal: "texture-forward, color-restrained", count: 19 },
      { signal: "quiet luxury, anti-decoration", count: 16 },
      { signal: "downtown with an edge", count: 14 },
    ],
    stylist_summary: "Your boards read as someone who has a very clear point of view — dark, textural, proportion-conscious, with a strong menswear influence. You consistently reach for wide legs and volume, almost always restrained in color but expressive in texture. The silver hardware is a signature: it's the one place decoration is allowed in.",
    shopping_note: "You keep saving wide leg trousers but almost no tops with enough presence to match them — that's probably the gap. Your tops trend oversized and casual while your bottoms are getting more intentional. A few really good structured tops or fitted knits might be what pulls the whole wardrobe together.",
    total_pins_analyzed: totalPins,
  };
}

export function getMockTimeline(analyzedPins: AnalyzedPin[]): StyleTimeline {
  return {
    snapshots: [
      {
        quarter: "Q1 2023",
        dominant_colors: ["stark black", "white", "raw denim"],
        silhouette_shift: "very oversized everything — shapeless by design",
        vibe_shift: "90s grunge references, very undone",
        pin_count: 12,
        sample_pins: analyzedPins.slice(0, 2),
      },
      {
        quarter: "Q3 2023",
        dominant_colors: ["washed black", "warm ivory", "aged silver"],
        silhouette_shift: "oversized top, straight leg — starting to get proportional",
        vibe_shift: "menswear influences creeping in, more intentional",
        pin_count: 18,
        sample_pins: analyzedPins.slice(2, 4),
      },
      {
        quarter: "Q1 2024",
        dominant_colors: ["oxblood", "camel", "black"],
        silhouette_shift: "wide leg bottom, fitted or cropped top — strong proportion contrast",
        vibe_shift: "color arriving for the first time, still dark but warmer",
        pin_count: 24,
        sample_pins: analyzedPins.slice(4, 6),
      },
      {
        quarter: "Q3 2024",
        dominant_colors: ["warm ivory", "taupe", "forest green"],
        silhouette_shift: "long and column-like, or wide leg — two distinct modes",
        vibe_shift: "quiet luxury entering the picture alongside the downtown edge",
        pin_count: 31,
        sample_pins: analyzedPins.slice(6, 8),
      },
    ],
    evolution_narrative: "The boards tell a clear story: you started in pure monochrome and shapeless volume, then gradually developed a much sharper sense of proportion — wide legs, fitted tops, strong silhouettes. Color arrived slowly (oxblood, camel) and only as accent, never the main event. The most recent saves suggest two aesthetics pulling in parallel: a quieter, softer direction (slip dresses, fine knits) alongside the downtown-edge pieces that have been consistent throughout. That tension is the interesting thing — you might be figuring out which one wins, or learning to hold both.",
  };
}
