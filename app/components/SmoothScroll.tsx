"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Momentum scrolling for mouse wheels and trackpads. Touch keeps native scrolling,
 * and prefers-reduced-motion disables it entirely. Scroll position stays native,
 * so the rAF + getBoundingClientRect readers keep working unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, anchors: { offset: 0 }, autoRaf: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
