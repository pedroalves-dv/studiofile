'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  calcTotemPrice,
  type TotemPiece,
} from '@/lib/totem-config';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils/cn';

export function TotemConfigurator() {
  const { addBundle } = useCart();

  const [pieces, setPieces] = useState<TotemPiece[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [fixationId, setFixationId] = useState(TOTEM_FIXATIONS[0].id);
  const [cableId, setCableId] = useState(TOTEM_CABLES[0].id);
  const [isAdding, setIsAdding] = useState(false);

  function addShape(shapeId: string) {
    const uid = Math.random().toString(36).slice(2, 10);
    setPieces((prev) => [...prev, { uid, shapeId, colorId: 'chalk' }]);
  }

  function removeShape(uid: string) {
    setPieces((prev) => prev.filter((p) => p.uid !== uid));
    if (selectedUid === uid) setSelectedUid(null);
  }

  function setColorForPiece(uid: string, colorId: string) {
    setPieces((prev) => prev.map((p) => (p.uid === uid ? { ...p, colorId } : p)));
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

  async function handleAddToCart() {
    if (pieces.length === 0 || isAdding) return;
    setIsAdding(true);
    await addBundle({ pieces, fixationId, cableId });
    setIsAdding(false);
  }

  const totalPrice = calcTotemPrice({ pieces, fixationId, cableId });
  const fixationName = TOTEM_FIXATIONS.find((f) => f.id === fixationId)?.name ?? fixationId;
  const cableName = TOTEM_CABLES.find((c) => c.id === cableId)?.name ?? cableId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
      {/* ─── Left pane — the stack ─── */}
      <div className="flex flex-col gap-6">
        {/* Heading */}
        <div className="flex items-baseline gap-3">
          <h1 className="font-display uppercase text-2xl tracking-display">Your lamp</h1>
          {pieces.length > 0 && (
            <span className="font-mono text-sm text-muted">
              {pieces.length} piece{pieces.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {/* Stack */}
        <div className="flex flex-col">
          {pieces.length === 0 ? (
            <div className="border border-stroke py-12 flex items-center justify-center">
              <p className="font-mono text-sm text-muted">Add shapes from the right →</p>
            </div>
          ) : (
            pieces.map((piece, idx) => {
              const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
              const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
              const isSelected = selectedUid === piece.uid;

              return (
                <div key={piece.uid}>
                  {/* Piece row */}
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 border border-stroke cursor-pointer -mt-px transition-colors',
                      isSelected ? 'ring-1 ring-ink border-ink z-10 relative' : 'hover:border-ink'
                    )}
                    onClick={() => setSelectedUid(isSelected ? null : piece.uid)}
                  >
                    {/* Color swatch */}
                    <span
                      className="w-4 h-4 shrink-0 border border-stroke/50"
                      style={{ backgroundColor: color?.hex ?? '#F2F0EB' }}
                    />

                    {/* Shape info */}
                    <span className="font-mono text-sm flex-1 truncate">
                      {shape?.name ?? piece.shapeId}
                    </span>
                    <span className="font-mono text-xs text-muted shrink-0">
                      €{shape?.price ?? 0}
                    </span>

                    {/* Reorder + remove */}
                    <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        aria-label="Move piece up"
                        disabled={idx === 0}
                        onClick={() => moveUp(piece.uid)}
                        className="p-0.5 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move piece down"
                        disabled={idx === pieces.length - 1}
                        onClick={() => moveDown(piece.uid)}
                        className="p-0.5 text-muted hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove piece"
                        onClick={() => removeShape(piece.uid)}
                        className="p-0.5 text-muted hover:text-error transition-colors ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Color picker — shown inline under selected piece */}
                  {isSelected && (
                    <div
                      className="border border-t-0 border-ink px-3 py-3 bg-canvas"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {TOTEM_COLORS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            aria-label={c.name}
                            onClick={() => setColorForPiece(piece.uid, c.id)}
                            className={cn(
                              'w-7 h-7 transition-all',
                              piece.colorId === c.id ? 'ring-1 ring-ink ring-offset-1' : 'ring-1 ring-transparent hover:ring-stroke'
                            )}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* System selectors */}
        <div className="flex flex-col gap-4 pt-2 border-t border-stroke">
          <div className="flex flex-col gap-1.5">
            <label className="text-label text-muted">Fixation</label>
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
            <label className="text-label text-muted">Cable</label>
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

        {/* Price + Add to Cart */}
        <div className="flex flex-col gap-3 pt-2 border-t border-stroke">
          <div>
            <p className="font-mono text-2xl text-ink">€{totalPrice}</p>
            <p className="text-label text-muted mt-1">
              {pieces.length} piece{pieces.length === 1 ? '' : 's'} · {fixationName} · {cableName}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={pieces.length === 0 || isAdding}
            className="w-full bg-ink text-canvas font-mono text-sm py-3 px-6 transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* ─── Right pane — shape catalog ─── */}
      <div className="flex flex-col gap-6">
        <h2 className="font-display uppercase text-2xl tracking-display">Add shapes</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-stroke">
          {TOTEM_SHAPES.map((shape) => (
            <button
              key={shape.id}
              type="button"
              aria-label={`Add ${shape.name}`}
              onClick={() => addShape(shape.id)}
              className="group relative bg-canvas border border-stroke hover:border-ink transition-colors text-left flex flex-col"
            >
              {/* Visual placeholder */}
              <div className="aspect-square w-full bg-stone-100 group-hover:bg-stone-200 transition-colors" />

              {/* Info */}
              <div className="px-3 py-2.5 flex items-end justify-between gap-2">
                <div>
                  <p className="font-mono text-sm uppercase">{shape.name}</p>
                  <p className="font-mono text-xs text-muted">€{shape.price}</p>
                </div>
                <Plus
                  size={14}
                  className="shrink-0 text-muted group-hover:text-ink transition-colors mb-0.5"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
