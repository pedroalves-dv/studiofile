"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, RotateCcw } from "lucide-react";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  TOTEM_PRESETS,
  calcTotemPrice,
  type TotemPiece,
} from "@/lib/totem-config";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils/cn";

const SHAPE_HEIGHTS: Record<string, number> = {
  arch: 52,
  dome: 44,
  cylinder: 64,
  cone: 56,
  wave: 44,
  sphere: 44,
  torus: 28,
  prism: 52,
};

type Mode = "build" | "presets";

export function TotemConfigurator() {
  const { addBundle } = useCart();

  const [pieces, setPieces] = useState<TotemPiece[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [fixationId, setFixationId] = useState(TOTEM_FIXATIONS[0].id);
  const [cableId, setCableId] = useState(TOTEM_CABLES[0].id);
  const [isAdding, setIsAdding] = useState(false);
  const [mode, setMode] = useState<Mode>("build");
  const [draggedUid, setDraggedUid] = useState<string | null>(null);

  function addShape(shapeId: string) {
    const uid = Math.random().toString(36).slice(2, 10);
    setPieces((prev) => [
      ...prev,
      { uid, shapeId, colorId: "chalk", flipped: false },
    ]);
  }

  function removeShape(uid: string) {
    setPieces((prev) => prev.filter((p) => p.uid !== uid));
    if (selectedUid === uid) setSelectedUid(null);
  }

  function setColorForPiece(uid: string, colorId: string) {
    setPieces((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, colorId } : p)),
    );
  }

  function flipPiece(uid: string) {
    setPieces((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, flipped: !p.flipped } : p)),
    );
  }

  function moveUp(uid: string) {
    setPieces((prev) => {
      const i = prev.findIndex((p) => p.uid === uid);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(uid: string) {
    setPieces((prev) => {
      const i = prev.findIndex((p) => p.uid === uid);
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  function handleDrop(targetUid: string) {
    if (!draggedUid || draggedUid === targetUid) {
      setDraggedUid(null);
      return;
    }
    setPieces((prev) => {
      const next = [...prev];
      const draggedIdx = next.findIndex((p) => p.uid === draggedUid);
      const targetIdx = next.findIndex((p) => p.uid === targetUid);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      [next[draggedIdx], next[targetIdx]] = [next[targetIdx], next[draggedIdx]];
      return next;
    });
    setDraggedUid(null);
  }

  function applyPreset(presetId: string) {
    const preset = TOTEM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setPieces(
      preset.pieces.map((p) => ({
        uid: Math.random().toString(36).slice(2, 10),
        shapeId: p.shapeId,
        colorId: p.colorId,
        flipped: p.flipped,
      })),
    );
    setFixationId(preset.fixationId);
    setCableId(preset.cableId);
    setSelectedUid(null);
    setMode("build");
  }

  async function handleAddToCart() {
    if (pieces.length === 0 || isAdding) return;
    setIsAdding(true);
    await addBundle({ pieces, fixationId, cableId });
    setPieces([]);
    setSelectedUid(null);
    setMode("build");
    setIsAdding(false);
  }

  const totalPrice = calcTotemPrice({ pieces, fixationId, cableId });
  const selectedPiece = pieces.find((p) => p.uid === selectedUid);

  return (
    <div className="flex flex-col gap-10 sm:grid sm:grid-cols-3">
      {/* ── Section A: Compound Viewer ── */}

      <div
        className="border border-stroke col-span-2 cursor-default"
        onClick={() => setSelectedUid(null)}
      >
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          {/* Left half — visual stack */}

          <div className="w-full border-b sm:border-b-0 sm:border-r border-stroke flex items-center justify-center py-6 min-h-52">
            {pieces.length === 0 ? (
              <div className="w-0.5 border-l-2 border-dashed border-stroke h-40" />
            ) : (
              <div className="flex flex-col items-center" style={{ gap: 4 }}>
                {pieces.map((piece) => {
                  const color = TOTEM_COLORS.find(
                    (c) => c.id === piece.colorId,
                  );
                  const height = SHAPE_HEIGHTS[piece.shapeId] ?? 44;
                  const isSelected = selectedUid === piece.uid;
                  return (
                    <div
                      key={piece.uid}
                      draggable
                      onDragStart={() => setDraggedUid(piece.uid)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(piece.uid)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUid(isSelected ? null : piece.uid);
                      }}
                      className={cn(
                        "cursor-grab active:cursor-grabbing transition-all",
                        isSelected && "ring-2 ring-ink",
                      )}
                      style={{
                        width: 80,
                        height,
                        backgroundColor: color?.hex ?? "#F2F0EB",
                        borderRadius: 4,
                        transform: piece.flipped ? "scaleY(-1)" : undefined,
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right half — named list */}
          <div className="flex-1 divide-y divide-stroke">
            {pieces.length === 0 ? (
              <p className="font-mono text-sm text-muted px-4 py-6">
                Add shapes →
              </p>
            ) : (
              pieces.map((piece, idx) => {
                const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
                const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
                const isSelected = selectedUid === piece.uid;
                return (
                  <div
                    key={piece.uid}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                      isSelected ? "bg-stroke/30" : "hover:bg-stroke/10",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUid(isSelected ? null : piece.uid);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm">
                        {shape?.name ?? piece.shapeId}
                      </p>
                      <p className="font-mono text-xs text-muted">
                        {color?.name ?? piece.colorId}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        aria-label="Move piece up"
                        disabled={idx === 0}
                        onClick={() => moveUp(piece.uid)}
                        className="p-1 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move piece down"
                        disabled={idx === pieces.length - 1}
                        onClick={() => moveDown(piece.uid)}
                        className="p-1 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label="Flip shape"
                        onClick={() => flipPiece(piece.uid)}
                        className="p-1 text-muted hover:text-ink transition-colors"
                      >
                        <RotateCcw size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove piece"
                        onClick={() => removeShape(piece.uid)}
                        className="p-1 text-muted hover:text-error transition-colors ml-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="border-t border-stroke px-4 py-3">
          {!selectedPiece && (
            <p className="font-mono text-xs text-muted mb-2">
              Select a piece to change its colour
            </p>
          )}
          <div
            className={cn(
              "flex flex-wrap gap-1.5 transition-opacity",
              !selectedPiece && "opacity-30 pointer-events-none",
            )}
          >
            {TOTEM_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                onClick={(e) => {
                  e.stopPropagation(); // don't bubble up to deselect
                  if (selectedPiece) setColorForPiece(selectedPiece.uid, c.id);
                }}
                className={cn(
                  "w-7 h-7 transition-all",
                  selectedPiece?.colorId === c.id
                    ? "ring-1 ring-ink ring-offset-1"
                    : "ring-1 ring-transparent hover:ring-stroke",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* ── Section C: Shape catalog with mode tabs ── */}
        <div className="flex flex-col gap-6">
          {/* Tab bar */}
          <div className="flex gap-6 border-b border-stroke pb-px">
            {(["build", "presets"] as Mode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={cn(
                  "font-mono text-xs uppercase tracking-wider pb-2 -mb-px border-b-2 transition-colors",
                  mode === tab
                    ? "border-ink text-ink"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {tab === "build" ? "Custom" : "Models"}
              </button>
            ))}
          </div>

          {/* Build your own tab */}
          {mode === "build" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-stroke">
              {TOTEM_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  aria-label={`Add ${shape.name}`}
                  onClick={() => addShape(shape.id)}
                  className="group relative bg-canvas border border-stroke hover:border-ink transition-colors text-left flex flex-col"
                >
                  <div className="aspect-square w-full bg-stone-100 group-hover:bg-stone-200 transition-colors" />
                  <div className="px-3 py-2.5 flex items-end justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm uppercase">
                        {shape.name}
                      </p>
                      <p className="font-mono text-xs text-muted">
                        €{shape.price}
                      </p>
                    </div>
                    <Plus
                      size={14}
                      className="shrink-0 text-muted group-hover:text-ink transition-colors mb-0.5"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Ready-made presets tab */}
          {mode === "presets" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stroke">
              {TOTEM_PRESETS.map((preset) => {
                const presetPrice = calcTotemPrice({
                  pieces: preset.pieces.map((p) => ({
                    uid: "",
                    shapeId: p.shapeId,
                    colorId: p.colorId,
                    flipped: p.flipped,
                  })),
                  fixationId: preset.fixationId,
                  cableId: preset.cableId,
                });
                return (
                  <div
                    key={preset.id}
                    className="bg-canvas border border-stroke flex flex-col gap-3 p-4"
                  >
                    <div>
                      <h3 className="font-display text-lg">{preset.name}</h3>
                      <p className="font-mono text-xs text-muted mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {preset.pieces.map((p, i) => {
                        const color = TOTEM_COLORS.find(
                          (c) => c.id === p.colorId,
                        );
                        return (
                          <span
                            key={i}
                            className="w-3 h-3 inline-block"
                            style={{ backgroundColor: color?.hex ?? "#F2F0EB" }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <p className="font-mono text-sm">€{presetPrice}</p>
                      <button
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        className="font-mono text-xs border border-stroke px-3 py-1.5 hover:border-ink transition-colors"
                      >
                        Use this
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section B: System selectors + Price + Add to Cart ── */}
        <div className="flex flex-col gap-6 border-t border-stroke pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                Fixation
              </label>
              <select
                value={fixationId}
                onChange={(e) => setFixationId(e.target.value)}
                className="font-mono text-sm border border-stroke bg-canvas text-ink px-3 py-2 focus:outline-none focus:border-ink"
              >
                {TOTEM_FIXATIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — €{f.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-muted">
                Cable
              </label>
              <select
                value={cableId}
                onChange={(e) => setCableId(e.target.value)}
                className="font-mono text-sm border border-stroke bg-canvas text-ink px-3 py-2 focus:outline-none focus:border-ink"
              >
                {TOTEM_CABLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — €{c.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-mono text-2xl text-ink">€{totalPrice}</p>
              {pieces.length > 0 && (
                <p className="font-mono text-xs text-muted mt-0.5">
                  {pieces.length} piece{pieces.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={pieces.length === 0 || isAdding}
              className="bg-ink text-canvas font-mono text-sm py-3 px-8 transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding…" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
