// Product info panel with title, price, variant selector, add to cart, and accordion for description/specs/etc.
"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, RotateCcw, PackageCheck } from "lucide-react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
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
  // const [isAdding, setIsAdding] = useState(false);

  const specs = product.tags
    .filter((tag) => tag.includes(":"))
    .map((tag) => {
      const i = tag.indexOf(":");
      return { key: tag.slice(0, i).trim(), value: tag.slice(i + 1).trim() };
    });

  const { addItem, getItemQuantity, isLoading: cartLoading } = useCart();

  const price = selectedVariant.price;
  const compareAtPrice = selectedVariant.compareAtPrice;
  const onSale = compareAtPrice ? isOnSale(price, compareAtPrice) : false;
  const discountPercent =
    onSale && compareAtPrice ? getDiscountPercent(price, compareAtPrice) : 0;

  // Fix 4: Subtract what's already in the cart from the available stock so the
  // stepper can't let the user order more than Shopify will accept.
  const inCartQty = getItemQuantity(selectedVariant.id);
  const maxQty = Math.max(
    0,
    (selectedVariant.quantityAvailable ?? 999) - inCartQty,
  );

  const handleVariantChange = useCallback((variant: ShopifyProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  const handleAddToCart = async () => {
    if (!selectedVariant.availableForSale) return;
    await addItem(selectedVariant.id, quantity);
    setQuantity(1);
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
      <div className="flex items-start gap-4 py-2">
        <span className="text-4xl tracking-tighter text-ink translate-y-[-3px]">
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
        <p className="text-base text-light leading-none">
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
          <div className="flex items-center gap-3">
            <span className="text-lg text-muted">Quantity</span>
            {inCartQty > 0 && (
              <span className="text-sm text-muted">{inCartQty} in cart</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={Math.max(1, maxQty)}
                size="md"
              />

              {quantity > 1 && (
                <p className="text-4xl text-light tracking-tighter">
                  {/* {quantity} × {formatPrice(price.amount, price.currencyCode)}{" "}
                &middot;{" "} */}
                  <span className="text-light">
                    {formatPrice(
                      (parseFloat(price.amount) * quantity).toFixed(2),
                      price.currencyCode,
                    )}
                  </span>{" "}
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
            !selectedVariant.availableForSale
              ? "Out of stock"
              : maxQty === 0
                ? "Max quantity in cart"
                : "Add to cart"
          }
          isLoading={cartLoading}
          disabled={
            !selectedVariant.availableForSale || cartLoading || maxQty === 0
          }
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
        className="border border-stroke rounded-lg bg-canvas tracking-tight"
      >
        <AccordionItem
          value="description"
          className="border-b border-stroke last:border-b-0"
        >
          <AccordionTrigger className="px-4 pt-4">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-4">
              Description
            </p>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            {product.descriptionHtml ? (
              <div
                className="text-lg text-ink tracking-[-0.03em] leading-tight p-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight p-4">
                No description available.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="specifications"
          className="border-b border-stroke last:border-b-0"
        >
          <AccordionTrigger className="px-4 pt-4">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-4">
              Specifications
            </p>
          </AccordionTrigger>
          <AccordionContent className="p-2">
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
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight p-4">
                Specifications will be added soon.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="materials"
          className="border-b border-stroke last:border-b-0"
        >
          <AccordionTrigger className="px-4 pt-4">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-4">
              Materials
            </p>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight p-4">
              All Studiofile pieces are printed in PLA+ using professional FDM
              printers. Materials may vary by colorway.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="care"
          className="border-b border-stroke last:border-b-0"
        >
          <AccordionTrigger className="px-4 pt-4">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-4">
              Care & Assembly
            </p>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight p-4">
              Handle with care. Wipe clean with a dry cloth. Assembly
              instructions are included with your order.
            </p>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  );
}
