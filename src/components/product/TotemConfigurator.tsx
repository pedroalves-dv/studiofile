"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  GripVertical,
} from "lucide-react";

import { useToast } from "@/components/common/Toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { generateUid } from "@/lib/utils/uid";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  TOTEM_PRESETS,
  SHAPE_MAP,
  COLOR_MAP,
  calcTotemPrice,
  type TotemPiece,
} from "@/lib/totem-config";
import { cn } from "@/lib/utils/cn";

/* ── Constants ── */

const MAX_PIECES = 12;
const ZOOM_STEPS = [0.5, 0.65, 0.8, 1.0, 1.2, 1.4];
const DEFAULT_ZOOM_IDX = 3;

// F3: Pre-compute preset prices at module scope — these are static constants
const PRESET_PRICES = new Map(
  TOTEM_PRESETS.map((preset) => [
    preset.id,
    calcTotemPrice({
      pieces: preset.pieces.map((p) => ({
        uid: "",
        shapeId: p.shapeId,
        colorId: p.colorId,
        flipped: p.flipped,
      })),
      fixationId: preset.fixationId,
      cableId: preset.cableId,
    }),
  ]),
);

type Mode = "build" | "presets";

export function TotemConfigurator() {
  const toast = useToast();

  // U1: Persist config across refresh via useLocalStorage
  const [pieces, setPieces] = useLocalStorage<TotemPiece[]>(
    "sf-totem-pieces",
    [],
  );
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [fixationId, setFixationId] = useLocalStorage(
    "sf-totem-fixation",
    TOTEM_FIXATIONS[0].id,
  );
  const [cableId, setCableId] = useLocalStorage(
    "sf-totem-cable",
    TOTEM_CABLES[0].id,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [mode, setMode] = useState<Mode>("build");
  const [draggedUid, setDraggedUid] = useState<string | null>(null);
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM_IDX);
  const [showList, setShowList] = useState(true);
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const viewerRef = useRef<HTMLDivElement>(null);
  const visualPanelRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef(pieces);
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  // B1: Sync selection — if selected piece no longer exists, clear it.
  // Covers removeShape, applyPreset, and any future mutation paths.
  useEffect(() => {
    if (selectedUid && !pieces.find((p) => p.uid === selectedUid)) {
      setSelectedUid(null);
    }
  }, [pieces, selectedUid]);

  // F1: useMediaQuery instead of manual matchMedia
  const isDesktop = useMediaQuery("(min-width: 640px)");
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (isDesktop) viewer.setAttribute("data-lenis-prevent", "");
    else viewer.removeAttribute("data-lenis-prevent");
  }, [isDesktop]);

  /* ── Touch drag-to-reorder ── */

  const touchDragRef = useRef<string | null>(null);

  const updateGhost = useCallback((uid: string, x: number, y: number) => {
    const el = ghostRef.current;
    if (!el) return;
    const piece = piecesRef.current.find((p) => p.uid === uid);
    const shape = piece ? SHAPE_MAP.get(piece.shapeId) : undefined;
    const color = piece ? COLOR_MAP.get(piece.colorId) : undefined;
    const swatch = el.querySelector("[data-swatch]") as HTMLElement | null;
    const label = el.querySelector("[data-label]") as HTMLElement | null;
    if (swatch) swatch.style.backgroundColor = color?.hex ?? "#F2F0EB";
    if (label) label.textContent = shape?.name ?? piece?.shapeId ?? "";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.display = "flex";
  }, []);

  const startTouchDrag = useCallback(
    (uid: string, touch?: { clientX: number; clientY: number }) => {
      touchDragRef.current = uid;
      setDraggedUid(uid);
      if (touch) updateGhost(uid, touch.clientX, touch.clientY);
    },
    [updateGhost],
  );

  // B2: Register touch listeners once on mount — guard inside handlers with touchDragRef
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onMove = (e: TouchEvent) => {
      if (!touchDragRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const ghost = ghostRef.current;
      if (ghost) {
        ghost.style.left = `${touch.clientX}px`;
        ghost.style.top = `${touch.clientY}px`;
      }
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const target = el?.closest("[data-uid]") as HTMLElement | null;
      const targetUid = target?.dataset.uid;
      if (targetUid && targetUid !== touchDragRef.current) {
        setPieces((prev) => {
          const next = [...prev];
          const dIdx = next.findIndex((p) => p.uid === touchDragRef.current);
          const tIdx = next.findIndex((p) => p.uid === targetUid);
          if (dIdx === -1 || tIdx === -1) return prev;
          [next[dIdx], next[tIdx]] = [next[tIdx], next[dIdx]];
          return next;
        });
      }
    };

    const onEnd = () => {
      touchDragRef.current = null;
      setDraggedUid(null);
      if (ghostRef.current) ghostRef.current.style.display = "none";
    };

    viewer.addEventListener("touchmove", onMove, { passive: false });
    viewer.addEventListener("touchend", onEnd);
    viewer.addEventListener("touchcancel", onEnd);
    return () => {
      viewer.removeEventListener("touchmove", onMove);
      viewer.removeEventListener("touchend", onEnd);
      viewer.removeEventListener("touchcancel", onEnd);
    };
    // Intentionally mount-only — handlers guard with touchDragRef.current,
    // adding deps would re-register listeners during active drags (B2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoom = ZOOM_STEPS[zoomIdx];

  // B3: totalStackHeight computed before fitToViewer so it reads cleanly
  const totalStackHeight =
    pieces.length === 0
      ? 0
      : pieces.reduce(
          (sum, p) => sum + (SHAPE_MAP.get(p.shapeId)?.height ?? 44),
          0,
        ) +
        (pieces.length - 1) * 4;

  function fitToViewer() {
    if (pieces.length === 0) return;
    const el = visualPanelRef.current;
    const containerHeight = el?.clientHeight ?? 400;
    const available = containerHeight - 80;
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

  // B4: Guard addShape with MAX_PIECES
  function addShape(shapeId: string) {
    if (pieces.length >= MAX_PIECES) {
      toast.info(`Maximum ${MAX_PIECES} pieces allowed.`);
      return;
    }
    const uid = generateUid();
    setPieces((prev) => [
      ...prev,
      { uid, shapeId, colorId: "chalk", flipped: false },
    ]);
  }

  // B1: No manual selection clearing — synced by useEffect above
  function removeShape(uid: string) {
    setPieces((prev) => prev.filter((p) => p.uid !== uid));
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
        uid: generateUid(),
        shapeId: p.shapeId,
        colorId: p.colorId,
        flipped: p.flipped,
      })),
    );
    setFixationId(preset.fixationId);
    setCableId(preset.cableId);
    setSelectedUid(null);
  }

  // R2: Shared handleDragStart — used by visual stack and list panel
  const handleDragStart = useCallback(
    (piece: TotemPiece, e: React.DragEvent) => {
      setDraggedUid(piece.uid);
      const el = dragImageRef.current;
      if (!el) return;
      const shape = SHAPE_MAP.get(piece.shapeId);
      const color = COLOR_MAP.get(piece.colorId);
      const swatch = el.querySelector("[data-swatch]") as HTMLElement | null;
      const label = el.querySelector("[data-label]") as HTMLElement | null;
      if (swatch) swatch.style.backgroundColor = color?.hex ?? "#F2F0EB";
      if (label) label.textContent = shape?.name ?? piece.shapeId;
      e.dataTransfer.setDragImage(el, 40, 20);
    },
    [],
  );

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

  const totalPrice = calcTotemPrice({ pieces, fixationId, cableId });
  const selectedPiece = pieces.find((p) => p.uid === selectedUid);

  return (
    <div className="flex flex-col sm:gap-10 sm:grid sm:grid-cols-3 sm:items-start pb-20">
      {/* ── Product title — mobile only, above viewer ── */}
      <h1 className="sm:hidden text-left text-5xl font-display tracking-tight mb-2">
        TOTEM
      </h1>

      {/* ── Section A: Viewer + Panels ── */}
      <div
        ref={viewerRef}
        className="relative bg-white border border-ink rounded-md col-span-2 cursor-default sm:sticky sm:top-[calc(2*(var(--header-height)))] flex flex-col h-[480px] sm:h-[680px] mb-6"
        onClick={() => setSelectedUid(null)}
      >
        {/* Inner row: visual panel + list/action panel */}
        <div className="flex flex-row items-stretch flex-1 min-h-0 overflow-hidden">
          {/* ── Left: visual stack ── */}
          <div className="relative flex-1 min-h-0 sm:border-r border-stroke">
            {/* Zoom controls */}
            <div
              className="absolute top-2 left-2 flex flex-col gap-1 z-10"
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
              className="relative w-full h-full flex items-center justify-center py-6 overflow-hidden sm:overflow-y-auto overscroll-contain"
            >
              {pieces.length === 0 ? (
                <>
                  {/* Mobile empty-state helper */}
                  <div className="absolute inset-0 flex sm:hidden flex-col items-center justify-center pointer-events-none">
                    <p className="font-body font-medium text-lg tracking-tighter text-muted">
                      Add shapes to start building
                    </p>
                    <p className="absolute top-4 right-2 font-body text-xs text-muted text-right">
                      Reorder &amp; flip →
                    </p>
                    <p className="absolute bottom-2 inset-x-0 text-center font-body text-xs text-muted">
                      Pick a color ↓
                    </p>
                  </div>
                  {/* Desktop empty-state helper */}
                  <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-center pointer-events-none">
                    <p className="font-body font-medium text-lg tracking-tighter text-muted">
                      Add shapes to start building
                    </p>
                    <p className="absolute top-4 right-2 font-body text-xs text-muted text-right">
                      Piece list &amp; controls →
                    </p>
                    <p className="absolute bottom-2 inset-x-0 text-center font-body text-xs text-muted">
                      Pick a color ↓
                    </p>
                  </div>
                </>
              ) : (
                <div
                  className="flex flex-col items-center"
                  style={{ gap: 4 * zoom }}
                >
                  {pieces.map((piece) => {
                    const shape = SHAPE_MAP.get(piece.shapeId);
                    const color = COLOR_MAP.get(piece.colorId);
                    const height = shape?.height ?? 44;
                    const isSelected = selectedUid === piece.uid;
                    return (
                      <div
                        key={piece.uid}
                        data-uid={piece.uid}
                        draggable
                        onDragStart={(e) => handleDragStart(piece, e)}
                        onDragEnd={() => setDraggedUid(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(piece.uid)}
                        onTouchStart={(e) =>
                          startTouchDrag(piece.uid, e.touches[0])
                        }
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

          {/* ── Right panel ── */}
          <div className="flex-shrink-0 flex flex-col min-h-0 border-l border-stroke transition-all duration-200 w-fit">
            {/* U2: Mobile — compact action column with large touch targets */}
            <div
              className="flex sm:hidden flex-col items-center gap-1 p-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Move piece up"
                disabled={
                  !selectedUid ||
                  pieces.findIndex((p) => p.uid === selectedUid) <= 0
                }
                onClick={() => selectedUid && moveUp(selectedUid)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                aria-label="Move piece down"
                disabled={
                  !selectedUid ||
                  pieces.findIndex((p) => p.uid === selectedUid) >=
                    pieces.length - 1
                }
                onClick={() => selectedUid && moveDown(selectedUid)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown size={18} />
              </button>
              <button
                type="button"
                aria-label="Flip shape"
                disabled={!selectedUid}
                onClick={() => selectedUid && flipPiece(selectedUid)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                aria-label="Remove piece"
                disabled={!selectedUid}
                onClick={() => selectedUid && removeShape(selectedUid)}
                className="p-3 text-muted hover:text-error disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Desktop — full list panel */}
            <div className="hidden sm:flex flex-col flex-1 min-h-0">
              {/* Toggle button */}
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
                <div
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
                  data-lenis-prevent-touch
                >
                  {pieces.length === 0 ? (
                    <p className="font-body text-sm text-muted px-4 py-4">
                      Add shapes →
                    </p>
                  ) : (
                    pieces.map((piece, idx) => {
                      const shape = SHAPE_MAP.get(piece.shapeId);
                      const color = COLOR_MAP.get(piece.colorId);
                      const isSelected = selectedUid === piece.uid;
                      return (
                        <div
                          key={piece.uid}
                          data-uid={piece.uid}
                          draggable
                          onDragStart={(e) => handleDragStart(piece, e)}
                          onDragEnd={() => setDraggedUid(null)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(piece.uid)}
                          className={cn(
                            "flex items-center gap-3 sm:gap-2 px-2 sm:px-3 py-4 cursor-pointer transition-colors border-b-4",
                            isSelected
                              ? "bg-lighter"
                              : "[@media(hover:hover)]:hover:bg-lighter",
                            draggedUid === piece.uid && "opacity-50",
                          )}
                          style={{
                            borderBottomColor: color?.hex ?? "#E5E0D8",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUid(isSelected ? null : piece.uid);
                          }}
                        >
                          {/* Drag handle */}
                          <div
                            className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-light"
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              startTouchDrag(piece.uid, e.touches[0]);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical size={14} />
                          </div>
                          <p className="font-body text-xs sm:text-sm flex-1 min-w-0 truncate">
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
        </div>

        {/* ── Preset confirmation overlay ── */}
        {pendingPresetId && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <p className="font-body text-sm text-ink">
                This will replace your current build.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingPresetId(null)}
                  className="font-body text-sm border border-stroke px-4 py-1.5 hover:border-ink transition-colors rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyPreset(pendingPresetId);
                    setPendingPresetId(null);
                  }}
                  className="font-body text-sm bg-ink text-canvas px-4 py-1.5 hover:opacity-80 transition-opacity rounded-md"
                >
                  Replace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Color picker — always pinned at bottom ── */}
        <div className="flex-shrink-0 border-t border-stroke px-4 py-3">
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

      {/* ── Section B: Shape catalog with mode tabs ── */}
      <div className="flex flex-col gap-6">
        <h1 className="hidden sm:block text-left sm:text-8xl font-display uppercase tracking-[-0.04em] sm:-ml-[5px] sm:leading-[0.9] whitespace-nowrap pb-4">
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
            <div className="grid grid-cols-3 gap-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOTEM_PRESETS.map((preset) => {
                const presetPrice = PRESET_PRICES.get(preset.id) ?? 0;
                return (
                  <div
                    key={preset.id}
                    className="bg-white border border-stroke rounded-md flex flex-col gap-3 p-4"
                  >
                    <div>
                      <h3 className="font-body font-bold tracking-tight text-lg">
                        {preset.name}
                      </h3>
                      <p className="font-body text-xs text-muted mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {preset.pieces.map((p, i) => {
                        const color = COLOR_MAP.get(p.colorId);
                        return (
                          <span
                            key={i}
                            className="w-3 h-3 inline-block"
                            style={{
                              backgroundColor: color?.hex ?? "#F2F0EB",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <p className="font-mono text-sm">€{presetPrice}</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (pieces.length > 0) {
                            setPendingPresetId(preset.id);
                          } else {
                            applyPreset(preset.id);
                          }
                        }}
                        className="font-body text-sm border border-ink px-3 py-1.5 hover:bg-lighter transition-colors rounded-md"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section C: System selectors + Price + Add to Cart ── */}
        <div className="flex flex-col gap-6 border-t border-stroke pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm tracking-tight text-muted">
                Fixation
              </label>
              <select
                value={fixationId}
                onChange={(e) => setFixationId(e.target.value)}
                className="font-body text-sm border border-stroke bg-white text-ink px-3 py-2 focus:outline-none focus:border-ink"
              >
                {TOTEM_FIXATIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — €{f.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm tracking-tight text-muted">
                Cable
              </label>
              <select
                value={cableId}
                onChange={(e) => setCableId(e.target.value)}
                className="font-body text-sm border border-stroke bg-white text-ink px-3 py-2 focus:outline-none focus:border-ink"
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
                <p className="font-body text-xs text-muted mt-0.5">
                  {pieces.length} piece{pieces.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={pieces.length === 0 || isAdding}
                className="bg-ink text-canvas font-body text-sm py-3 px-8 transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
              >
                {isAdding ? "Adding to Cart…" : "Add to Cart"}
              </button>
              {/* U3: Helper text when cart button is disabled */}
              {pieces.length === 0 && (
                <p className="font-body text-xs text-muted">
                  Add shapes to get started
                </p>
              )}
            </div>
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-4 border-t border-stroke pt-6">
            <h2 className="font-body text-3xl font-medium tracking-tighter text-ink">
              TOTEM - Modular Lamp
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

      {/* Off-screen element used by setDragImage for desktop drag */}
      {mounted &&
        createPortal(
          <div
            ref={dragImageRef}
            className="fixed flex items-center gap-2 font-body text-xs text-ink bg-white px-3 py-1.5 border border-stroke shadow-sm pointer-events-none"
            style={{ top: -9999, left: -9999, zIndex: -1 }}
          >
            <span data-swatch className="w-3 h-3 flex-shrink-0" />
            <span data-label />
          </div>,
          document.body,
        )}

      {/* Touch drag ghost — positioned via ref, hidden by default */}
      {mounted &&
        createPortal(
          <div
            ref={ghostRef}
            className="fixed z-50 pointer-events-none flex items-center gap-2 font-body text-xs text-ink bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-stroke shadow-sm"
            style={{ display: "none", transform: "translate(-50%, -120%)" }}
          >
            <span data-swatch className="w-3 h-3 flex-shrink-0" />
            <span data-label />
          </div>,
          document.body,
        )}
    </div>
  );
}
