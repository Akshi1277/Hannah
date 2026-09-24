'use client'

import { useEffect, useRef, useState } from "react";
import { cancelFrame, frame, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { brand, contactHref, cta, hero } from "../content";
import { CtaButton, EASE, RegMark } from "./primitives";

/** Must equal the number of JPEGs in /public/frames (verified on disk after extraction). */
export const FRAME_COUNT = 365;

const frameSrc = (i: number, small: boolean) =>
  `/${small ? "frames-sm" : "frames"}/frame_${String(i + 1).padStart(4, "0")}.jpg`;

/** Coarse-to-fine load order so the whole sequence becomes scrubbable quickly. */
function loadOrder(n: number): number[] {
  const seen = new Uint8Array(n);
  const order: number[] = [];
  for (let step = 32; step >= 1; step = step >> 1) {
    for (let i = 0; i < n; i += step) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  if (!seen[n - 1]) order.push(n - 1);
  return order;
}

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smoothed hero progress, written by the rAF loop below. The canvas and every
  // text beat read the same value, so image and typography never drift apart.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    const loaded = new Uint8Array(FRAME_COUNT);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let smooth = -1; // eased progress; -1 = not initialised
    let wantedIndex = 0;
    let currentIndex = -1; // last frame actually painted from a loaded image
    let standInIndex = -1; // nearest loaded frame shown while the wanted one is in flight
    let painted = false;
    let w = 0;
    let h = 0;

    const paintFallback = () => {
      ctx.fillStyle = "#F3EEE4";
      ctx.fillRect(0, 0, w, h);
    };

    const drawCover = (img: HTMLImageElement) => {
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      painted = true;
    };

    /** true = a real image was painted; false = only the cream fallback (or nothing new). */
    const render = (i: number): boolean => {
      const img = images[i];
      if (!img || !loaded[i]) {
        if (!painted) paintFallback();
        return false;
      }
      drawCover(img);
      return true;
    };

    const drawStandIn = (i: number) => {
      for (let d = 1; d < FRAME_COUNT; d++) {
        const a = i - d;
        const b = i + d;
        const j = a >= 0 && loaded[a] ? a : b < FRAME_COUNT && loaded[b] ? b : -1;
        if (j >= 0) {
          if (j !== standInIndex) {
            drawCover(images[j]!);
            standInIndex = j;
          }
          return;
        }
        if (a < 0 && b >= FRAME_COUNT) break;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      // Resizing clears the bitmap: force a fresh paint.
      painted = false;
      currentIndex = -1;
      standInIndex = -1;
      paintFallback();
    };

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (container.offsetHeight - window.innerHeight)),
      );
      // Ease toward the scroll position so wheel steps glide through frames
      // instead of jumping several at once.
      if (smooth < 0 || reduceMotion) smooth = progress;
      else {
        smooth += (progress - smooth) * 0.18;
        if (Math.abs(progress - smooth) < 0.0001) smooth = progress;
      }
      if (smooth !== scrollYProgress.get()) scrollYProgress.set(smooth);
      wantedIndex = Math.round(smooth * (FRAME_COUNT - 1));
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;

      if (onScreen && wantedIndex !== currentIndex) {
        if (render(wantedIndex)) {
          currentIndex = wantedIndex;
          standInIndex = -1;
        } else {
          drawStandIn(wantedIndex);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        // dev-only hook for automated smoothness checks
        (window as unknown as { __hero?: object }).__hero = { wanted: wantedIndex, current: currentIndex, progress };
      }
    };

    resize();

    for (const i of loadOrder(FRAME_COUNT)) {
      const img = new Image();
      img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      img.onload = () => {
        loaded[i] = 1;
        // Paint immediately if this is the frame the scroll position is asking for.
        if (i === wantedIndex && currentIndex !== i && render(i)) {
          currentIndex = i;
          standInIndex = -1;
        }
      };
      img.src = frameSrc(i, small);
      images[i] = img;
    }

    // requestAnimationFrame loop, scheduled in framer's "read" phase: it runs before
    // framer writes styles in the same frame, so getBoundingClientRect never forces
    // a synchronous layout.
    frame.read(tick, true);
    window.addEventListener("resize", resize);

    return () => {
      cancelFrame(tick);
      window.removeEventListener("resize", resize);
      for (const img of images) if (img) img.onload = null;
    };
  }, [scrollYProgress]);

  // Framing. Desktop only: during the Material beat (text on the right) the camera
  // pushes in and shifts the box left so the type never sits on it. At the end the
  // camera pushes toward the surface as the hero hands over to the next section.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const canvasScale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.3, 0.44, 0.5, 0.9, 1],
    wide ? [1, 1, 1.24, 1.24, 1, 1, 1.08] : [1, 1, 1, 1, 1, 1, 1.08],
  );
  const canvasX = useTransform(
    scrollYProgress,
    [0, 0.22, 0.3, 0.44, 0.5, 1],
    wide ? ["0%", "0%", "-10%", "-10%", "0%", "0%"] : ["0%", "0%", "0%", "0%", "0%", "0%"],
  );



  return (
    <section
      id="top"
      ref={containerRef}
      aria-label="Where ideas take form"
      style={{ height: "380vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#F3EEE4",
        }}
      >
        <motion.canvas
          ref={canvasRef}
          style={{ scale: canvasScale, x: canvasX }}
          className="absolute inset-0 block"
          role="img"
          aria-label="One continuous camera move: a dieline on cream specialty paper folds into a box, the box is wrapped in stone-grey paper with a copper foil line and magnetic closure, the camera pulls back through the design studio and settles on a still life of finished packaging by the window."
        />
        <div style={{ position: "absolute", inset: 0 }} className="pointer-events-none">
          <IdentityBeat p={scrollYProgress} />
          <MaterialBeat p={scrollYProgress} />
          <FormBeat p={scrollYProgress} />
          <FinalBeat p={scrollYProgress} />
          <HeroProgress p={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

function mount(y: number, duration: number, delay: number) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: EASE },
  };
}

function IdentityBeat({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.02, 0.14], [1, 1, 0]);
  const y = useTransform(p, [0, 0.14], [0, -80]);
  const visibility = useTransform(p, (v) => (v > 0.145 ? "hidden" : "visible"));

  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className="gutter isolate absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end pb-28 pt-20 md:justify-center md:pb-16 md:pt-24"
    >
      <div className="pointer-events-auto relative w-fit max-w-[1100px]">
        <motion.p {...mount(28, 1, 0.05)} className="label relative mb-6 flex w-fit items-center gap-3 font-medium text-ink">
          <RegMark className="h-3 w-3 text-copper" />
          {hero.label}
        </motion.p>
        <motion.h1
          {...mount(56, 1.3, 0.2)}
          className="display text-[clamp(52px,min(11.5vw,15vh),184px)] text-ink"
        >
          {hero.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </motion.h1>
        <motion.p
          {...mount(36, 1.1, 0.4)}
          className="relative mt-6 max-w-[440px] text-[15px] font-medium leading-relaxed text-ink md:text-[17px]"
        >
          {hero.body}
        </motion.p>
        <motion.div {...mount(28, 1, 0.55)} className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
          <CtaButton href={contactHref}>{cta.primary}</CtaButton>
          <a
            href="#capabilities"
            className="label group relative py-2 text-ink"
          >
            {cta.secondary}
            <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-50 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SideBeat({
  p,
  range,
  from,
  side,
  label,
  title,
  body,
}: {
  p: MotionValue<number>;
  range: [number, number, number, number];
  from: number;
  side: "left" | "right";
  label: string;
  title: string;
  body: string;
}) {
  const [a, b, c, d] = range;
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
  const x = useTransform(p, [a, b, c, d], [from, 0, 0, -from * 0.5]);
  const visibility = useTransform(p, (v) => (v < a || v > d ? "hidden" : "visible"));
  const right = side === "right";

  return (
    <motion.div
      style={{ opacity, x, visibility }}
      className={`gutter isolate absolute inset-0 flex items-end pb-24 md:items-center md:pb-0 ${right ? "md:justify-end" : "justify-start"}`}
    >
      <div className={`relative max-w-[520px] ${right ? "md:text-right" : ""}`}>
        <p className={`label relative mb-5 flex w-fit items-center gap-3 font-medium text-ink ${right ? "md:ml-auto" : ""}`}>
          <span className="h-px w-8 bg-copper" />
          {label}
        </p>
        <h2 className="display text-[clamp(40px,6.2vw,96px)] text-ink">{title}</h2>
        <p className={`relative mt-6 max-w-[380px] text-[15px] font-medium leading-relaxed text-ink md:text-[17px] ${right ? "md:ml-auto" : ""}`}>
          {body}
        </p>
      </div>
    </motion.div>
  );
}

function MaterialBeat({ p }: { p: MotionValue<number> }) {
  return (
    <SideBeat
      p={p}
      range={[0.24, 0.3, 0.44, 0.49]}
      from={40}
      side="right"
      label={hero.material.label}
      title={hero.material.title}
      body={hero.material.body}
    />
  );
}

function FormBeat({ p }: { p: MotionValue<number> }) {
  return (
    <SideBeat
      p={p}
      range={[0.5, 0.56, 0.74, 0.8]}
      from={-40}
      side="left"
      label={hero.form.label}
      title={hero.form.title}
      body={hero.form.body}
    />
  );
}

function FinalBeat({ p }: { p: MotionValue<number> }) {
  // Enters at ~0.88 and never fades out — it holds until the hero releases.
  const opacity = useTransform(p, [0.85, 0.91], [0, 1]);
  const y = useTransform(p, [0.85, 0.93], [40, 0]);
  const visibility = useTransform(p, (v) => (v < 0.85 ? "hidden" : "visible"));

  return (
    <motion.div
      style={{ opacity, visibility }}
      className="isolate absolute inset-0 flex items-center justify-center px-4 text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(44% 40% at 50% 50%, rgba(42,38,34,0.58) 0%, rgba(42,38,34,0.34) 55%, rgba(42,38,34,0) 100%)",
        }}
      />
      <motion.div style={{ y }} className="pointer-events-auto relative [text-shadow:0_1px_18px_rgba(30,26,22,0.35)]">
        <img
          src={brand.logo.light}
          alt={hero.final.label}
          width={165}
          height={60}
          className="mx-auto mb-8 h-12 w-auto opacity-95 md:h-14"
        />
        <h2 className="display text-[clamp(52px,min(10vw,16vh),168px)] text-cream">
          {hero.final.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-7 max-w-[420px] text-[15px] leading-relaxed text-cream/85 md:text-[17px]">
          {hero.final.body}
        </p>
        <div className="mt-9 flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-8">
          <CtaButton href={contactHref} tone="light">
            {cta.primary}
          </CtaButton>
          <a
            href={`mailto:${brand.email}`}
            className="label inline-flex items-center rounded-full border border-cream/40 bg-charcoal/25 px-6 py-3.5 text-cream transition-all duration-300 hover:border-cream hover:bg-charcoal/40 hover:scale-105"
          >
            {brand.email}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

const CHAPTERS = ["Idea", "Material", "Form", "Object"];

function HeroProgress({ p }: { p: MotionValue<number> }) {
  const scaleX = useTransform(p, [0, 1], [0, 1]);
  const opacity = useTransform(p, [0, 0.05, 0.8, 0.85], [0.5, 1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden="true"
      className="gutter absolute inset-x-0 bottom-8 hidden flex-col gap-3 lg:flex"
    >
      <ul className="flex justify-between">
        {CHAPTERS.map((c, i) => (
          <li key={c} className="label text-[10px] text-ink-2">
            <span className="text-muted">0{i + 1}</span> {c}
          </li>
        ))}
      </ul>
      <div className="relative h-px bg-ink/15">
        <motion.div style={{ scaleX }} className="absolute inset-0 origin-left bg-copper" />
      </div>
    </motion.div>
  );
}
