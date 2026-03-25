import { NextRequest, NextResponse } from "next/server";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  type TotemBuildConfig,
} from "@/lib/totem-config";
import {
  SHAPE_COLOR_VARIANT_MAP,
  FIXATION_VARIANT_MAP,
  CABLE_VARIANT_MAP,
} from "@/lib/totem-variant-map";
import { createDraftOrder, type DraftOrderLineItem } from "@/lib/shopify/admin";

/** "gid://shopify/ProductVariant/12345" -> 12345 */
function gidToNumericId(gid: string): number {
  const parts = gid.split("/");
  const id = parseInt(parts[parts.length - 1], 10);
  if (isNaN(id)) throw new Error(`Invalid variant GID: "${gid}"`);
  return id;
}

export async function POST(req: NextRequest) {
  let body: TotemBuildConfig;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pieces, fixationId, cableId } = body;

  if (!Array.isArray(pieces) || pieces.length === 0) {
    return NextResponse.json(
      { error: "At least one piece is required" },
      { status: 400 }
    );
  }
  const invalidPiece = pieces.find((p) => !p.shapeId || !p.colorId);
  if (invalidPiece) {
    return NextResponse.json(
      { error: "Each piece must have a shapeId and colorId" },
      { status: 400 }
    );
  }
  if (!fixationId || !cableId) {
    return NextResponse.json(
      { error: "fixationId and cableId are required" },
      { status: 400 }
    );
  }

  // Guard: fail clearly if variant IDs are still placeholders
  const unresolvedKeys: string[] = [];
  for (const piece of pieces) {
    const key = `${piece.shapeId}-${piece.colorId}`;
    if (!SHAPE_COLOR_VARIANT_MAP[key] || SHAPE_COLOR_VARIANT_MAP[key] === "VARIANT_PLACEHOLDER") {
      unresolvedKeys.push(key);
    }
  }
  if (!FIXATION_VARIANT_MAP[fixationId] || FIXATION_VARIANT_MAP[fixationId] === "VARIANT_PLACEHOLDER") {
    unresolvedKeys.push(`fixation:${fixationId}`);
  }
  if (!CABLE_VARIANT_MAP[cableId] || CABLE_VARIANT_MAP[cableId] === "VARIANT_PLACEHOLDER") {
    unresolvedKeys.push(`cable:${cableId}`);
  }
  if (unresolvedKeys.length > 0) {
    console.error("[totem-checkout] Unresolved variant IDs:", unresolvedKeys);
    return NextResponse.json(
      { error: "Product variants not yet configured — contact the studio" },
      { status: 503 }
    );
  }

  const lineItems: DraftOrderLineItem[] = [
    // One line per configured piece
    ...pieces.map((piece) => {
      const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
      const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
      const gid = SHAPE_COLOR_VARIANT_MAP[`${piece.shapeId}-${piece.colorId}`];
      return {
        variant_id: gidToNumericId(gid),
        quantity: 1,
        properties: [
          { name: "Shape", value: shape?.name ?? piece.shapeId },
          { name: "Color", value: color?.name ?? piece.colorId },
          ...(piece.flipped ? [{ name: "Orientation", value: "Flipped" }] : []),
        ],
      };
    }),
    // Fixation line
    {
      variant_id: gidToNumericId(FIXATION_VARIANT_MAP[fixationId]),
      quantity: 1,
      properties: [
        {
          name: "Fixation",
          value: TOTEM_FIXATIONS.find((f) => f.id === fixationId)?.name ?? fixationId,
        },
      ],
    },
    // Cable line
    {
      variant_id: gidToNumericId(CABLE_VARIANT_MAP[cableId]),
      quantity: 1,
      properties: [
        {
          name: "Cable",
          value: TOTEM_CABLES.find((c) => c.id === cableId)?.name ?? cableId,
        },
      ],
    },
  ];

  const cable = TOTEM_CABLES.find((c) => c.id === cableId)?.name ?? cableId;
  const fixation = TOTEM_FIXATIONS.find((f) => f.id === fixationId)?.name ?? fixationId;
  const note = `Custom Totem — ${pieces.length} piece${pieces.length !== 1 ? "s" : ""}, ${cable} Cable, ${fixation} Fixation`;

  try {
    const { invoiceUrl } = await createDraftOrder({ line_items: lineItems, note });
    return NextResponse.json({ invoice_url: invoiceUrl });
  } catch (err) {
    console.error("[totem-checkout] Draft order creation failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
