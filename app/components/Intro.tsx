"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { intro } from "../content";
import { FadeUp, RegMark, useReduce } from "./primitives";
import { useProgress, ENTER, THROUGH } from "./useProgress";

/**
 * The hero hands over here: a sheet of paper folds down flat over the studio,
 * and the typography is printed onto it.
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduce();
  const enter = useProgress(ref, ENTER);
  const through = useProgress(ref, THROUGH);

  const flap = useTransform(enter, [0, 0.75], reduce ? [0, 0] : [-58, 0]);
  const shade = useTransform(enter, [0, 0.75], [0.35, 0]);
  const r = reduce ? 0 : 1;
  const driftX = [
    useTransform(through, [0, 1], [`${-3 * r}vw`, `${4 * r}vw`]),
    useTransform(through, [0, 1], [`${6 * r}vw`, `${-3 * r}vw`]),
    useTransform(through, [0, 1], [`${-2 * r}vw`, `${5 * r}vw`]),
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="intro-title"
      className="relative z-10 -mt-px overflow-hidden"
      style={{ perspective: "1600px" }}
    >
      <motion.div
        style={{ rotateX: flap, transformOrigin: "50% 100%" }}
        className="relative h-[18vh] bg-cream"
        aria-hidden="true"
      >
        <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-transparent" />
        <Crease />
      </motion.div>

      <div className="relative bg-cream pb-[14vh] pt-[6vh]">
        <div className="gutter">
          <div className="label mb-12 flex justify-between text-muted">
            <span>Sheet 01 — Idea</span>
            <span className="hidden md:inline">Dieline ref. HP / 001</span>
          </div>

          <h2 id="intro-title" className="display text-[clamp(44px,12.5vw,240px)] text-ink">
            {intro.words.map((w, i) => (
              <motion.span
                key={w}
                style={{ x: driftX[i] }}
                className={`block ${i === 1 ? "pl-[18vw] text-copper" : i === 2 ? "pl-[6vw]" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h2>

          <div className="mt-[10vh] grid gap-10 md:grid-cols-12">
            <FadeUp className="md:col-span-5 md:col-start-2">
              <p className="display text-[clamp(28px,3.6vw,56px)] text-ink">{intro.second}</p>
            </FadeUp>
            <FadeUp delay={0.15} className="md:col-span-4 md:col-start-8 md:pt-3">
              <p className="text-[17px] leading-relaxed text-ink-2 md:text-[19px]">{intro.body}</p>
              <div className="mt-8 flex items-center gap-3 text-muted">
                <RegMark className="h-3 w-3" />
                <span className="h-px flex-1 bg-line" />
                <span className="label">Fold here</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function Crease() {
  return (
    <svg className="absolute inset-x-0 bottom-0 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true">
      <path d="M0 9.5H100" stroke="#A66A46" strokeWidth="0.3" strokeDasharray="1.2 0.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
