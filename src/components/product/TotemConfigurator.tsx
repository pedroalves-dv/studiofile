"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useToast } from "@/components/common/Toast";
import { useCart } from "@/hooks/useCart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { generateUid } from "@/lib/utils/uid";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  TOTEM_PRESETS,
  COLOR_MAP,
  calcTotemPrice,
  type TotemShape,
  type TotemFixation,
  type TotemCable,
  type TotemPiece,
} from "@/lib/totem-config";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils/cn";

/* ── Constants ── */

const MAX_PIECES = 12;
const ZOOM_STEPS = [0.5, 0.65, 0.8, 1.0, 1.2, 1.4];
const DEFAULT_ZOOM_IDX = 3;

type Mode = "build" | "presets";

export function TotemConfigurator() {
  const toast = useToast();
  const { addTotemToCart } = useCart();

  // U1: Persist config across refresh via useLocalStorage
  const [pieces, setPieces] = useLocalStorage<TotemPiece[]>(
    "sf-totem-pieces",
    [],
  );
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [fixationId, setFixationId] = useLocalStorage(
    "sf-totem-fixation",
    TOTEM_FIXATIONS[0].id,
  );
  const [fixationColorId, setFixationColorId] = useLocalStorage(
    "sf-totem-fixation-color",
    TOTEM_COLORS[0].id,
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

  const [variantMap, setVariantMap] = useState<{
    shapes: Record<string, { id: string; available: boolean }>;
    cables: Record<string, { id: string; available: boolean }>;
  } | null>(null);

  // Dynamic catalog — loaded from Shopify on mount, falls back to static arrays
  const [catalogShapes, setCatalogShapes] =
    useState<TotemShape[]>(TOTEM_SHAPES);
  const [catalogFixations, setCatalogFixations] =
    useState<TotemFixation[]>(TOTEM_FIXATIONS);
  const [catalogCables, setCatalogCables] =
    useState<TotemCable[]>(TOTEM_CABLES);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/totem-catalog")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.shapes) && data.shapes.length > 0)
          setCatalogShapes(data.shapes);
        if (Array.isArray(data.fixations) && data.fixations.length > 0)
          setCatalogFixations(data.fixations);
        if (Array.isArray(data.cables) && data.cables.length > 0)
          setCatalogCables(data.cables);
      })
      .catch((err) =>
        console.error("[TotemConfigurator] catalog fetch failed:", err),
      )
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetch('/api/totem-variants')
      .then((res) => res.json())
      .then(setVariantMap)
      .catch(() => {}); // fail silently — UI degrades to showing all options as available
  }, []);

  const shapeMap = useMemo(
    () => new Map(catalogShapes.map((s) => [s.id, s])),
    [catalogShapes],
  );
  const fixationMap = useMemo(
    () => new Map(catalogFixations.map((f) => [f.id, f])),
    [catalogFixations],
  );
  const cableMap = useMemo(
    () => new Map(catalogCables.map((c) => [c.id, c])),
    [catalogCables],
  );

  // Ref for stale-closure-safe access inside [] dep callbacks (updateGhost, handleDragStart)
  const shapeMapRef = useRef(shapeMap);
  useEffect(() => {
    shapeMapRef.current = shapeMap;
  }, [shapeMap]);

  // Preset prices recomputed after catalog loads
  const presetPrices = useMemo(
    () =>
      new Map(
        TOTEM_PRESETS.map((preset) => [
          preset.id,
          calcTotemPrice(
            {
              pieces: preset.pieces.map((p) => ({
                uid: "",
                shapeId: p.shapeId,
                colorId: p.colorId,
                flipped: p.flipped,
              })),
              fixationId: preset.fixationId,
              fixationColorId: TOTEM_COLORS[0].id,
              cableId: preset.cableId,
            },
            shapeMap,
            fixationMap,
            cableMap,
          ),
        ]),
      ),
    [shapeMap, fixationMap, cableMap],
  );

  const viewerRef = useRef<HTMLDivElement>(null);
  const visualPanelRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef(pieces);
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  // Derived selection values
  const selectedPiece =
    selectedElement && selectedElement !== "fixation"
      ? pieces.find((p) => p.uid === selectedElement)
      : null;
  const fixationSelected = selectedElement === "fixation";
  const activeColorId = fixationSelected
    ? fixationColorId
    : selectedPiece?.colorId;

  // B1: Sync selection — clear if selected piece no longer exists.
  // Never clear if selectedElement === 'fixation' (fixation is always present).
  useEffect(() => {
    if (
      selectedElement &&
      selectedElement !== "fixation" &&
      !pieces.find((p) => p.uid === selectedElement)
    ) {
      setSelectedElement(null);
    }
  }, [pieces, selectedElement]);

  // F1: useMediaQuery instead of manual matchMedia
  const isDesktop = useMediaQuery("(min-width: 640px)");
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (isDesktop) viewer.setAttribute("data-lenis-prevent", "");
    else viewer.removeAttribute("data-lenis-prevent");
  }, [isDesktop]);

  /* ── Variant availability helpers ── */

  function isColorAvailableForShape(shapeId: string, colorId: string): boolean {
    if (!variantMap) return true; // optimistic while loading
    return variantMap.shapes[`${shapeId}-${colorId}`]?.available ?? false;
  }

  function isFixationColorAvailable(fxId: string, colorId: string): boolean {
    if (!variantMap) return true;
    return variantMap.shapes[`${fxId}-${colorId}`]?.available ?? false;
  }

  function isCableAvailable(id: string): boolean {
    if (!variantMap) return true;
    return variantMap.cables[id]?.available ?? false;
  }

  function isShapeFullyUnavailable(shapeId: string): boolean {
    if (!variantMap) return false;
    return TOTEM_COLORS.every((c) => !variantMap.shapes[`${shapeId}-${c.id}`]?.available);
  }

  function isFixationFullyUnavailable(fxId: string): boolean {
    if (!variantMap) return false;
    return TOTEM_COLORS.every((c) => !variantMap.shapes[`${fxId}-${c.id}`]?.available);
  }

  /* ── Touch drag-to-reorder ── */

  const touchDragRef = useRef<string | null>(null);

  const updateGhost = useCallback((uid: string, x: number, y: number) => {
    const el = ghostRef.current;
    if (!el) return;
    const piece = piecesRef.current.find((p) => p.uid === uid);
    const shape = piece ? shapeMapRef.current.get(piece.shapeId) : undefined;
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

  // B3: totalStackHeight includes fixation height so fitToViewer accounts for it
  const fixationHeight = fixationMap.get(fixationId)?.height ?? 24;
  const totalStackHeight =
    fixationHeight +
    (pieces.length === 0
      ? 0
      : pieces.reduce(
          (sum, p) => sum + (shapeMap.get(p.shapeId)?.height ?? 44),
          0,
        ) +
        (pieces.length - 1) * 4);

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
      { uid, shapeId, colorId: TOTEM_COLORS[0].id, flipped: false },
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

  function applyColor(colorId: string) {
    if (fixationSelected) setFixationColorId(colorId);
    else if (selectedPiece) setColorForPiece(selectedPiece.uid, colorId);
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
    setSelectedElement(null);
    setFixationColorId(TOTEM_COLORS[0].id);
  }

  // R2: Shared handleDragStart — used by visual stack and list panel
  const handleDragStart = useCallback(
    (piece: TotemPiece, e: React.DragEvent) => {
      setDraggedUid(piece.uid);
      const el = dragImageRef.current;
      if (!el) return;
      const shape = shapeMapRef.current.get(piece.shapeId);
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
      await addTotemToCart({ pieces, fixationId, fixationColorId, cableId });
      setPieces([]);
      setFixationId(catalogFixations[0]?.id ?? TOTEM_FIXATIONS[0].id);
      setFixationColorId(TOTEM_COLORS[0].id);
      setCableId(catalogCables[0]?.id ?? TOTEM_CABLES[0].id);
      setSelectedElement(null);
    } finally {
      setIsAdding(false);
    }
  };

  const totalPrice = calcTotemPrice(
    { pieces, fixationId, fixationColorId, cableId },
    shapeMap,
    fixationMap,
    cableMap,
  );

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
        onClick={() => setSelectedElement(null)}
      >
        {/* Inner row: visual panel + list/action panel */}
        <div className="flex flex-row items-stretch flex-1 min-h-0 overflow-hidden">
          {/* ── Left: visual stack ── */}
          <div className="relative flex-1 min-h-0">
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
              className="relative w-full h-full flex flex-col items-center py-6 overflow-hidden sm:overflow-y-auto overscroll-contain"
            >
              {/* Always-visible assembly: fixation → cable+shapes+bulb */}
              <div className="flex flex-col items-center">
                {/* Fixation block */}
                <div
                  className={cn(
                    "cursor-pointer transition-all flex-shrink-0",
                    fixationSelected && "ring-2 ring-ink",
                  )}
                  style={{
                    width: 80 * zoom,
                    height: fixationHeight * zoom,
                    backgroundColor:
                      COLOR_MAP.get(fixationColorId)?.hex ?? "#E8E0CF",
                    borderRadius: 4,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(fixationSelected ? null : "fixation");
                  }}
                />

                {/* Cable + shapes + bulb container */}
                <div
                  className="relative flex flex-col items-center"
                  style={{ gap: 4 * zoom }}
                >
                  {/* Cable line — absolute, spans full height of container */}
                  {cableId === "transparent" ? (
                    <div
                      className="absolute top-0 bottom-0 left-1/2 pointer-events-none"
                      style={{
                        width: 0,
                        borderLeft: "2px dashed #D0D0D0",
                        transform: "translateX(-1px)",
                      }}
                    />
                  ) : (
                    <div
                      className="absolute top-0 bottom-0 left-1/2 pointer-events-none"
                      style={{
                        width: 2,
                        backgroundColor:
                          cableMap.get(cableId)?.hex ?? "#B8860B",
                        transform: "translateX(-1px)",
                      }}
                    />
                  )}

                  {/* Gap spacer — always-visible cable segment below the fixation */}
                  <div style={{ height: 36 * zoom, flexShrink: 0 }} />

                  {/* Shape pieces — reversed so newest piece is nearest the fixation */}
                  {[...pieces].reverse().map((piece) => {
                    const shape = shapeMap.get(piece.shapeId);
                    const color = COLOR_MAP.get(piece.colorId);
                    const height = shape?.height ?? 44;
                    const isSelected = selectedElement === piece.uid;
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
                          setSelectedElement(isSelected ? null : piece.uid);
                        }}
                        className={cn(
                          "cursor-grab active:cursor-grabbing transition-all",
                          isSelected && "ring-2 ring-ink",
                        )}
                        style={{
                          position: "relative",
                          zIndex: 1,
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

                  {/* Bulb — always at the bottom of the cable */}
                  <div
                    className="flex-shrink-0 pointer-events-none"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      width: 12 * zoom,
                      height: 12 * zoom,
                      borderRadius: "50%",
                      backgroundColor: "#F5F0C8",
                    }}
                  />
                </div>
              </div>

              {/* Empty state overlay */}
              {pieces.length === 0 && (
                <>
                  {/* Mobile empty-state helper */}
                  <div className="absolute inset-0 flex sm:hidden flex-col items-center justify-center pointer-events-none bg-white/95 rounded-md z-10">
                    <p className="font-medium text-xl tracking-tighter text-ink">
                      Add shapes &amp; start building!
                    </p>
                    <p className="absolute top-20 right-2 text-sm tracking-tight text-muted text-right">
                      Reorder &amp; flip →
                    </p>
                    <p className="absolute bottom-2 left-8 inset-x-0 text-left text-sm tracking-tight leading-tight text-muted">
                      Select a shape <br />
                      &amp; Pick a color ↓
                    </p>
                  </div>
                  {/* Desktop empty-state helper */}
                  <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-center pointer-events-none bg-white/95 rounded-md z-10">
                    <p className="font-medium text-2xl tracking-tighter text-ink">
                      Add shapes &amp; start building!
                    </p>
                    <p className="absolute top-24 right-2 text-sm tracking-tight leading-tight text-muted text-right">
                      Piece list &amp; controls →
                    </p>
                    <p className="absolute bottom-2 left-8 inset-x-0 text-left text-sm tracking-tight leading-tight text-muted">
                      Select a shape <br />
                      &amp; Pick a color ↓
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right panel ── */}
          <div
            className={cn(
              "flex-shrink-0 flex flex-col min-h-0 border-l border-stroke transition-all duration-200",
              showList ? "sm:w-52" : "sm:w-fit",
            )}
          >
            {/* U2: Mobile — compact action column with large touch targets */}
            <div
              className="flex sm:hidden flex-col items-center gap-1 p-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Move piece up"
                disabled={
                  fixationSelected ||
                  !selectedElement ||
                  pieces.findIndex((p) => p.uid === selectedElement) <= 0
                }
                onClick={() => selectedElement && moveUp(selectedElement)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                aria-label="Move piece down"
                disabled={
                  fixationSelected ||
                  !selectedElement ||
                  pieces.findIndex((p) => p.uid === selectedElement) >=
                    pieces.length - 1
                }
                onClick={() => selectedElement && moveDown(selectedElement)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown size={18} />
              </button>
              <button
                type="button"
                aria-label="Flip shape"
                disabled={fixationSelected || !selectedElement}
                onClick={() => selectedElement && flipPiece(selectedElement)}
                className="p-3 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                aria-label="Remove piece"
                disabled={fixationSelected || !selectedElement}
                onClick={() => selectedElement && removeShape(selectedElement)}
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
                  {/* Fixation row — always visible, non-removable */}
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-stroke",
                      fixationSelected
                        ? "bg-lighter"
                        : "[@media(hover:hover)]:hover:bg-lighter",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(fixationSelected ? null : "fixation");
                    }}
                  >
                    <div
                      className="w-3 h-3 flex-shrink-0"
                      style={{
                        backgroundColor:
                          COLOR_MAP.get(fixationColorId)?.hex ?? "#E8E0CF",
                      }}
                    />
                    <p className="text-xs sm:text-sm flex-1 min-w-0 truncate">
                      {fixationMap.get(fixationId)?.name ?? fixationId}
                    </p>
                  </div>

                  {/* Shape pieces */}
                  {pieces.length === 0 ? (
                    <p className="absolute right-2 top-52 text-sm text-muted px-4 py-4">
                      Add shapes →
                    </p>
                  ) : (
                    pieces.map((piece, idx) => {
                      const shape = shapeMap.get(piece.shapeId);
                      const color = COLOR_MAP.get(piece.colorId);
                      const isSelected = selectedElement === piece.uid;
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
                            "flex items-center sm:gap-2 px-2 py-4 cursor-pointer transition-colors border-b-4",
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
                            setSelectedElement(isSelected ? null : piece.uid);
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
                            <GripVertical size={18} />
                          </div>
                          <p className="text-xs sm:text-sm flex-1 min-w-0 truncate">
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
                                <ChevronUp size={18} />
                              </button>
                              <button
                                type="button"
                                aria-label="Move piece down"
                                disabled={idx === pieces.length - 1}
                                onClick={() => moveDown(piece.uid)}
                                className="p-0.5 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronDown size={18} />
                              </button>
                              <button
                                type="button"
                                aria-label="Flip shape"
                                onClick={() => flipPiece(piece.uid)}
                                className="p-0.5 text-muted hover:text-ink transition-colors"
                              >
                                <RotateCcw size={15} />
                              </button>
                              <button
                                type="button"
                                aria-label="Remove piece"
                                onClick={() => removeShape(piece.uid)}
                                className="p-0.5 text-muted hover:text-error transition-colors"
                              >
                                <Trash2 size={15} />
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
              <p className="text-sm text-ink">
                This will replace your current build.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingPresetId(null)}
                  className="text-sm border border-stroke px-4 py-1.5 hover:border-ink transition-colors rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyPreset(pendingPresetId);
                    setPendingPresetId(null);
                  }}
                  className="text-sm bg-ink text-canvas px-4 py-1.5 hover:opacity-80 transition-opacity rounded-md"
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
              !selectedPiece &&
                !fixationSelected &&
                "opacity-30 pointer-events-none",
            )}
          >
            {TOTEM_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  applyColor(c.id);
                }}
                className={cn(
                  "w-7 h-7 transition-all",
                  activeColorId === c.id
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
        <div className="flex flex-col gap-4">
          {/* Tab bar */}
          <div className="flex gap-2 pb-px">
            {(["build", "presets"] as Mode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={cn(
                  "text-base tracking-tight py-1 px-3 border rounded-md transition-colors",
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
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-stroke" />
            <span className="text-sm tracking-tight text-muted px-2">
              Shapes
            </span>
            {/* <div className="flex-1 h-px bg-stroke" /> */}
          </div>
          {mode === "build" && (
            <div className="grid grid-cols-3 gap-1">
              {catalogLoading
                ? Array.from({ length: TOTEM_SHAPES.length }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-stroke aspect-square"
                    />
                  ))
                : catalogShapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      aria-label={`Add ${shape.name}`}
                      onClick={() => addShape(shape.id)}
                      className="group relative bg-canvas border border-stroke rounded-md hover:border-ink transition-colors text-left flex flex-col"
                    >
                      {/* image placeholder  */}
                      <div className="aspect-square w-full rounded-md transition-colors bg-lighter" />
                      {/* bottom label  */}
                      <div className="px-3 py-2.5 flex items-end justify-between gap-2 border-t border-stroke">
                        <div>
                          <p className="text-sm">{shape.name}</p>
                          <p className="text-xs text-muted">€{shape.price}</p>
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
                const presetPrice = presetPrices.get(preset.id) ?? 0;
                return (
                  <div
                    key={preset.id}
                    className="bg-white border border-stroke rounded-md flex flex-col gap-3 p-4"
                  >
                    <div>
                      <h3 className="font-bold tracking-tight text-lg">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
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
                      <p className="text-sm">€{presetPrice}</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (pieces.length > 0) {
                            setPendingPresetId(preset.id);
                          } else {
                            applyPreset(preset.id);
                          }
                        }}
                        className="text-sm border border-ink px-3 py-1.5 hover:bg-lighter transition-colors rounded-md"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Fixation catalog ── */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-stroke" />
            <span className="text-sm tracking-tight text-muted px-2">
              Fixation
            </span>
            {/* <div className="flex-1 h-px bg-stroke" /> */}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {catalogFixations.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFixationId(f.id)}
                className={cn(
                  "relative bg-canvas border transition-colors text-left p-3 rounded-md",
                  fixationId === f.id
                    ? "border-ink bg-lighter"
                    : "border-stroke hover:border-ink",
                )}
              >
                <p className="text-sm">{f.name}</p>
                <p className="text-xs text-muted">€{f.price}</p>
              </button>
            ))}
          </div>

          {/* ── Cable ── */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-stroke" />
            <span className="text-sm tracking-tight text-muted px-2">
              Cable
            </span>
            {/* <div className="flex-1 h-px bg-stroke" /> */}
          </div>
          <CustomSelect
            id="cable-select"
            value={(() => {
              const c = catalogCables.find((c) => c.id === cableId);
              return c ? `${c.name} — €${c.price}` : "";
            })()}
            onChange={(label) => {
              const cable = catalogCables.find(
                (c) => `${c.name} — €${c.price}` === label,
              );
              if (cable) setCableId(cable.id);
            }}
            options={catalogCables.map((c) => `${c.name} — €${c.price}`)}
          />
        </div>

        {/* ── Section C: Price + Add to Cart ── */}
        <div className="flex flex-col gap-6 border-t border-stroke pt-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-3xl font-semibold tracking-tighter text-ink">
                €{totalPrice}
              </p>
              <p className={`text-xs text-muted mt-0.5 transition-opacity ${pieces.length > 0 ? "opacity-100" : "opacity-0"}`}>
                {pieces.length} piece{pieces.length === 1 ? "" : "s"}
              </p>
            </div>
            {pieces.length === 0 ? (
              <Tooltip content="Add shapes to get started">
                <ArrowButton
                  label="Add to Cart"
                  disabled
                  className="w-fit px-8 py-2.5 bg-ink text-white text-base font-medium tracking-[-0.04em] rounded-md border border-ink flex justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </Tooltip>
            ) : (
              <ArrowButton
                label={isAdding ? "Adding to Cart…" : "Add to Cart"}
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-fit px-8 py-2.5 bg-ink text-white text-base font-medium tracking-[-0.04em] rounded-md border border-ink flex justify-center transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            )}
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-4 border-t border-stroke pt-6">
            <h2 className="text-3xl font-medium tracking-tighter text-ink">
              TOTEM - Modular Lamp
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              TOTEM is a modular lighting object built from stackable geometric
              forms. Each piece is cast in powder-coated aluminium and connects
              through a central cable — no tools, no hardware.
            </p>
            <p className="text-sm text-muted leading-relaxed">
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
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {label}
                  </p>
                  <p className="text-sm text-ink mt-0.5">{value}</p>
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
            className="fixed flex items-center gap-2 text-xs text-ink bg-white px-3 py-1.5 border border-stroke shadow-sm pointer-events-none"
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
            className="fixed z-50 pointer-events-none flex items-center gap-2 text-xs text-ink bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-stroke shadow-sm"
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
