"use client";

import { motion } from "framer-motion";
import { worldwide } from "../content";
import { EASE, FadeUp, MaskLines, RegMark, useReduce } from "./primitives";

// Abstract, unlabeled points on a stylised globe — no specific locations are claimed.
const POINTS: [number, number][] = [
  [470, 330], [640, 250], [760, 360], [900, 300], [1040, 420], [560, 470], [820, 520], [1130, 300],
];
const ROUTES: [number, number][] = [[4, 0], [4, 1], [4, 3], [4, 7], [4, 5], [4, 6], [2, 1]];

function arc([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.35;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
}

export default function Worldwide() {
  const reduce = useReduce();
  return (
    <section aria-labelledby="world-title" className="relative overflow-hidden bg-charcoal py-[16vh] text-cream">
      <div className="gutter relative z-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="label mb-8 flex items-center gap-3 text-cream/60">
            <RegMark className="h-3 w-3 text-copper" /> Sheet 06 — Delivery
          </p>
          <MaskLines id="world-title" lines={worldwide.title} className="display text-[clamp(56px,10vw,180px)]" />
        </div>
        <FadeUp className="self-end md:col-span-4 md:col-start-9">
          <p className="text-[17px] leading-relaxed text-cream/75">{worldwide.body}</p>
        </FadeUp>
      </div>

      <div className="relative mt-[6vh]">
        <svg viewBox="0 0 1600 800" className="h-auto w-full" role="img" aria-label="A stylised globe with thin routes carrying a package from one point to several destinations.">
          {/* fine world geometry */}
          <g fill="none" stroke="#F3EEE4" strokeOpacity="0.14" strokeWidth="0.8">
            <ellipse cx="800" cy="400" rx="380" ry="380" />
            {[80, 170, 260, 330].map((rx) => (
              <ellipse key={rx} cx="800" cy="400" rx={rx} ry="380" />
            ))}
            {[-280, -180, -80, 20, 120, 220, 300].map((dy) => {
              const y = 400 + dy;
              const half = Math.sqrt(Math.max(0, 380 * 380 - dy * dy));
              return <line key={dy} x1={800 - half} x2={800 + half} y1={y} y2={y} />;
            })}
          </g>
          {/* longitude ticks across the page */}
          <g stroke="#F3EEE4" strokeOpacity="0.08">
            {Array.from({ length: 33 }).map((_, k) => (
              <line key={k} x1={k * 50} x2={k * 50} y1="760" y2="780" />
            ))}
          </g>

          {ROUTES.map(([a, b], k) => {
            const d = arc(POINTS[a], POINTS[b]);
            return (
              <g key={k}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="#C88E68"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.9 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.8, delay: 0.3 + k * 0.18, ease: EASE }}
                />
                {!reduce && (
                  <motion.rect
                    width="12"
                    height="9"
                    x="-6"
                    y="-4.5"
                    rx="1"
                    fill="#F3EEE4"
                    style={{ offsetPath: `path('${d}')`, offsetRotate: "auto" }}
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    whileInView={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 4.5, delay: 1.2 + k * 0.6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                )}
              </g>
            );
          })}
          {POINTS.map(([x, y], k) => (
            <g key={k}>
              <circle cx={x} cy={y} r={k === 4 ? 5 : 3} fill={k === 4 ? "#C88E68" : "#F3EEE4"} />
              {k === 4 && <circle cx={x} cy={y} r="14" fill="none" stroke="#C88E68" strokeOpacity="0.6" />}
            </g>
          ))}
        </svg>

        <div className="gutter pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-end">
          <MaskLines lines={worldwide.message} as="p" className="display text-right text-[clamp(28px,4.4vw,72px)] text-cream" lineClassName="" />
        </div>
      </div>
    </section>
  );
}
