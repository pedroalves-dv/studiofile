export function DiscountInput() {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Discount Code</label>
      <input
        type="text"
        placeholder="Enter code"
        className="w-full border border-border rounded px-3 py-2"
      />
    </div>
  );
}
