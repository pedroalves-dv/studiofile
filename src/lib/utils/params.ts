export interface ProductFilter {
  available?: boolean
  productType?: string
  tag?: string
}

export const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  PRICE_ASC:    { sortKey: 'PRICE',        reverse: false },
  PRICE_DESC:   { sortKey: 'PRICE',        reverse: true  },
  BEST_SELLING: { sortKey: 'BEST_SELLING', reverse: false },
  CREATED_AT:   { sortKey: 'CREATED_AT',   reverse: true  },
  TITLE:        { sortKey: 'TITLE',        reverse: false },
}

export function parseFilters(filterParams: string | string[] | undefined): ProductFilter[] {
  const params = Array.isArray(filterParams) ? filterParams
    : filterParams ? [filterParams] : []
  return params
    .map((f): ProductFilter => {
      if (f === 'available')     return { available: true }
      if (f.startsWith('type:')) return { productType: f.slice(5) }
      if (f.startsWith('tag:'))  return { tag: f.slice(4) }
      return {}
    })
    .filter(f => Object.keys(f).length > 0)
}
