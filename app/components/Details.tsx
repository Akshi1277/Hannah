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

/** A photographic close-up that settles into place when it enters view. */
function PhotoTile({
  src,
  alt,
  label,
  title,
  className,
  snap = false,
  children,
}: {
  src: string;
  alt: string;
  label: string;
  title: string;
  className?: string;
  snap?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduce = useReduce();
  return (
    <Tile label={label} title={title} className={className}>
      <div ref={ref} className="absolute inset-0 overflow-hidden">
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          initial={false}
          animate={{ scale: inView || reduce ? 1 : 1.12, y: inView || reduce ? 0 : snap ? -18 : 0 }}
          transition={
            snap && !reduce
              ? { type: "spring", stiffness: 520, damping: 14, mass: 0.7, delay: 0.15 } // the magnetic "snap"
              : { duration: 1.6, ease: EASE }
          }
        />
        {children}
      </div>
    </Tile>
  );
}

/** Premium wrapping: a corner of wrapping paper folds over the board and closes as it scrolls into view. */
function FoldCorner({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReduce();
  const closed = inView || reduce;
  return (
    <Tile label="Wrapped board" title="Premium wrapping" className={className}>
      <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ perspective: 900 }}>
        {/* shadow on the table */}
        <div className="absolute h-8 w-56 translate-y-28 rounded-[50%] bg-charcoal/20 blur-md" />
        {/* the wrapped board: stone-grey soft-touch paper with a copper foil line */}
        <div
          className="relative h-48 w-56 shadow-[0_28px_40px_-26px_rgba(42,38,34,0.7)]"
          style={{ background: "linear-gradient(145deg, #C4B9A6 0%, #AFA391 60%, #A29684 100%)" }}
        >
          <div className="absolute inset-0 opacity-40 mix-blend-multiply [background-image:radial-gradient(rgba(60,50,40,0.25)_0.6px,transparent_0.7px)] [background-size:4px_4px]" />
          <span className="absolute left-0 right-0 top-[38%] h-[3px]" style={{ background: "linear-gradient(90deg,#8A5234,#E0AD83,#A66A46)" }} />
          <span className="absolute left-5 top-5 h-6 w-6 border border-[#9C907E] shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(0,0,0,0.12)]" />
          {/* the corner of wrapping paper, hinged on its diagonal, folding over the edge */}
          <motion.div
            className="absolute right-0 top-0 h-20 w-20"
            style={{ transformOrigin: "0% 0%", clipPath: "polygon(0 0, 100% 0, 100% 100%)", background: "linear-gradient(225deg,#D2C8B6 0%,#B8AC99 70%)" }}
            initial={false}
            animate={{ rotateY: closed ? 0 : -165, rotateX: closed ? 0 : 18 }}
            transition={{ duration: 1.5, ease: EASE, delay: closed ? 0.2 : 0 }}
          />
          {/* crease shadow appears once the fold is down */}
          <motion.span
            className="absolute right-0 top-0 h-20 w-20"
            style={{ clipPath: "polygon(0 0, 100% 100%, 98% 100%, 0 2%)", background: "rgba(40,32,24,0.35)" }}
            initial={false}
            animate={{ opacity: closed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: closed ? 1.2 : 0 }}
          />
        </div>
      </div>
    </Tile>
  );
}

/** Magnetic closure: the lid lifts, then snaps shut onto the copper magnet when seen. */
function MagneticBox({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const reduce = useReduce();
  const shut = inView || reduce;
  return (
    <Tile label="Bespoke construction" title="Magnetic closure" className={className}>
      <div ref={ref} className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-36 w-60">
          {/* table shadow tightens when the lid lands */}
          <motion.div
            className="absolute -bottom-4 left-1/2 h-6 w-56 -translate-x-1/2 rounded-[50%] bg-charcoal/25 blur-md"
            initial={false}
            animate={{ scaleX: shut ? 1 : 0.9, opacity: shut ? 1 : 0.6 }}
            transition={{ duration: 0.4, delay: shut ? 0.35 : 0 }}
          />
          {/* base with the copper magnet at the front */}
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(180deg,#A99D8A,#978B78)" }} />
          {/* lid: soft-touch wrap, copper foil line, blind emboss */}
          <motion.div
            className="absolute inset-x-0 bottom-[70px] h-16"
            style={{ transformOrigin: "0% 100%", background: "linear-gradient(180deg,#CFC5B3,#BCB09D)" }}
            initial={false}
            animate={shut ? { y: 0, rotate: 0 } : { y: -54, rotate: -9 }}
            transition={
              reduce ? { duration: 0 } : shut ? { type: "spring", stiffness: 700, damping: 15, mass: 0.6, delay: 0.3 } : { duration: 0.6, ease: EASE }
            }
          >
            <span className="absolute inset-x-0 top-5 h-[3px]" style={{ background: "linear-gradient(90deg,#8A5234,#E6B58C,#A66A46)" }} />
            <span className="absolute left-1/2 top-9 h-4 w-8 -translate-x-1/2 border border-[#A89C89] shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),inset_-1px_-1px_0_rgba(0,0,0,0.12)]" />
            {/* copper magnet on the lid's front edge, landing on the base */}
            <span className="absolute -bottom-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_-2px_3px_rgba(0,0,0,0.2)]" style={{ background: "radial-gradient(circle at 35% 30%,#F2C9A6,#B87550 70%)" }} />
          </motion.div>
        </div>
      </div>
    </Tile>
  );
}

/** A die-cut edge travelling through with scroll, over the dieline it was cut from. */
function DieCut({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress(ref, THROUGH);
  const x = useTransform(p, [0, 1], ["10%", "-40%"]);
  const edge = `M0 120 ${Array.from({ length: 20 }).map((_, k) => `Q${k * 60 + 30} ${k % 2 ? 60 : 180} ${k * 60 + 60} 120`).join(" ")}`;
  return (
    <PhotoTile
      className={className}
      src="/img/story/detail-diecut.jpg"
      alt="A pencil dieline with measurements and a knife-cut edge on specialty paper"
      title="Die-cut shapes"
      label="Custom die-cut"
    >
      <div ref={ref} className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        <motion.svg style={{ x }} viewBox="0 0 1200 300" className="absolute bottom-0 h-40 w-[260%]" aria-hidden="true">
          <path d={`${edge} V300 H0Z`} fill="#F3EEE4" />
          <path d={edge} fill="none" stroke="#A66A46" strokeWidth="1.2" strokeDasharray="6 4" />
        </motion.svg>
      </div>
    </PhotoTile>
  );
}
