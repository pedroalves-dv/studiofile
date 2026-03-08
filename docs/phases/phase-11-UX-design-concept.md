### Animation 5 — Hero image parallax

In the Hero component on the home page:

```ts
const imageRef = useRef<HTMLDivElement>(null)  // ref on the image container div, not <img>

useGSAP(() => {
  if (prefersReducedMotion()) return
  if (!imageRef.current) return

  gsap.to(imageRef.current, {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: imageRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}, { scope: imageRef })
```

The image container must have `overflow: hidden` on its parent so the parallax movement
doesn't overflow. The `next/image` inside should use `fill` layout.

---