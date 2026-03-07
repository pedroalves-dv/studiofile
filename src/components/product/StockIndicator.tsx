interface StockIndicatorProps {
  availableForSale: boolean;
  quantityAvailable: number;
}

export function StockIndicator({ availableForSale, quantityAvailable }: StockIndicatorProps) {
  if (!availableForSale) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
        <span className="text-label text-error">Out of stock</span>
      </div>
    );
  }

  if (quantityAvailable <= 5) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
        <span className="text-label text-accent">Only {quantityAvailable} left</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
      <span className="text-label text-success">In stock</span>
    </div>
  );
}
