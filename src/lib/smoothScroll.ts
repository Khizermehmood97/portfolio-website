// Custom smooth-scroll with a controllable, slow-feeling easing curve.
// Native CSS `scroll-behavior: smooth` is fast and not configurable, so we
// animate window.scrollY ourselves via requestAnimationFrame.

// Offset to leave for the sticky navbar (h-16 = 4rem = 64px).
const NAV_OFFSET = 64

// easeInOutCubic — slow start, slow finish, smooth middle. Feels premium.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

let activeAnimation = 0

/** Smoothly scroll the window to an absolute Y position. */
export function smoothScrollToY(targetY: number, duration = 900) {
  // Cancel any in-flight scroll so a new click takes over cleanly.
  if (activeAnimation) cancelAnimationFrame(activeAnimation)

  // Respect users who prefer reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: targetY })
    return
  }

  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) {
      activeAnimation = requestAnimationFrame(step)
    } else {
      activeAnimation = 0
    }
  }

  activeAnimation = requestAnimationFrame(step)
}

/** Smoothly scroll a section (by element id) into view, accounting for the navbar. */
export function smoothScrollToId(id: string, duration = 900) {
  const el = document.getElementById(id)
  if (!el) return
  const targetY = window.scrollY + el.getBoundingClientRect().top - NAV_OFFSET
  smoothScrollToY(targetY, duration)
}
