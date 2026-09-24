"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { print } from "../content";
import { RegMark, useReduce } from "./primitives";
import { useProgress, PIN } from "./useProgress";

const W = 1200;
const H = 800;

/** Each layer arrives slightly out of register, then snaps into place — a press pass. */
function usePass(p: MotionValue<number>, a: number, b: number, dx: number, dy: number, reduce: boolean | null) {
  const opacity = useTransform(p, [a, a + (b - a) * 0.4], [0, 1]);
  const x = useTransform(p, [a, b], reduce ? [0, 0] : [dx, 0]);
  const y = useTransform(p, [a, b], reduce ? [0, 0] : [dy, 0]);
  return { opacity, x, y };
}

export default function PrintSpeaks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const p = useProgress(ref, PIN);

  const windows: [number, number][] = [
    [0.04, 0.18],
    [0.18, 0.32],
    [0.32, 0.46],
    [0.46, 0.6],
    [0.6, 0.74],
    [0.74, 0.9],
  ];
  const l1 = usePass(p, ...windows[0], -60, 30, reduce);
  const l2 = usePass(p, ...windows[1], 50, -40, reduce);
  const l3 = usePass(p, ...windows[2], -30, -50, reduce);
  const foil = usePass(p, ...windows[3], 0, 40, reduce);
  const emboss = useTransform(p, windows[4], [0, 1]);
  const trim = useTransform(p, windows[5], [0, 1]);
  const sheetRotate = useTransform(p, [0, 0.74, 0.95], reduce ? [0, 0, 0] : [-4, -1.5, 0]);
  const sheetY = useTransform(p, [0, 0.1], reduce ? ["0vh", "0vh"] : ["30vh", "0vh"]);
  const foilSweep = useTransform(p, [0.46, 1], ["-40%", "140%"]);
  const cropInset = useTransform(trim, [0, 1], ["inset(0% 0% 0% 0%)", "inset(6% 5% 6% 5%)"]);
  const marksOpacity = useTransform(trim, [0, 0.6], [1, 0]);

  const [stage, setStage] = useState(-1);
  useEffect(
    () =>
      p.on("change", (v) => {
        let s = -1;
        windows.forEach(([a], k) => v >= a && (s = k));
        setStage(s);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p],
  );

  return (
    <section aria-labelledby="print-title" className="relative bg-cream">
      <div ref={ref} className="relative" style={{ height: "340vh" }}>
        <div data-pinned className="sticky top-0 flex h-screen flex-col overflow-hidden md:flex-row">
          <div className="gutter relative z-10 flex flex-col justify-between pb-4 pt-24 md:w-[34%] md:py-[14vh]">
            <div>
              <p className="label mb-6 flex items-center gap-3 text-ink-2">
                <RegMark className="h-3 w-3" /> Sheet 04 — Print
              </p>
              <h2 id="print-title" className="display text-[clamp(44px,6.4vw,112px)] text-ink">
                {print.title}
              </h2>
              <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-ink-2 md:text-[17px]">{print.body}</p>
            </div>
            <ol className="mt-6 hidden gap-1 md:grid" aria-label="Print passes">
              {print.layers.map((l, k) => (
                <li
                  key={l}
                  className={`label flex items-center gap-3 border-b border-hair py-2 transition-colors duration-500 ${k === stage ? "text-ink" : k < stage ? "text-ink-2" : "text-muted/50"}`}
                >
                  <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${k <= stage ? "bg-copper" : "bg-ink/10"}`} />
                  {l}
                  {k === stage && <span className="ml-auto text-copper">Pass {k + 1}/6</span>}
                </li>
              ))}
            </ol>
            <p className="label mt-3 text-copper md:hidden">{stage >= 0 ? print.layers[stage] : "Blank sheet"}</p>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-8 md:px-10 md:pb-0">
            <motion.div
              style={{ rotate: sheetRotate, y: sheetY, clipPath: cropInset }}
              className="relative aspect-[3/2] w-full max-w-[1100px] bg-[#FAF6EE] shadow-[0_40px_80px_-40px_rgba(42,38,34,0.55)]"
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="A printed sheet being built up pass by pass: two ink layers, typography, copper foil and a blind emboss.">
                <defs>
                  <linearGradient id="foilG" x1="0" x2="1" y1="0" y2="0.3">
                    <stop offset="0" stopColor="#6E3F26" />
                    <stop offset="0.45" stopColor="#E8B98F" />
                    <stop offset="0.55" stopColor="#A66A46" />
                    <stop offset="1" stopColor="#5C3320" />
                  </linearGradient>
                  <filter id="embossF" x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b" />
                    <feSpecularLighting in="b" surfaceScale="3" specularConstant="0.7" specularExponent="18" lightingColor="#fff" result="s">
                      <feDistantLight azimuth="225" elevation="42" />
                    </feSpecularLighting>
                    <feComposite in="s" in2="SourceAlpha" operator="in" result="sIn" />
                    <feOffset in="b" dx="2" dy="3" result="o" />
                    <feComposite in="o" in2="SourceAlpha" operator="out" result="shadow" />
                    <feColorMatrix in="shadow" values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0.35 0" result="sh" />
                    <feMerge><feMergeNode in="sh" /><feMergeNode in="sIn" /></feMerge>
                  </filter>
                </defs>

                {/* Layer 1 — olive field */}
                <motion.g style={l1}>
                  <rect x="110" y="140" width="560" height="520" fill="#69705A" style={{ mixBlendMode: "multiply" }} />
                </motion.g>
                {/* Layer 2 — charcoal arc */}
                <motion.g style={l2}>
                  <path d="M420 660 A300 300 0 0 1 1020 660 Z" fill="#2A2622" opacity="0.92" style={{ mixBlendMode: "multiply" }} />
                  <circle cx="840" cy="250" r="90" fill="#B98060" style={{ mixBlendMode: "multiply" }} />
                </motion.g>
                {/* Layer 3 — typography */}
                <motion.g style={l3} fontFamily="var(--font-sans)" fontWeight="800" letterSpacing="-6">
                  <text x="150" y="330" fontSize="150" fill="#F6F1E6">WHERE</text>
                  <text x="150" y="470" fontSize="150" fill="#F6F1E6">IDEAS</text>
                  <text x="720" y="150" fontSize="14" letterSpacing="4" fontFamily="var(--font-mono)" fontWeight="400" fill="#171717">HANNAH PIXELS — EDITION 01</text>
                </motion.g>
                {/* Foil — copper hot foil stripe + mark */}
                <motion.g style={foil}>
                  <rect x="110" y="700" width="910" height="10" fill="url(#foilG)" />
                  <path d="M960 110 L1000 70 L1040 110 L1000 150Z" fill="url(#foilG)" />
                </motion.g>
                {/* Emboss — blind pattern revealed by light */}
                <motion.g style={{ opacity: emboss }} filter="url(#embossF)">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <path key={k} d={`M${760 + k * 50} 420 l20 -20 l20 20 l-20 20z`} fill="#F6F1E6" />
                  ))}
                </motion.g>
                {/* Printer's marks, cut away when trimmed */}
                <motion.g style={{ opacity: marksOpacity }} stroke="#171717" strokeWidth="1" fill="none">
                  {[[40, 40], [1160, 40], [40, 760], [1160, 760]].map(([x, y], k) => (
                    <g key={k}>
                      <circle cx={x} cy={y} r="9" />
                      <path d={`M${x - 16} ${y}H${x + 16}M${x} ${y - 16}V${y + 16}`} />
                    </g>
                  ))}
                  <g stroke="none">
                    {["#171717", "#69705A", "#A66A46", "#CFC5B2", "#2A2622"].map((c, k) => (
                      <rect key={c} x={500 + k * 34} y="760" width="30" height="16" fill={c} />
                    ))}
                  </g>
                </motion.g>
              </svg>
              {/* travelling light across the foil */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-[30%] mix-blend-soft-light"
                style={{ left: foilSweep, background: "linear-gradient(100deg, transparent, rgba(255,240,220,0.7), transparent)" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
