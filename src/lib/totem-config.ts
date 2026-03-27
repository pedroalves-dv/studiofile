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
  { id: "canopy", name: "Canopy", price: 18, height: 20 },
];

export const TOTEM_CABLES: TotemCable[] = [
  { id: "brass", name: "Brass", price: 14, hex: "#B8860B" },
  { id: "black-textile", name: "Black Textile", price: 8, hex: "#2C2C2A" },
  { id: "transparent", name: "Transparent", price: 8, hex: "#D0D0D0" },
];

export const TOTEM_PRESETS: TotemPreset[] = [
  {
    id: "studio",
    name: "The Studio",
    description: "A minimal three-piece composition",
    pieces: [
      { shapeId: "arch", colorId: "chalk", flipped: false },
      { shapeId: "dome", colorId: "stone", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "black-textile",
  },
  {
    id: "salon",
    name: "The Salon",
    description: "A five-piece statement piece",
    pieces: [
      { shapeId: "dome", colorId: "chalk", flipped: false },
      { shapeId: "arch", colorId: "stone", flipped: false },
      { shapeId: "dome", colorId: "black", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "brass",
  },
  {
    id: "atelier",
    name: "The Atelier",
    description: "Seven pieces, maximum drama",
    pieces: [
      { shapeId: "dome", colorId: "black", flipped: false },
      { shapeId: "arch", colorId: "clay", flipped: false },
      { shapeId: "dome", colorId: "chalk", flipped: false },
      { shapeId: "arch", colorId: "black", flipped: false },
      { shapeId: "arch", colorId: "black", flipped: false },
    ],
    fixationId: "canopy",
    cableId: "black-textile",
  },
  {
    id: "duo",
    name: "The Duo",
    description: "Two pieces, compact and refined",
    pieces: [
      { shapeId: "arch", colorId: "chalk", flipped: false },
      { shapeId: "dome", colorId: "black", flipped: false },
    ],
    fixationId: "rosette",
    cableId: "transparent",
  },
];

export const SHAPE_MAP = new Map(TOTEM_SHAPES.map((s) => [s.id, s]));
export const COLOR_MAP = new Map(TOTEM_COLORS.map((c) => [c.id, c]));

export function calcTotemPrice(config: TotemBuildConfig): number {
  let total = 0;

  for (const piece of config.pieces) {
    const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
    total += shape?.price ?? 0;
  }

  const fixation = TOTEM_FIXATIONS.find((f) => f.id === config.fixationId);
  total += fixation?.price ?? 0;

  const cable = TOTEM_CABLES.find((c) => c.id === config.cableId);
  total += cable?.price ?? 0;

  return total;
}
