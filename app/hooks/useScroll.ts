import { useEffect, useState } from "react";

/**
 * Tracks whether the page has been scrolled past `threshold`.
 *
 * The listener is passive and rAF-throttled, so a fast scroll can't queue
 * a state update per event, and it's always removed on unmount — the
 * previous version re-registered it on every render and never cleaned up.
 */
const useScroll = (threshold = 8) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > threshold);
      });
    };

    // Catch the case where the page loads already scrolled (deep link,
    // browser restore) instead of waiting for the first scroll event.
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return { scrolled };
};

export default useScroll;
