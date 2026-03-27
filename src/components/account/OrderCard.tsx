import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatPrice } from '@/lib/utils/format'
import type { ShopifyOrder } from '@/lib/shopify/types'

type BadgeVariant = 'default' | 'sale' | 'soldOut' | 'new' | 'featured'

interface FulfillmentStatusInfo {
  label: string
  variant: BadgeVariant
}

const FULFILLMENT_STATUS_MAP: Record<string, FulfillmentStatusInfo> = {
  FULFILLED:           { label: 'Fulfilled',         variant: 'default' },
  UNFULFILLED:         { label: 'Processing',        variant: 'new' },
  PARTIALLY_FULFILLED: { label: 'Partially Shipped', variant: 'featured' },
  RESTOCKED:           { label: 'Refunded',          variant: 'soldOut' },
  PENDING_FULFILLMENT: { label: 'Pending',           variant: 'default' },
  OPEN:                { label: 'Open',              variant: 'new' },
  IN_PROGRESS:         { label: 'In Progress',       variant: 'featured' },
}

interface OrderCardProps {
  order: ShopifyOrder
}

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo: FulfillmentStatusInfo =
    FULFILLMENT_STATUS_MAP[order.fulfillmentStatus] ?? {
      label: order.fulfillmentStatus,
      variant: 'default',
    }

  return (
    <div className="border border-stroke p-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-ink">{order.name}</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <span className="text-sm text-muted">{formatDate(order.processedAt)}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">
          {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
        </span>
        <Link
          href={order.statusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label text-accent hover:text-ink transition-colors"
        >
          View order
        </Link>
      </div>
    </div>
  )
}
