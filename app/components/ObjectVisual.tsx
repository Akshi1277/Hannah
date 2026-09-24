"use client";

import { motion, type Transition } from "framer-motion";
import type { CapabilityKind } from "../content";
import { EASE, useReduce } from "./primitives";

const INK = "#171717";
const STONE = "#CFC5B2";
const CREAM = "#F3EEE4";
const CREAM2 = "#E6DDCB";
const COPPER = "#A66A46";
const OLIVE = "#69705A";

const t = (d = 0, dur = 1.1): Transition => ({ duration: dur, ease: EASE, delay: d });

/** Abstract, art-directed object studies for each capability. `on` plays the transformation. */
export default function ObjectVisual({ kind, on = true }: { kind: CapabilityKind; on?: boolean }) {
  const reduce = useReduce();
  const s = reduce ? true : on;
  const common = { viewBox: "0 0 200 200", className: "h-full w-full overflow-visible", "aria-hidden": true } as const;

  switch (kind) {
    case "rigid":
      return (
        <svg {...common}>
          <Shadow />
          {/* base */}
          <path d="M40 110 L100 140 L160 110 L160 150 L100 180 L40 150Z" fill={STONE} stroke={INK} strokeWidth="0.8" />
          <path d="M100 140 L100 180" stroke={INK} strokeWidth="0.8" />
          <path d="M40 110 L100 80 L160 110 L100 140Z" fill={CREAM2} stroke={INK} strokeWidth="0.8" />
          {/* tissue */}
          <motion.path d="M58 110 Q80 96 100 104 T142 108" stroke={COPPER} strokeWidth="0.8" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: s ? 1 : 0 }} transition={t(0.35)} />
          {/* lid, hinged at the back edge */}
          <motion.g style={{ transformOrigin: "100px 80px", transformBox: "view-box" }}
            initial={{ rotate: 0, y: 0 }} animate={s ? { rotate: -16, y: -34 } : { rotate: 0, y: 0 }} transition={t(0.1, 1.3)}>
            <path d="M36 106 L100 74 L164 106 L100 138Z" fill={CREAM} stroke={INK} strokeWidth="0.8" />
            <path d="M36 106 L100 138 L164 106 L164 114 L100 146 L36 114Z" fill={STONE} stroke={INK} strokeWidth="0.8" />
            <path d="M84 104 L100 96 L116 104 L100 112Z" fill="none" stroke={COPPER} strokeWidth="0.9" />
          </motion.g>
        </svg>
      );

    case "carton":
      return (
        <svg {...common}>
          <Shadow />
          {/* flat net */}
          <motion.g initial={{ opacity: 1 }} animate={{ opacity: s ? 0.25 : 1 }} transition={t(0.6)}>
            <motion.path
              d="M20 70 H60 V130 H20Z M60 70 H110 V130 H60Z M110 70 H150 V130 H110Z M150 70 H190 V130 H150Z M60 70 L68 50 H102 L110 70 M60 130 L68 150 H102 L110 130"
              fill="none" stroke={INK} strokeWidth="0.8" strokeDasharray="3 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(0, 1.2)} />
          </motion.g>
          {/* formed carton */}
          <motion.g initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={s ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.9 }}
            transition={t(0.7, 1)} style={{ transformOrigin: "105px 110px" }}>
            <path d="M75 60 L110 75 L110 160 L75 145Z" fill={CREAM2} stroke={INK} strokeWidth="0.8" />
            <path d="M110 75 L140 60 L140 145 L110 160Z" fill={STONE} stroke={INK} strokeWidth="0.8" />
            <path d="M75 60 L105 45 L140 60 L110 75Z" fill={CREAM} stroke={INK} strokeWidth="0.8" />
            <path d="M84 100 L100 107" stroke={OLIVE} strokeWidth="3" />
          </motion.g>
        </svg>
      );

    case "fragrance":
      return (
        <svg {...common}>
          <Shadow />
          <defs>
            <linearGradient id="sheen" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="fr-front"><path d="M70 40 H120 V170 H70Z" /></clipPath>
          </defs>
          <motion.g style={{ transformOrigin: "100px 110px" }}
            animate={s && !reduce ? { scaleX: [1, 0.82, 1] } : { scaleX: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M70 40 H120 V170 H70Z" fill={CREAM} stroke={INK} strokeWidth="0.8" />
            <path d="M120 40 L140 30 V160 L120 170Z" fill={STONE} stroke={INK} strokeWidth="0.8" />
            <path d="M70 40 L90 30 H140 L120 40Z" fill={CREAM2} stroke={INK} strokeWidth="0.8" />
            <path d="M80 120 H110" stroke={COPPER} strokeWidth="1.2" />
            <path d="M88 128 H102" stroke={COPPER} strokeWidth="0.8" />
            <g clipPath="url(#fr-front)">
              <motion.rect y="30" width="30" height="150" fill="url(#sheen)"
                initial={{ x: 40 }} animate={s ? { x: [40, 130] } : { x: 40 }}
                transition={{ duration: 2.4, repeat: s && !reduce ? Infinity : 0, repeatDelay: 1.2, ease: "easeInOut" }} />
            </g>
          </motion.g>
        </svg>
      );

    case "confection":
      return (
        <svg {...common}>
          <Shadow />
          <path d="M40 90 H160 V160 H40Z" fill={STONE} stroke={INK} strokeWidth="0.8" />
          <path d="M48 98 H152 V152 H48Z" fill={CREAM2} stroke={INK} strokeWidth="0.5" />
          {[0, 1, 2, 3].map((c) =>
            [0, 1].map((r) => (
              <motion.circle key={`${c}${r}`} cx={65 + c * 23} cy={113 + r * 24} r="8"
                fill={r === 0 ? "#5A4636" : "#7A5A44"} stroke={INK} strokeWidth="0.4"
                initial={{ scale: 0.4, opacity: 0 }} animate={s ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
                transition={t(0.5 + (c + r * 4) * 0.05, 0.7)} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            )),
          )}
          <motion.g initial={{ y: 0 }} animate={{ y: s ? -62 : 0 }} transition={t(0.1, 1.2)}>
            <path d="M36 84 H164 V100 H36Z" fill={CREAM} stroke={INK} strokeWidth="0.8" />
            <path d="M92 84 V100 M108 84 V100" stroke={COPPER} strokeWidth="1.4" />
          </motion.g>
        </svg>
      );

    case "bag":
      return (
        <svg {...common}>
          <Shadow />
          <motion.path
            fill={CREAM2} stroke={INK} strokeWidth="0.8"
            initial={{ d: "M30 90 H170 V170 H30Z" }}
            animate={{ d: s ? "M60 70 H140 L146 170 H54Z" : "M30 90 H170 V170 H30Z" }}
            transition={t(0.1, 1.2)} />
          <motion.path
            fill={STONE} stroke={INK} strokeWidth="0.8"
            initial={{ d: "M170 90 H170 V170 H170Z", opacity: 0 }}
            animate={s ? { d: "M140 70 L162 62 L166 160 L146 170Z", opacity: 1 } : { d: "M170 90 H170 V170 H170Z", opacity: 0 }}
            transition={t(0.3, 1.1)} />
          <motion.path d="M82 70 C82 40 118 40 118 70" fill="none" stroke={COPPER} strokeWidth="1.4"
            initial={{ pathLength: 0 }} animate={{ pathLength: s ? 1 : 0 }} transition={t(0.9, 0.8)} />
          <motion.path d="M60 70 L100 82 L140 70" fill="none" stroke={INK} strokeWidth="0.5" strokeDasharray="2 2"
            initial={{ opacity: 0 }} animate={{ opacity: s ? 1 : 0 }} transition={t(0.8)} />
        </svg>
      );

    case "book":
      return (
        <svg {...common}>
          <Shadow />
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.path key={i}
              d={`M50 ${150 - i * 5} L110 ${165 - i * 5} L160 ${145 - i * 5} L100 ${130 - i * 5}Z`}
              fill={i % 2 ? CREAM : CREAM2} stroke={INK} strokeWidth="0.5"
              initial={{ y: -60, opacity: 0 }} animate={s ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }}
              transition={t(i * 0.09, 0.8)} />
          ))}
          <motion.g initial={{ y: -50, opacity: 0 }} animate={s ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }} transition={t(0.8, 0.9)}>
            <path d="M46 112 L110 128 L164 106 L100 90Z" fill="#2A2622" stroke={INK} strokeWidth="0.6" />
            <path d="M92 104 L118 110" stroke={COPPER} strokeWidth="1.2" />
          </motion.g>
        </svg>
      );
  }
}

function Shadow() {
  return <ellipse cx="102" cy="176" rx="72" ry="8" fill="#2A2622" opacity="0.1" />;
}
