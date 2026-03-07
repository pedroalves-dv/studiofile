export function CartSummary() {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>$0.00</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>$0.00</span>
      </div>
    </div>
  );
}
