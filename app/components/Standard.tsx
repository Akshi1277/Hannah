"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { standard } from "../content";
import { EASE, MaskLines, SectionLabel } from "./primitives";
import { useProgress, PIN } from "./useProgress";

const THEMES = [
  { bg: "#F3EEE4", fg: "#171717", accent: "#A66A46", sub: "#5F5A51" },
  { bg: "#E4D6C3", fg: "#171717", accent: "#8A5234", sub: "#5F5A51" },
  { bg: "#2A2622", fg: "#F3EEE4", accent: "#C88E68", sub: "rgba(243,238,228,0.7)" },
  { bg: "#DCDDD0", fg: "#1F2119", accent: "#69705A", sub: "#4E5243" },
];

export default function Standard() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress(ref, PIN);
  const n = standard.principles.length;
  const [i, setI] = useState(0);
  useEffect(() => p.on("change", (v) => setI(Math.min(n - 1, Math.floor(v * n)))), [p, n]);
  const s = standard.principles[i];
  const t = THEMES[i];

  return (
    <section aria-labelledby="standard-title" className="relative bg-cream">
      <div className="gutter py-[16vh]">
        <SectionLabel className="mb-8">{standard.label}</SectionLabel>
        <MaskLines id="standard-title" lines={standard.title} className="display text-[clamp(48px,8vw,140px)] text-ink" />
      </div>

      <div ref={ref} style={{ height: `${n * 100}vh` }} className="relative">
        <motion.div
          className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden"
          animate={{ backgroundColor: t.bg, color: t.fg }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Backdrop i={i} color={t.accent} />

          <div className="gutter relative flex items-center justify-between pt-24 md:pt-28">
            <p className="label" style={{ color: t.sub }}>Principle {s.n} / 0{n}</p>
            <div className="flex gap-2" aria-hidden="true">
              {standard.principles.map((x, k) => (
                <span key={x.n} className="h-px w-8 transition-colors duration-500" style={{ background: k <= i ? t.accent : "currentColor", opacity: k <= i ? 1 : 0.2 }} />
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={s.word}
                aria-hidden="true"
                className="display flex whitespace-nowrap text-[clamp(40px,13.5vw,260px)]"
                exit={{ opacity: 0, y: -40, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {s.word.split("").map((ch, k) => (
                  <span key={k} className="inline-block overflow-hidden">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.9, ease: EASE, delay: k * 0.035 }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="gutter relative grid gap-4 pb-24 md:grid-cols-12 md:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.n}
                className="md:col-span-5 md:col-start-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              >
                <h3 className="text-[22px] font-bold uppercase tracking-[-0.02em] md:text-[28px]">
                  <span className="label mr-3 align-middle" style={{ color: t.accent }}>{s.n}</span>
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[440px] text-[16px] leading-relaxed" style={{ color: t.sub }}>{s.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* accessible list of all principles */}
          <ol className="sr-only">
            {standard.principles.map((x) => (
              <li key={x.n}>{x.title} {x.body}</li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

/** Supporting visual for each principle: structure lines, material grain, a precision grid, a closed box outline. */
function Backdrop({ i, color }: { i: number; color: string }) {
  return (
    <AnimatePresence>
      <motion.svg
        key={i}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
      >
        {i === 0 && (
          <motion.path
            d="M200 700 L500 200 H1100 L1400 700 Z M500 200 V700 M1100 200 V700"
            fill="none" stroke={color} strokeWidth="1" strokeDasharray="8 6" opacity="0.35"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: EASE }}
          />
        )}
        {i === 1 &&
          Array.from({ length: 40 }).map((_, k) => (
            <motion.path
              key={k}
              d={`M0 ${k * 24 + 10} Q400 ${k * 24 - 20 + (k % 3) * 20} 800 ${k * 24 + 10} T1600 ${k * 24}`}
              fill="none" stroke={color} strokeWidth="0.6" opacity="0.18"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: k * 0.01 }}
            />
          ))}
        {i === 2 && (
          <g stroke={color} strokeWidth="0.6" opacity="0.35">
            {Array.from({ length: 17 }).map((_, k) => (
              <motion.line key={`v${k}`} x1={k * 100} x2={k * 100} y1="0" y2="900" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: k * 0.03 }} />
            ))}
            {Array.from({ length: 10 }).map((_, k) => (
              <motion.line key={`h${k}`} x1="0" x2="1600" y1={k * 100} y2={k * 100} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: k * 0.03 }} />
            ))}
            <circle cx="800" cy="450" r="14" fill="none" strokeWidth="1" />
          </g>
        )}
        {i === 3 && (
          <motion.path
            d="M560 520 L800 640 L1040 520 L1040 300 L800 180 L560 300 Z M560 300 L800 420 L1040 300 M800 420 V640"
            fill="none" stroke={color} strokeWidth="1.2" opacity="0.4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: EASE }}
          />
        )}
      </motion.svg>
    </AnimatePresence>
  );
}
