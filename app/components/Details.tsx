"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import { details } from "../content";
import { EASE, MaskLines, RegMark, useReduce } from "./primitives";
import { useProgress, THROUGH } from "./useProgress";

export default function Details() {
  return (
    <section aria-labelledby="details-title" className="relative overflow-hidden bg-cream py-[16vh]">
      <div className="gutter">
        <p className="label mb-8 flex items-center gap-3 text-ink-2">
          <RegMark className="h-3 w-3" /> Sheet 05 — Finish
        </p>
        <MaskLines id="details-title" lines={details.title} className="display text-[clamp(48px,8vw,140px)] text-ink" />
      </div>

      <Marquee />

      <div className="gutter mt-[10vh] grid gap-5 md:grid-cols-12 md:gap-6">
        <FoilWord className="md:col-span-7" />
        <EmbossTile className="md:col-span-5" />
        <FoldCorner className="md:col-span-4" />
        <MagneticBox className="md:col-span-4" />
        <DieCut className="md:col-span-4" />
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...details.list, ...details.list];
  return (
    <div className="mt-[8vh] overflow-hidden border-y border-hair py-5" aria-label={details.list.join(", ")}>
      <div className="marquee flex w-max gap-10" aria-hidden="true">
        {row.map((d, k) => (
          <span key={k} className="flex items-center gap-10 whitespace-nowrap text-[clamp(22px,2.6vw,40px)] font-semibold uppercase tracking-[-0.02em] text-ink">
            {d}
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-copper"><path d="M10 0 L20 10 L10 20 L0 10Z" fill="none" stroke="currentColor" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function Tile({ label, title, children, className = "" }: { label: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`group relative flex min-h-[320px] flex-col overflow-hidden bg-cream-2 md:min-h-[420px] ${className}`}>
      <div className="relative flex-1">{children}</div>
      <figcaption className="flex items-baseline justify-between gap-4 border-t border-hair px-5 py-4">
        <span className="text-[15px] font-semibold uppercase tracking-[-0.01em] text-ink">{title}</span>
        <span className="label text-[10px] text-muted">{label}</span>
      </figcaption>
    </figure>
  );
}

/** A foil word that catches the cursor as a light source. */
function FoilWord({ className }: { className?: string }) {
  const [pos, setPos] = useState({ x: 30, y: 40 });
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <Tile label="Hot foil" title="Foiling" className={className}>
      <div onPointerMove={move} data-cursor className="absolute inset-0 flex items-center justify-center bg-[#2F2A25]">
        <span
          className="display select-none text-[clamp(64px,12vw,200px)]"
          style={{
            backgroundImage: `radial-gradient(35% 60% at ${pos.x}% ${pos.y}%, #FFE9D2 0%, #E4AE83 22%, rgba(166,106,70,0.9) 45%, #5C3320 80%), linear-gradient(110deg, #6E3F26, #A66A46 50%, #6E3F26)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            transition: "background-image 0.1s",
          }}
        >
          Foil
        </span>
      </div>
    </Tile>
  );
}

/** An embossed surface revealed only by the direction of light. */
function EmbossTile({ className }: { className?: string }) {
  const [a, setA] = useState({ x: -3, y: -3 });
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setA({ x: -nx * 8, y: -ny * 8 });
  };
  const sh = `${a.x}px ${a.y}px 3px rgba(80,62,44,0.35), ${-a.x}px ${-a.y}px 2px rgba(255,255,255,0.9)`;
  return (
    <Tile label="Blind emboss" title="Embossing & debossing" className={className}>
      <div onPointerMove={move} onPointerLeave={() => setA({ x: -3, y: -3 })} data-cursor className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#ECE3D0]">
        <span className="display select-none text-[clamp(56px,8vw,130px)] text-[#ECE3D0]" style={{ textShadow: sh }}>Raised</span>
        <span className="display select-none text-[clamp(40px,5vw,80px)] text-[#E3D8C2]" style={{ textShadow: `${-a.x * 0.6}px ${-a.y * 0.6}px 2px rgba(80,62,44,0.3), ${a.x * 0.6}px ${a.y * 0.6}px 2px rgba(255,255,255,0.8)` }}>Pressed</span>
      </div>
    </Tile>
  );
}

/** A folded corner closes as it scrolls into view. */
function FoldCorner({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  return (
    <Tile label="Premium wrapping" title="Folded corner" className={className}>
      <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ perspective: 800 }}>
        <div className="relative h-44 w-44 bg-[#CFC5B2] shadow-[0_24px_40px_-24px_rgba(42,38,34,0.6)]">
          <div className="absolute inset-3 border border-ink/10" />
          <motion.div
            className="absolute right-0 top-0 h-20 w-20 origin-bottom-left bg-[#B7AB94]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)", transformOrigin: "0% 0%" }}
            initial={false}
            animate={{ rotateY: inView ? 0 : -150, rotateX: inView ? 0 : 20 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <motion.div
            className="absolute right-0 top-0 h-20 w-20 bg-cream-2"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            initial={false}
            animate={{ opacity: inView ? 0 : 1 }}
            transition={{ duration: 0.4, delay: inView ? 0.6 : 0 }}
          />
        </div>
      </div>
    </Tile>
  );
}

/** A magnetic lid that snaps shut when seen. */
function MagneticBox({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const reduce = useReduce();
  return (
    <Tile label="Magnetic closure" title="Bespoke construction" className={className}>
      <div ref={ref} className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-32 w-48">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#3A342E]" />
          <div className="absolute inset-x-3 bottom-[88px] h-2 bg-[#2A2622]" />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-24 origin-top bg-[#4A423A] shadow-[0_-1px_0_rgba(255,255,255,0.08)_inset]"
            initial={false}
            animate={inView ? { y: 0, rotate: 0 } : { y: -58, rotate: -8 }}
            transition={reduce ? { duration: 0 } : inView ? { type: "spring", stiffness: 700, damping: 16, mass: 0.6, delay: 0.3 } : { duration: 0.6 }}
            style={{ transformOrigin: "0% 0%" }}
          >
            <span className="absolute left-1/2 top-3 h-px w-12 -translate-x-1/2 bg-copper" />
          </motion.div>
        </div>
      </div>
    </Tile>
  );
}

/** A die-cut edge travelling through with scroll. */
function DieCut({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useProgress(ref, THROUGH);
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-40%"]);
  return (
    <Tile label="Custom die-cut" title="Die-cut shapes" className={className}>
      <div ref={ref} className="absolute inset-0 overflow-hidden">
        <motion.svg style={{ x }} viewBox="0 0 1200 300" className="absolute top-1/2 h-40 w-[260%] -translate-y-1/2" aria-hidden="true">
          <path
            d={`M0 120 ${Array.from({ length: 20 }).map((_, k) => `Q${k * 60 + 30} ${k % 2 ? 60 : 180} ${k * 60 + 60} 120`).join(" ")} V300 H0Z`}
            fill="#E1D5BD"
          />
          <path
            d={`M0 120 ${Array.from({ length: 20 }).map((_, k) => `Q${k * 60 + 30} ${k % 2 ? 60 : 180} ${k * 60 + 60} 120`).join(" ")}`}
            fill="none" stroke="#A66A46" strokeWidth="1.2" strokeDasharray="6 4"
          />
        </motion.svg>
      </div>
    </Tile>
  );
}
