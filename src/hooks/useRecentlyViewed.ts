const MAX_ITEMS = 6
const STORAGE_KEY = 'sf-recently-viewed'

export function useRecentlyViewed() {
  // Read handles from localStorage
  const getHandles = (): string[] => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
    catch { return [] }
  }

  const addProduct = (handle: string) => {
    const current = getHandles()
    const updated = [handle, ...current.filter(h => h !== handle)].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { addProduct, getHandles }
}
