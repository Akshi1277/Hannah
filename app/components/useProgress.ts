"use client";

import { useEffect, type RefObject } from "react";
import { cancelFrame, frame, useMotionValue, type MotionValue } from "framer-motion";

/**
 * Scroll progress of a section, measured with getBoundingClientRect inside one
 * shared requestAnimationFrame loop (no scroll listeners, no scroll timelines).
 * The loop runs in framer's "read" phase, which comes before its style writes in
 * the same frame, so measuring never forces an extra layout.
 *
 * `offset` mirrors framer's syntax as numbers: [[targetA, viewportA], [targetB, viewportB]].
 * progress = 0 when (targetA of the element) meets (viewportA of the viewport), 1 at B.
 *   "start start" → "end end"  = [[0, 0], [1, 1]]
 *   "start end"   → "start start" = [[0, 1], [0, 0]]
 *   "start end"   → "end start"   = [[0, 1], [1, 0]]
 */
export type Offset = [[number, number], [number, number]];

export const PIN: Offset = [[0, 0], [1, 1]];
export const ENTER: Offset = [[0, 1], [0, 0]];
export const THROUGH: Offset = [[0, 1], [1, 0]];

type Sub = { el: () => Element | null; offset: Offset; mv: MotionValue<number> };
const subs = new Set<Sub>();
let running = false;

function measure(s: Sub) {
  const el = s.el();
  if (!el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const [[tA, vA], [tB, vB]] = s.offset;
  const a = vA * vh - tA * r.height; // element top at progress 0
  const b = vB * vh - tB * r.height; // element top at progress 1
  const p = a === b ? 0 : (a - r.top) / (a - b);
  const clamped = Math.max(0, Math.min(1, p));
  if (clamped !== s.mv.get()) s.mv.set(clamped);
}

function loop() {
  subs.forEach(measure);
}

export function useProgress(ref: RefObject<Element | null>, offset: Offset = PIN): MotionValue<number> {
  const mv = useMotionValue(0);
  useEffect(() => {
    const s: Sub = { el: () => ref.current, offset, mv };
    subs.add(s);
    measure(s);
    if (!running) {
      frame.read(loop, true); // keep-alive: runs every animation frame
      running = true;
    }
    return () => {
      subs.delete(s);
      if (!subs.size) {
        cancelFrame(loop);
        running = false;
      }
    };
    // offset is a static literal per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mv]);
  return mv;
}

/** Window scrollY as a motion value, from the same loop. */
export function useScrollY(): MotionValue<number> {
  const mv = useMotionValue(0);
  useEffect(() => {
    const tick = () => {
      if (window.scrollY !== mv.get()) mv.set(window.scrollY);
    };
    frame.read(tick, true);
    return () => cancelFrame(tick);
  }, [mv]);
  return mv;
}
