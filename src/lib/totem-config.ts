// TOTEM configurator — single source of truth for all product data

export interface TotemShape {
  id: string;
  name: string;
  price: number;
  height: number; // visual height in px (used by configurator stack)
}

export interface TotemColor {
  id: string;
  name: string;
  hex: string;
}

export interface TotemFixation {
  id: string;
  name: string;
  price: number;
  height: number;
}

export interface TotemCable {
  id: string;
  name: string;
  price: number;
  hex: string;
}

export interface TotemPreset {
  id: string;
  name: string;
  description: string;
  pieces: Array<{ shapeId: string; colorId: string; flipped: boolean }>;
  fixationId: string;
  cableId: string;
}

export interface TotemPiece {
  uid: string; // unique per piece instance, generated client-side
  shapeId: string;
  colorId: string;
  flipped: boolean;
}

export interface TotemBuildConfig {
  pieces: TotemPiece[];
  fixationId: string;
  fixationColorId: string;
  cableId: string;
}

export const TOTEM_SHAPES: TotemShape[] = [
  { id: "arch", name: "Arch", price: 28, height: 52 },
  { id: "dome", name: "Dome", price: 34, height: 44 },
];

export const TOTEM_COLORS: TotemColor[] = [
  { id: "beige", name: "Beige", hex: "#E8E0CF" },
  { id: "blue", name: "Blue", hex: "#125bf8" },
  { id: "pink", name: "Pink", hex: "#dd7db5" },
  { id: "yellow", name: "Yellow", hex: "#eebd1b" },
];

export const TOTEM_FIXATIONS: TotemFixation[] = [
  { id: "rosette", name: "Rosette", price: 12, height: 24 },
  { id: "rail", name: "Rail", price: 14, height: 22 }, // placeholder — verify price/height with client
  { id: "canopy", name: "Canopy", price: 18, height: 20 },
];

export const TOTEM_CABLES: TotemCable[] = [
  { id: "brass", name: "Brass", price: 14, hex: "#B8860B" },
  { id: "black-textile", name: "Black Textile", price: 8, hex: "#2C2C2A" },
  { id: "transparent", name: "Transparent", price: 8, hex: "#D0D0D0" },
];

// Preset colorIds are temporary mappings until TOTEM_COLORS is expanded:
//   chalk → beige, stone → beige, black → blue, clay → pink
export const TOTEM_PRESETS: TotemPreset[] = [
  {
    id: "studio",
    name: "The Studio",
    description: "A minimal three-piece composition",
    pieces: [
      { shapeId: "arch", colorId: "beige", flipped: false },
      { shapeId: "dome", colorId: "beige", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "black-textile",
  },
  {
    id: "salon",
    name: "The Salon",
    description: "A five-piece statement piece",
    pieces: [
      { shapeId: "dome", colorId: "beige", flipped: false },
      { shapeId: "arch", colorId: "beige", flipped: false },
      { shapeId: "dome", colorId: "blue", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "brass",
  },
  {
    id: "atelier",
    name: "The Atelier",
    description: "Seven pieces, maximum drama",
    pieces: [
      { shapeId: "dome", colorId: "blue", flipped: false },
      { shapeId: "arch", colorId: "pink", flipped: false },
      { shapeId: "dome", colorId: "beige", flipped: false },
      { shapeId: "arch", colorId: "blue", flipped: false },
      { shapeId: "arch", colorId: "blue", flipped: false },
    ],
    fixationId: "canopy",
    cableId: "black-textile",
  },
  {
    id: "duo",
    name: "The Duo",
    description: "Two pieces, compact and refined",
    pieces: [
      { shapeId: "arch", colorId: "beige", flipped: false },
      { shapeId: "dome", colorId: "blue", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "transparent",
  },
];

export const SHAPE_MAP    = new Map(TOTEM_SHAPES.map((s) => [s.id, s]));
export const COLOR_MAP    = new Map(TOTEM_COLORS.map((c) => [c.id, c]));
export const FIXATION_MAP = new Map(TOTEM_FIXATIONS.map((f) => [f.id, f]));
export const CABLE_MAP    = new Map(TOTEM_CABLES.map((c) => [c.id, c]));

/** Authoritative hex lookup by colorId — used by totem-catalog.ts */
export const COLOR_HEX_MAP: Record<string, string> = {
  beige:  "#E8E0CF",
  blue:   "#125bf8",
  pink:   "#dd7db5",
  yellow: "#eebd1b",
};

/** Hex lookup for cable variants — keyed by normalizeVariantTitle(variant.title) */
export const CABLE_HEX_MAP: Record<string, string> = {
  "brass":          "#B8860B",
  "black-textile":  "#2C2C2A",
  "transparent":    "#D0D0D0",
};

export function calcTotemPrice(
  config: TotemBuildConfig,
  shapeMap?: Map<string, TotemShape>,
  fixationMap?: Map<string, TotemFixation>,
  cableMap?: Map<string, TotemCable>,
): number {
  let total = 0;

  for (const piece of config.pieces) {
    const shape = (shapeMap ?? SHAPE_MAP).get(piece.shapeId);
    total += shape?.price ?? 0;
  }

  const fixation = (fixationMap ?? FIXATION_MAP).get(config.fixationId);
  total += fixation?.price ?? 0;

  const cable = (cableMap ?? CABLE_MAP).get(config.cableId);
  total += cable?.price ?? 0;

  return total;
}
