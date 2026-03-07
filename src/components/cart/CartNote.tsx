export function CartNote() {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Order Note</label>
      <textarea
        placeholder="Add a note to your order..."
        className="w-full border border-border rounded px-3 py-2 resize-none"
        rows={3}
      />
    </div>
  );
}
