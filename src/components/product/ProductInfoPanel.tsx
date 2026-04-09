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
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Badge } from "@/components/ui/Badge";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
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
  const [isAdding, setIsAdding] = useState(false);

  const specs = product.tags
    .filter((tag) => tag.includes(":"))
    .map((tag) => {
      const i = tag.indexOf(":");
      return { key: tag.slice(0, i).trim(), value: tag.slice(i + 1).trim() };
    });

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
    <div className="flex flex-col gap-3">
      {/* Breadcrumb */}
      {/* <Breadcrumb items={breadcrumbItems} /> */}

      {/* Product type */}
      {product.productType && (
        <span className="text-label text-muted">{product.productType}</span>
      )}

      {/* Title */}
      <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] sm:leading-[0.9] leading-[4rem]">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-start gap-4">
        <span className="text-4xl tracking-tight text-ink">
          {formatPrice(price.amount, price.currencyCode)}
        </span>
        {onSale && compareAtPrice && (
          <>
            <span className="text-sm text-muted line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
            <Badge variant="sale">−{discountPercent}%</Badge>
          </>
        )}
        {/* Stock indicator */}
        <StockIndicator
          availableForSale={selectedVariant.availableForSale}
          quantityAvailable={selectedVariant.quantityAvailable}
        />
      </div>

      {/* Short description teaser */}
      <span className="text-lg text-muted">Description</span>
      {product.description && (
        <p className="text-sm text-light leading-none">
          {getFirstTwoSentences(product.description)}
        </p>
      )}

      {/* Variant selector */}
      <VariantSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onVariantChange={handleVariantChange}
      />

      {/* Quantity stepper + wishlist */}
      {selectedVariant.availableForSale && (
        <div className="flex flex-col gap-2">
          <span className="text-lg text-muted">Quantity</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-stroke w-fit">
                <button
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="px-4 py-3 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-5 py-3 text-sm min-w-[3.5rem] text-center border-x border-stroke">
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

              {quantity > 1 && (
                <p className="text-4xl text-light tracking-[-0.02em]">
                  {/* {quantity} × {formatPrice(price.amount, price.currencyCode)}{" "}
                &middot;{" "} */}
                  <span className="text-light">
                    {formatPrice(
                      (parseFloat(price.amount) * quantity).toFixed(2),
                      price.currencyCode,
                    )}
                  </span>{" "}
                  total
                </p>
              )}
            </div>
            <WishlistButton
              productHandle={product.handle}
              iconSize={38}
              strokeWidth={1}
            />
          </div>
        </div>
      )}

      {/* Add to cart + trust badges */}
      <div className="flex flex-col gap-3 my-2">
        <ArrowButton
          label={
            selectedVariant.availableForSale ? "Add to cart" : "Out of stock"
          }
          isLoading={isAdding}
          disabled={!selectedVariant.availableForSale || isAdding}
          onClick={handleAddToCart}
          className="w-full py-3 bg-white text-ink text-lg font-medium tracking-tight rounded-md border border-ink disabled:opacity-50"
        />
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-base text-muted">
            <RotateCcw size={14} className="text-muted" />
            Free returns
          </div>
          <div className="flex items-center gap-2 text-base text-muted">
            <ShieldCheck size={14} className="text-muted" />
            Secure checkout
          </div>
          <div className="flex items-center gap-2 text-base text-muted">
            <PackageCheck size={14} className="text-muted" />
            Made to order
          </div>
        </div>
      </div>

      {/* Accordion — Description, Specs, Materials, Care */}
      <AccordionRoot
        type="multiple"
        className="border border-stroke rounded-md"
      >
        <AccordionItem value="description" className="border-b border-stroke">
          <AccordionTrigger className="p-4 text-lg text-ink">
            Description
          </AccordionTrigger>
          <AccordionContent>
            {product.descriptionHtml ? (
              <div
                className="p-4 text-base text-muted leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="p-4 text-sm text-muted">
                No description available.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="specifications"
          className="border-b border-stroke"
        >
          <AccordionTrigger className="p-4 text-lg text-ink">
            Specifications
          </AccordionTrigger>
          <AccordionContent>
            {specs.length > 0 ? (
              <dl className="p-4 divide-y divide-stroke">
                {specs.map(({ key, value }) => (
                  <div key={key} className="flex justify-between py-2 gap-4">
                    <dt className="text-label text-muted capitalize">{key}</dt>
                    <dd className="text-xs text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="p-4 text-base text-muted">
                Specifications will be added soon.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="materials" className="border-b border-stroke">
          <AccordionTrigger className="p-4 text-lg text-ink">
            Materials
          </AccordionTrigger>
          <AccordionContent>
            <p className="p-4 text-base text-muted leading-relaxed">
              All Studiofile pieces are printed in PLA+ using professional FDM
              printers. Materials may vary by colorway.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="care" className="">
          <AccordionTrigger className="p-4 text-lg text-ink">
            Care & Assembly
          </AccordionTrigger>
          <AccordionContent>
            <p className="p-4 text-base text-muted leading-relaxed">
              Handle with care. Wipe clean with a dry cloth. Assembly
              instructions are included with your order.
            </p>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  );
}
