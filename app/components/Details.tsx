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

function FoldCorner({ className }: { className?: string }) {
  return (
    <PhotoTile
      className={className}
      src="/img/story/detail-wrap.jpg"
      alt="Soft-touch paper being wrapped around a rigid box, corners folding into place"
      title="Premium wrapping"
      label="Wrapped board"
    />
  );
}

function MagneticBox({ className }: { className?: string }) {
  return (
    <PhotoTile
      className={className}
      src="/img/story/detail-magnetic.jpg"
      alt="Close-up of a copper magnetic closure and copper foil line on a stone-grey box"
      title="Magnetic closure"
      label="Bespoke construction"
      snap
    />
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
