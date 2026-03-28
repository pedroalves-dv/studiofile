"use client";

import { useState, useCallback } from "react";
import {
  Minus,
  Plus,
  ShieldCheck,
  RotateCcw,
  PackageCheck,
} from "lucide-react";
import type {
  ShopifyProduct,
  ShopifyProductVariant,
} from "@/lib/shopify/types";
import { formatPrice, isOnSale, getDiscountPercent } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StockIndicator } from "./StockIndicator";
import { VariantSelector } from "./VariantSelector";
import { useCart } from "@/hooks/useCart";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

interface ProductInfoPanelProps {
  product: ShopifyProduct;
  collectionHandle?: string;
  collectionTitle?: string;
}

function getFirstTwoSentences(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(" ").trim();
}

export function ProductInfoPanel({
  product,
  collectionHandle,
  collectionTitle,
}: ProductInfoPanelProps) {
  const firstAvailableVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
    firstAvailableVariant,
  );
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();

  const price = selectedVariant.price;
  const compareAtPrice = selectedVariant.compareAtPrice;
  const onSale = compareAtPrice ? isOnSale(price, compareAtPrice) : false;
  const discountPercent =
    onSale && compareAtPrice ? getDiscountPercent(price, compareAtPrice) : 0;

  // null = inventory tracking disabled = treat as no upper limit
  const maxQty = selectedVariant.quantityAvailable ?? 999;

  const handleVariantChange = useCallback((variant: ShopifyProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(maxQty, q + 1));

  const handleAddToCart = async () => {
    if (!selectedVariant.availableForSale) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const shortDescription = getFirstTwoSentences(product.description);
  const hasMoreDescription =
    product.description.length > shortDescription.length + 10;

  const breadcrumbItems = [
    ...(collectionHandle && collectionTitle
      ? [
          { label: "Collections", href: "/collections" },
          { label: collectionTitle, href: `/collections/${collectionHandle}` },
        ]
      : [{ label: "Shop", href: "/shop" }]),
    { label: product.title },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Product type */}
      {product.productType && (
        <span className="text-label text-muted">{product.productType}</span>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl leading-tight tracking-tight">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-4">
        <span className="text-2xl text-ink">
          {formatPrice(price.amount, price.currencyCode)}
        </span>
        {onSale && compareAtPrice && (
          <>
            <span className="text-base text-muted line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
            <Badge variant="sale">−{discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Stock indicator */}
      <StockIndicator
        availableForSale={selectedVariant.availableForSale}
        quantityAvailable={selectedVariant.quantityAvailable}
      />

      {/* Short description */}
      {product.description && (
        <div className="text-sm text-ink/80 leading-relaxed">
          <p>
            {descriptionExpanded || !hasMoreDescription
              ? product.description
              : shortDescription}
          </p>
          {hasMoreDescription && (
            <button
              onClick={() => setDescriptionExpanded((v) => !v)}
              className="mt-2 text-label text-muted hover:text-ink transition-colors underline"
            >
              {descriptionExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* Variant selector */}
      <VariantSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onVariantChange={handleVariantChange}
      />

      {/* Quantity stepper */}
      {selectedVariant.availableForSale && (
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted">Quantity</span>
          <div className="flex items-center border border-border w-fit">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="px-4 py-3 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-5 py-3 text-sm min-w-[3rem] text-center border-x border-border">
              {quantity}
            </span>
            <button
              onClick={increaseQty}
              disabled={quantity >= maxQty}
              aria-label="Increase quantity"
              className="px-4 py-3 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add to cart + wishlist */}
      <div className="flex gap-3 mt-2">
        <Button
          variant="primary"
          size="lg"
          isLoading={isAdding}
          disabled={!selectedVariant.availableForSale || isAdding}
          onClick={handleAddToCart}
          className="flex-1"
        >
          {selectedVariant.availableForSale ? "Add to cart" : "Out of stock"}
        </Button>
        <WishlistButton productHandle={product.handle} />
      </div>

      {/* Custom order note */}
      <p className="text-label text-muted border-l-2 border-accent pl-3">
        All pieces are printed to order. Estimated dispatch: 5–7 business days.
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-5 pt-2 border-t border-border">
        <div className="flex items-center gap-2 text-label text-muted">
          <RotateCcw size={14} className="text-muted" />
          Free returns
        </div>
        <div className="flex items-center gap-2 text-label text-muted">
          <ShieldCheck size={14} className="text-muted" />
          Secure checkout
        </div>
        <div className="flex items-center gap-2 text-label text-muted">
          <PackageCheck size={14} className="text-muted" />
          Made to order
        </div>
      </div>
    </div>
  );
}
