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
}

export interface TotemCable {
  id: string;
  name: string;
  price: number;
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
  { id: 'arch', name: 'Arch', price: 28, height: 52 },
  { id: 'dome', name: 'Dome', price: 34, height: 44 },
  { id: 'cylinder', name: 'Cylinder', price: 24, height: 64 },
  { id: 'cone', name: 'Cone', price: 30, height: 56 },
  { id: 'wave', name: 'Wave', price: 32, height: 44 },
  { id: 'sphere', name: 'Sphere', price: 36, height: 44 },
  { id: 'torus', name: 'Torus', price: 38, height: 28 },
  { id: 'prism', name: 'Prism', price: 26, height: 52 },
];

export const TOTEM_COLORS: TotemColor[] = [
  { id: 'chalk', name: 'Chalk White', hex: '#F2F0EB' },
  { id: 'stone', name: 'Stone Grey', hex: '#B4B2A9' },
  { id: 'black', name: 'Matte Black', hex: '#2C2C2A' },
  { id: 'clay', name: 'Clay', hex: '#C4896A' },
  { id: 'sage', name: 'Sage', hex: '#7A9E7E' },
  { id: 'navy', name: 'Navy', hex: '#1E3A5F' },
  { id: 'cream', name: 'Warm Cream', hex: '#E8E0CF' },
  { id: 'terracotta', name: 'Terracotta', hex: '#B85C38' },
];

export const TOTEM_FIXATIONS: TotemFixation[] = [
  { id: 'rosette', name: 'Rosette', price: 12 },
  { id: 'rail', name: 'Rail', price: 15 },
  { id: 'canopy', name: 'Canopy', price: 18 },
];

export const TOTEM_CABLES: TotemCable[] = [
  { id: 'black-textile', name: 'Black textile', price: 8 },
  { id: 'white-textile', name: 'White textile', price: 8 },
  { id: 'brass', name: 'Brass', price: 14 },
  { id: 'copper', name: 'Copper', price: 14 },
  { id: 'transparent', name: 'Transparent', price: 8 },
];

export const TOTEM_PRESETS: TotemPreset[] = [
  {
    id: 'studio',
    name: 'The Studio',
    description: 'A minimal three-piece composition',
    pieces: [
      { shapeId: 'arch', colorId: 'chalk', flipped: false },
      { shapeId: 'dome', colorId: 'stone', flipped: false },
      { shapeId: 'cylinder', colorId: 'chalk', flipped: false },
    ],
    fixationId: 'rosette',
    cableId: 'black-textile',
  },
  {
    id: 'salon',
    name: 'The Salon',
    description: 'A five-piece statement piece',
    pieces: [
      { shapeId: 'dome', colorId: 'chalk', flipped: false },
      { shapeId: 'arch', colorId: 'stone', flipped: false },
      { shapeId: 'dome', colorId: 'black', flipped: false },
      { shapeId: 'wave', colorId: 'chalk', flipped: false },
      { shapeId: 'arch', colorId: 'cream', flipped: false },
    ],
    fixationId: 'rosette',
    cableId: 'black-textile',
  },
  {
    id: 'atelier',
    name: 'The Atelier',
    description: 'Seven pieces, maximum drama',
    pieces: [
      { shapeId: 'dome', colorId: 'black', flipped: false },
      { shapeId: 'arch', colorId: 'clay', flipped: false },
      { shapeId: 'wave', colorId: 'stone', flipped: false },
      { shapeId: 'dome', colorId: 'chalk', flipped: false },
      { shapeId: 'arch', colorId: 'black', flipped: false },
      { shapeId: 'wave', colorId: 'clay', flipped: false },
      { shapeId: 'cylinder', colorId: 'chalk', flipped: false },
    ],
    fixationId: 'rail',
    cableId: 'black-textile',
  },
  {
    id: 'duo',
    name: 'The Duo',
    description: 'Two pieces, compact and refined',
    pieces: [
      { shapeId: 'arch', colorId: 'chalk', flipped: false },
      { shapeId: 'dome', colorId: 'black', flipped: false },
    ],
    fixationId: 'rosette',
    cableId: 'transparent',
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
