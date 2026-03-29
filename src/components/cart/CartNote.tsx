"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export function CartNote() {
  const { cart, updateNote } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState(cart?.note ?? "");

  useEffect(() => {
    setNote(cart?.note ?? "");
  }, [cart?.note]);

  return (
    <div>
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-1 text-base text-muted hover:text-ink transition-colors"
      >
        Add order note
        <ChevronDown
          size={14}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => updateNote(note)}
            placeholder="Special instructions, or delivery notes..."
            aria-label="Order note"
            maxLength={500}
            rows={3}
            className="w-full border border-stroke px-3 py-2 text-base bg-canvas resize-none focus:outline-none focus:border-ink transition-colors rounded-md"
          />
          <p className="text-base text-muted mt-1 text-right">
            {note.length}/500
          </p>
        </div>
      )}
    </div>
  );
}
