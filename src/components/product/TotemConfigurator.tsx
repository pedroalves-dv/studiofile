"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
} from "lucide-react";

import { useToast } from "@/components/common/Toast";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  TOTEM_PRESETS,
  calcTotemPrice,
  type TotemPiece,
} from "@/lib/totem-config";
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

const ZOOM_STEPS = [0.5, 0.65, 0.8, 1.0, 1.2, 1.4];
const DEFAULT_ZOOM_IDX = 3;

type Mode = "build" | "presets";

export function TotemConfigurator() {
  const toast = useToast();
  const [pieces, setPieces] = useState<TotemPiece[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [fixationId, setFixationId] = useState(TOTEM_FIXATIONS[0].id);
  const [cableId, setCableId] = useState(TOTEM_CABLES[0].id);
  const [isAdding, setIsAdding] = useState(false);
  const [mode, setMode] = useState<Mode>("build");
  const [draggedUid, setDraggedUid] = useState<string | null>(null);
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM_IDX);
  const [showList, setShowList] = useState(true);

  // Ref on the visual panel so we can measure its height for fit-to-viewer
  const visualPanelRef = useRef<HTMLDivElement>(null);

  // Capture wheel events inside the viewer so they scroll the panel, not the page
  useEffect(() => {
    const el = visualPanelRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canDown = scrollTop + clientHeight < scrollHeight - 1;
      const canUp = scrollTop > 0;
      if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) {
        e.preventDefault();
        el.scrollBy({ top: e.deltaY });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoom = ZOOM_STEPS[zoomIdx];

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

  // Snaps to the closest ZOOM_STEPS entry that makes the full stack fit the panel
  function fitToViewer() {
    if (pieces.length === 0) return;
    const el = visualPanelRef.current;
    const containerHeight = el?.clientHeight ?? 400;
    const available = containerHeight - 80; // py-6 padding + button row clearance
    const ideal = available / totalStackHeight;
    const closestIdx = ZOOM_STEPS.reduce(
      (best, step, idx) =>
        Math.abs(step - ideal) < Math.abs(ZOOM_STEPS[best] - ideal)
          ? idx
          : best,
      0,
    );
    setZoomIdx(closestIdx);
    el?.scrollTo({ top: 0 });
  }

  const handleAddToCart = async () => {
    if (pieces.length === 0) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/totem-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieces, fixationId, cableId }),
      });
      const data = (await res.json()) as {
        invoice_url?: string;
        error?: string;
      };
      if (!res.ok || !data.invoice_url) {
        toast.error("Unable to process order. Please try again.");
        return;
      }
      window.location.href = data.invoice_url;
    } catch {
      toast.error("Unable to process order. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const totalStackHeight =
    pieces.length === 0
      ? 0
      : pieces.reduce((sum, p) => sum + (SHAPE_HEIGHTS[p.shapeId] ?? 44), 0) +
        (pieces.length - 1) * 4;

  const totalPrice = calcTotemPrice({ pieces, fixationId, cableId });
  const selectedPiece = pieces.find((p) => p.uid === selectedUid);

  return (
    <div className="flex flex-col gap-10 sm:grid sm:grid-cols-3 sm:items-start pb-20">
      {/* ── Section A: Compound Viewer ── */}
      <div
        className="bg-white border border-ink rounded-md col-span-2 cursor-default sm:sticky sm:top-[calc(2*(var(--header-height)))] flex flex-col h-[500px] sm:h-[680px]"
        onClick={() => setSelectedUid(null)}
      >
        {/* Inner row: visual panel + list panel */}
        <div className="flex flex-row items-stretch flex-1 min-h-0 overflow-hidden">
          {/* ── Left: visual stack ── */}
          {/* Outer wrapper: not scrollable, anchors the zoom buttons */}
          <div className="relative flex-1 min-h-0 border-b sm:border-b-0 sm:border-r border-stroke">
            {/* Zoom controls — always visible, outside scroll container */}
            <div
              className="absolute top-2 left-2 flex items-center gap-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoomIdx === 0}
                onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
                className="p-1 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomOut size={18} />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoomIdx === ZOOM_STEPS.length - 1}
                onClick={() =>
                  setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))
                }
                className="p-1 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomIn size={18} />
              </button>
              <button
                type="button"
                aria-label="Fit to viewer"
                disabled={pieces.length === 0}
                onClick={fitToViewer}
                className="p-1 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {/* Scrollable inner panel */}
            <div
              ref={visualPanelRef}
              className="w-full h-full flex items-center justify-center py-6 overflow-y-auto"
            >
              {pieces.length === 0 ? (
                <div className="w-0.5 border-l-2 border-dashed border-stroke h-40" />
              ) : (
                <div
                  className="flex flex-col items-center"
                  style={{ gap: 4 * zoom }}
                >
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
                          width: 80 * zoom,
                          height: height * zoom,
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
          </div>

          {/* ── Right: named list ── */}
          <div
            className={cn(
              "flex-shrink-0 flex flex-col border-l border-stroke transition-all duration-200",
              showList ? "w-44" : "w-8",
            )}
          >
            {/* Toggle button — always visible */}
            <div
              className="flex justify-end p-1 border-b border-stroke"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label={showList ? "Hide list" : "Show list"}
                onClick={() => setShowList((v) => !v)}
                className="p-1 text-muted hover:text-ink transition-colors"
              >
                <ChevronRight
                  size={18}
                  className={cn(
                    "transition-transform duration-200",
                    !showList && "rotate-180",
                  )}
                />
              </button>
            </div>

            {/* Collapsible list */}
            {showList && (
              <div className="flex-1 overflow-y-auto">
                {pieces.length === 0 ? (
                  <p className="font-body text-sm text-muted px-4 py-4">
                    Add shapes →
                  </p>
                ) : (
                  pieces.map((piece, idx) => {
                    const shape = TOTEM_SHAPES.find(
                      (s) => s.id === piece.shapeId,
                    );
                    const color = TOTEM_COLORS.find(
                      (c) => c.id === piece.colorId,
                    );
                    const isSelected = selectedUid === piece.uid;
                    return (
                      <div
                        key={piece.uid}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors border-b-2",
                          isSelected ? "bg-stroke/30" : "hover:bg-lighter",
                        )}
                        style={{ borderBottomColor: color?.hex ?? "#E5E0D8" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUid(isSelected ? null : piece.uid);
                        }}
                      >
                        <p className="font-body text-sm flex-1 min-w-0 truncate">
                          {shape?.name ?? piece.shapeId}
                        </p>
                        <div
                          className="flex flex-col items-end gap-0.5 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Move piece up"
                              disabled={idx === 0}
                              onClick={() => moveUp(piece.uid)}
                              className="p-0.5 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              aria-label="Move piece down"
                              disabled={idx === pieces.length - 1}
                              onClick={() => moveDown(piece.uid)}
                              className="p-0.5 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronDown size={12} />
                            </button>
                            <button
                              type="button"
                              aria-label="Flip shape"
                              onClick={() => flipPiece(piece.uid)}
                              className="p-0.5 text-muted hover:text-ink transition-colors"
                            >
                              <RotateCcw size={12} />
                            </button>
                            <button
                              type="button"
                              aria-label="Remove piece"
                              onClick={() => removeShape(piece.uid)}
                              className="p-0.5 text-muted hover:text-error transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Color picker — always pinned at bottom ── */}
        <div className="flex-shrink-0 border-t border-stroke px-4 py-3">
          {/* <p className="font-body text-sm tracking-tight text-muted mb-2">
            Colors
          </p> */}
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
                  e.stopPropagation();
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

      {/* ── Section C: Shape catalog with mode tabs ── */}
      <div className="flex flex-col gap-6">
        <h1 className="text-left text-6xl sm:text-8xl font-display tracking-[-0.04em] sm:-ml-[5px] sm:leading-[0.9] leading-[4rem] whitespace-nowrap pb-4">
          TOTEM
        </h1>
        <div className="flex flex-col gap-6">
          {/* Tab bar */}
          <div className="flex gap-2 pb-px">
            {(["build", "presets"] as Mode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={cn(
                  "font-body text-base tracking-tight py-1 px-3 border rounded-md transition-colors",
                  mode === tab
                    ? "border-ink text-ink"
                    : "border-transparent text-light hover:text-ink",
                )}
              >
                {tab === "build" ? "Custom" : "Models"}
              </button>
            ))}
          </div>

          {/* Build your own tab */}
          {mode === "build" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
              {TOTEM_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  aria-label={`Add ${shape.name}`}
                  onClick={() => addShape(shape.id)}
                  className="group relative bg-canvas border border-stroke rounded-md hover:border-ink transition-colors text-left flex flex-col"
                >
                  <div className="aspect-square w-full bg-light border-t border-light rounded-md group-hover:bg-muted transition-colors" />
                  <div className="px-3 py-2.5 flex items-end justify-between gap-2">
                    <div>
                      <p className="font-body text-sm">{shape.name}</p>
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
              {isAdding ? "Ordering…" : "Order now"}
            </button>
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-4 border-t border-stroke pt-6">
            <h2 className="font-display text-xs uppercase tracking-widest text-muted">
              About
            </h2>
            <p className="font-body text-sm text-ink leading-relaxed">
              TOTEM is a modular lighting object built from stackable geometric
              forms. Each piece is cast in powder-coated aluminium and connects
              through a central cable — no tools, no hardware.
            </p>
            <p className="font-body text-sm text-muted leading-relaxed">
              Choose your shapes, set the order, pick a finish. The fixation
              mounts flush to ceiling or wall. Cable length determines how low
              the stack hangs.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
              {[
                ["Material", "Powder-coated aluminium"],
                ["Assembly", "Tool-free, 5 min"],
                ["Cable", "Textile, 2 or 3 m"],
                ["Bulb", "E27, max 40 W"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {label}
                  </p>
                  <p className="font-body text-sm text-ink mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
