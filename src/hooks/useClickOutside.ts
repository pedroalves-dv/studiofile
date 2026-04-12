import { useEffect, useRef, RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T> | RefObject<T>[],
  handler: () => void
) {
  // Store handler in a ref so the effect never re-runs due to handler identity changes.
  const handlerRef = useRef(handler)
  useEffect(() => { handlerRef.current = handler }, [handler])

  // Store refs in a ref so the effect doesn't re-run when the array identity changes.
  const refsRef = useRef<RefObject<T>[]>(Array.isArray(refs) ? refs : [refs])
  useEffect(() => {
    refsRef.current = Array.isArray(refs) ? refs : [refs]
  })

  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const isInside = refsRef.current.some(
        (r) => r.current?.contains(event.target as Node)
      )
      if (isInside) return
      handlerRef.current()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [])
}
