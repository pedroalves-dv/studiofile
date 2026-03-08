'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils/format';

export function DiscountInput() {
  const { cart, applyDiscount, removeDiscount } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeCode = cart?.discountCodes.find((d) => d.applicable);

  const savings = cart?.lines.reduce((total, line) => {
    const lineDiscount = line.discountAllocations.reduce((sum, da) => {
      return sum + parseFloat(da.allocatedAmount.amount);
    }, 0);
    return total + lineDiscount;
  }, 0) ?? 0;

  const currencyCode = cart?.cost.subtotalAmount.currencyCode ?? 'EUR';

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    await applyDiscount(code.trim());
    setIsLoading(false);
    setCode('');
    setIsExpanded(false);
  };

  if (activeCode) {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-success/10 border border-success/30">
        <div>
          <p className="text-label text-success">{activeCode.code}</p>
          {savings > 0 && (
            <p className="text-xs text-success mt-0.5">
              -{formatPrice(savings.toString(), currencyCode)} saved
            </p>
          )}
        </div>
        <button
          onClick={() => removeDiscount()}
          aria-label="Remove discount code"
          className="text-muted hover:text-ink transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center gap-1 text-label text-muted hover:text-ink transition-colors"
      >
        Have a discount code?
        <ChevronDown
          size={14}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter code"
            className="flex-1 border border-border px-3 py-1.5 text-sm bg-canvas focus:outline-none focus:border-ink transition-colors"
          />
          <button
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="px-3 py-1.5 text-label bg-ink text-canvas disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? '...' : 'Apply'}
          </button>
        </div>
      )}
    </div>
  );
}
