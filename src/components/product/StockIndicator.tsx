interface StockIndicatorProps {
  availableForSale: boolean;
  quantityAvailable: number | null; // null = inventory tracking disabled = treat as unlimited
}

export function StockIndicator({
  availableForSale,
  quantityAvailable,
}: StockIndicatorProps) {
  if (!availableForSale) {
    return (
      <div className="flex items-center gap-1 sm:gap-2border border-error rounded-full px-1 py-0.5 sm:px-2 sm:py-1 w-fit">
        <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
        <span className="text-label text-error">Out of stock</span>
      </div>
    );
  }

  if (
    quantityAvailable !== null &&
    quantityAvailable <= 5 &&
    quantityAvailable > 0
  ) {
    return (
      <div className="flex items-center gap-1 sm:gap-2 border border-accent rounded-full px-2 py-1 w-fit">
        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
        <span className="text-label text-accent">
          Only {quantityAvailable} left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 border border-success rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit">
      <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
      <span className="text-label text-success">In stock</span>
    </div>
  );
}
