"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { process } from "../content";
import { EASE, MaskLines, SectionLabel, FadeUp } from "./primitives";
import { useProgress, PIN } from "./useProgress";

const BG = ["#F3EEE4", "#ECE5D5", "#E6DCC7", "#EFE9DC", "#2A2622", "#F3EEE4"];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress(ref, PIN);
  const [i, setI] = useState(0);
  const n = process.stages.length;
  useEffect(() => p.on("change", (v) => setI(Math.min(n - 1, Math.floor(v * n)))), [p, n]);
  const bar = useTransform(p, [0, 1], [0, 1]);
  const dark = i === 4;
  const s = process.stages[i];

  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-cream">
      <div className="gutter py-[16vh]">
        <SectionLabel className="mb-8">{process.label}</SectionLabel>
        <div className="grid gap-10 md:grid-cols-12">
          <MaskLines id="process-title" lines={process.title} className="display text-[clamp(52px,9vw,160px)] text-ink md:col-span-8" />
          <FadeUp className="self-end md:col-span-4">
            <p className="text-[17px] leading-relaxed text-ink-2">{process.body}</p>
          </FadeUp>
        </div>
      </div>

      <div ref={ref} className="relative" style={{ height: `${n * 65}vh` }}>
        <motion.div
          data-pinned
          className="sticky top-0 h-screen overflow-hidden"
          animate={{ backgroundColor: BG[i] }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className={`gutter relative grid h-full grid-rows-[auto_1fr_auto] pb-10 pt-24 md:grid-cols-12 md:grid-rows-1 md:items-center md:pb-0 md:pt-0 ${dark ? "text-cream" : "text-ink"}`}>
            {/* stage index */}
            <ol className="flex gap-3 md:col-span-1 md:flex-col md:gap-4" aria-label="Process stages">
              {process.stages.map((st, k) => (
                <li key={st.n} className={`label text-[10px] transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-35"}`} aria-current={k === i ? "step" : undefined}>
                  {st.n}
                </li>
              ))}
            </ol>

            <div className="relative self-center md:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <p className={`label mb-4 ${dark ? "text-copper" : "text-copper"}`}>Stage {s.n}</p>
                  <h3 className="display text-[clamp(48px,6.2vw,112px)]">{s.title}</h3>
                  <p className={`mt-6 max-w-[420px] text-[16px] leading-relaxed md:text-[18px] ${dark ? "text-cream/75" : "text-ink-2"}`}>{s.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="crop relative h-[38vh] self-center md:col-span-6 md:h-[64vh]">
              <AnimatePresence mode="sync">
                <motion.figure
                  key={i}
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <motion.img
                    src={STAGE_PHOTOS[i].src}
                    alt={STAGE_PHOTOS[i].alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: EASE }}
                  />
                  {/* Discover and Develop keep their pencil annotations over the paper */}
                  {i < 2 && (
                    <div className="absolute inset-0 p-[7%] opacity-80 mix-blend-multiply">
                      <StageVisual i={i} />
                    </div>
                  )}
                  <figcaption className="label absolute bottom-3 left-4 text-[10px] text-cream/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">
                    {process.stages[i].n} / {process.stages[i].title}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-current/10 md:hidden" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-current/10">
            <motion.div className="h-full origin-left bg-copper" style={{ scaleX: bar }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Real footage stills (from the hero's Flow shots) for each stage.
const STAGE_PHOTOS = [
  { src: "/img/story/process-discover.jpg", alt: "A pencil dieline with measurements on cream specialty paper" },
  { src: "/img/story/process-develop.jpg", alt: "A cream board blank folded up into a box structure" },
  { src: "/img/story/process-refine.jpg", alt: "Copper foil sheets, specialty papers and a finished box on the studio table" },
  { src: "/img/story/process-produce.jpg", alt: "A printed press sheet with registration marks, ink layers and a copper foil stripe" },
  { src: "/img/story/process-finish.jpg", alt: "Close-up of a copper foil line and blind-embossed mark on a soft-touch box" },
  { src: "/img/story/process-deliver.jpg", alt: "Finished packaging arranged as a still life by the studio window" },
];

const draw = (d = 0, dur = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: dur, delay: d, ease: EASE },
});

function StageVisual({ i }: { i: number }) {
  const ink = i === 4 ? "#F3EEE4" : "#171717";
  const box = { viewBox: "0 0 400 400", className: "h-full w-full", "aria-hidden": true } as const;

  switch (i) {
    case 0: // Discover — loose lines and brand fragments
      return (
        <svg {...box}>
          {[
            "M40 300 C120 200 160 320 240 220 S360 160 370 90",
            "M60 120 C140 150 180 60 260 110",
            "M120 360 C150 300 250 330 300 280",
          ].map((d, k) => (
            <motion.path key={k} d={d} fill="none" stroke={ink} strokeWidth="1" {...draw(k * 0.2, 2)} />
          ))}
          <motion.circle cx="250" cy="170" r="46" fill="none" stroke="#A66A46" strokeWidth="1" {...draw(0.5)} />
          {["Brand", "Product", "Purpose"].map((w, k) => (
            <motion.text key={w} x={70 + k * 100} y={70 + k * 110} fill={ink} fontSize="13" fontFamily="var(--font-mono)" letterSpacing="2"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.7, y: 0 }} transition={{ delay: 0.4 + k * 0.2, duration: 0.8 }}>
              {w.toUpperCase()}
            </motion.text>
          ))}
          <motion.path d="M200 40 v12 M194 46 h12" stroke="#A66A46" {...draw(1)} />
        </svg>
      );
    case 1: // Develop — structural geometry and dielines
      return (
        <svg {...box}>
          <motion.path d="M140 60 H260 V340 H140Z M40 140 H140 V260 H40Z M260 140 H360 V260 H260Z" fill="none" stroke={ink} strokeWidth="1" {...draw(0, 1.6)} />
          <motion.path d="M140 140 H260 M140 260 H260" fill="none" stroke="#A66A46" strokeDasharray="6 4" strokeWidth="1" {...draw(0.6)} />
          <motion.path d="M140 60 L160 36 H240 L260 60 M140 340 L160 364 H240 L260 340" fill="none" stroke={ink} strokeWidth="1" {...draw(0.9)} />
          <motion.text x="270" y="50" fontSize="10" fill={ink} fontFamily="var(--font-mono)" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.2 }}>120 × 280 MM</motion.text>
        </svg>
      );
    case 2: // Refine — material samples and paper textures
      return (
        <div className="relative h-full w-full">
          {[
            { c: "#E9DFCB", r: -8, x: "8%", y: "14%" },
            { c: "#CFC5B2", r: 4, x: "30%", y: "8%" },
            { c: "#69705A", r: -3, x: "50%", y: "22%" },
            { c: "#A66A46", r: 7, x: "22%", y: "42%" },
            { c: "#2A2622", r: -6, x: "56%", y: "48%" },
          ].map((s, k) => (
            <motion.div
              key={k}
              className="absolute h-[42%] w-[34%] shadow-[0_20px_40px_-24px_rgba(42,38,34,0.6)]"
              style={{ left: s.x, top: s.y, background: s.c }}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: s.r }}
              transition={{ duration: 1, delay: k * 0.1, ease: EASE }}
            >
              <span className="label absolute bottom-2 left-2 text-[9px] mix-blend-difference text-cream/80">Sample 0{k + 1}</span>
            </motion.div>
          ))}
        </div>
      );
    case 3: // Produce — registration marks and print layers
      return (
        <svg {...box}>
          {[
            { c: "#69705A", dx: -14, dy: 10 },
            { c: "#A66A46", dx: 12, dy: -8 },
            { c: "#171717", dx: 6, dy: 14 },
          ].map((l, k) => (
            <motion.rect key={k} x={90 + k * 30} y={90 + k * 26} width="170" height="170" fill={l.c} style={{ mixBlendMode: "multiply" }} opacity={0.8}
              initial={{ x: l.dx * 4, y: l.dy * 4, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 0.8 }} transition={{ duration: 1.2, delay: k * 0.25, ease: EASE }} />
          ))}
          {[[40, 40], [360, 40], [40, 360], [360, 360]].map(([x, y], k) => (
            <motion.g key={k} {...draw(0.2 + k * 0.1, 0.8)}>
              <circle cx={x} cy={y} r="10" fill="none" stroke={ink} />
              <path d={`M${x - 18} ${y}H${x + 18}M${x} ${y - 18}V${y + 18}`} stroke={ink} />
            </motion.g>
          ))}
        </svg>
      );
    case 4: // Finish — foil, embossing, construction details
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <motion.div
            className="relative flex aspect-square w-[70%] items-center justify-center bg-[#3A342E]"
            initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {/* the Hannah Pixels monogram, hot-foiled: a copper gradient seen through the mark */}
            <span
              role="img"
              aria-label="Hannah Pixels monogram in copper foil"
              className="block aspect-square w-[46%]"
              style={{
                background: "linear-gradient(110deg,#6E3F26 10%,#E6B58C 40%,#A66A46 55%,#F2CFAE 70%,#6E3F26 90%)",
                backgroundSize: "200% 100%",
                animation: "foil 6s ease-in-out infinite alternate",
                WebkitMaskImage: "url(/brand/mark-white.png)",
                maskImage: "url(/brand/mark-white.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <span className="absolute inset-6 border border-[#F3EEE4]/15" style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.08), inset -1px -1px 0 rgba(0,0,0,0.4)" }} />
          </motion.div>
        </div>
      );
    default: // Deliver — packaging moving into a worldwide route
      return (
        <svg {...box}>
          <motion.ellipse cx="200" cy="200" rx="170" ry="170" fill="none" stroke={ink} strokeOpacity="0.25" {...draw(0, 1.2)} />
          {[60, 120].map((rx) => (
            <motion.ellipse key={rx} cx="200" cy="200" rx={rx} ry="170" fill="none" stroke={ink} strokeOpacity="0.15" {...draw(0.2)} />
          ))}
          <motion.path id="route" d="M90 250 Q200 80 320 180" fill="none" stroke="#A66A46" strokeWidth="1.2" strokeDasharray="4 4" {...draw(0.4, 1.4)} />
          <motion.rect width="18" height="14" x="-9" y="-7" fill="#171717"
            initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2.4, delay: 0.8, ease: EASE }}
            style={{ offsetPath: "path('M90 250 Q200 80 320 180')", offsetRotate: "auto" }} />
          <circle cx="90" cy="250" r="4" fill="#171717" />
          <circle cx="320" cy="180" r="4" fill="#A66A46" />
        </svg>
      );
  }
}
