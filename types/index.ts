export interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  pin_count: number;
  media?: {
    image_cover_url?: string;
  };
}

export interface PinterestPin {
  id: string;
  created_at: string;
  title?: string;
  description?: string;
  media: {
    images: {
      "400x300"?: { url: string; width: number; height: number };
      "600x": { url: string; width: number; height: number };
    };
  };
  board_id: string;
}

export interface PinAnalysis {
  pin_id: string;
  primary_colors: string[];
  color_mood: string;
  silhouette: string;
  proportions: string;
  texture_and_material: string;
  hardware_and_details: string;
  style_signals: string[];
  garment_types: string[];
  formality_feel: string;
  season_vibe: string;
  one_line_summary: string;
}

export interface AnalyzedPin {
  pin: PinterestPin;
  analysis: PinAnalysis;
}

export interface AggregateStyleReport {
  dominant_colors: Array<{ color: string; frequency: number }>;
  color_story: string;
  silhouette_patterns: Array<{ pattern: string; frequency: number }>;
  texture_signatures: Array<{ texture: string; frequency: number }>;
  hardware_signatures: Array<{ detail: string; frequency: number }>;
  garment_frequency: Array<{ garment: string; count: number }>;
  aesthetic_tensions: string[];
  top_style_signals: Array<{ signal: string; count: number }>;
  stylist_summary: string;
  shopping_note: string;
  total_pins_analyzed: number;
}

export interface QuarterlySnapshot {
  quarter: string; // e.g. "Q1 2024"
  dominant_colors: string[];
  silhouette_shift: string;
  vibe_shift: string;
  pin_count: number;
  sample_pins: AnalyzedPin[];
}

export interface StyleTimeline {
  snapshots: QuarterlySnapshot[];
  evolution_narrative: string;
}

export interface AnalysisSession {
  id: string;
  board_id: string;
  board_name: string;
  created_at: string;
  status: "pending" | "analyzing" | "complete" | "error";
  total_pins: number;
  analyzed_pins: number;
  report?: AggregateStyleReport;
  timeline?: StyleTimeline;
}
