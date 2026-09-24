"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import { materials, materialsIntro, type MaterialKind } from "../content";
import { EASE, FadeUp, MaskLines, RegMark, useReduce } from "./primitives";
import { useProgress, PIN } from "./useProgress";

export default function Materials() {
  return (
    <section id="materials" aria-labelledby="mat-title" className="relative bg-cream">
      <div className="gutter pt-[16vh]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="label mb-8 flex items-center gap-3 text-ink-2">
              <RegMark className="h-3 w-3" /> Sheet 02 — Material
            </p>
            <MaskLines id="mat-title" lines={materialsIntro.title} className="display text-[clamp(52px,9vw,160px)] text-ink" />
          </div>
          <FadeUp className="self-end md:col-span-4 md:col-start-9">
            <p className="text-[17px] leading-relaxed text-ink-2">{materialsIntro.body}</p>
          </FadeUp>
        </div>
      </div>
      <MaterialField />
      <MaterialToPackaging />
    </section>
  );
}

/* ───────────────────────── Material field ───────────────────────── */

function MaterialField() {
  const [m, setM] = useState<MaterialKind>("copper");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const pos = useRef({ x: 0.35, y: 0.4, tx: 0.35, ty: 0.4 });

  // The light is written straight to the DOM (CSS variables + SVG light attributes)
  // instead of React state, so moving it never re-renders the component.
  const applyLight = () => {
    const el = ref.current;
    if (!el) return;
    const { x, y } = pos.current;
    el.style.setProperty("--lx", `${x * 100}%`);
    el.style.setProperty("--ly", `${y * 100}%`);
    el.style.setProperty("--lxn", String(x));
    el.style.setProperty("--lyn", String(y));
    el.querySelectorAll("fePointLight").forEach((l) => {
      l.setAttribute("x", String(x * 1000));
      l.setAttribute("y", String(y * 625));
    });
  };
  // A newly selected surface mounts with default attributes: apply the current light.
  useEffect(() => {
    const id = requestAnimationFrame(applyLight);
    return () => cancelAnimationFrame(id);
  }, [m]);

  // Light eases toward the pointer (or drifts on its own for touch / idle).
  useEffect(() => {
    let raf = 0;
    let t0 = performance.now();
    let lastMove = 0;
    const el = ref.current;
    const onMove = (e: PointerEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      pos.current.tx = (e.clientX - r.left) / r.width;
      pos.current.ty = (e.clientY - r.top) / r.height;
      lastMove = performance.now();
    };
    el?.addEventListener("pointermove", onMove);
    // Only light the surface while it is on screen — the lighting filter is costly.
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && e.intersectionRatio >= 0.35;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    }, { threshold: [0, 0.35] });
    if (el) io.observe(el);
    const loop = (now: number) => {
      if (!visible) return;
      const p = pos.current;
      if (!reduce && now - lastMove > 2500) {
        const k = (now - t0) / 4000;
        p.tx = 0.5 + Math.cos(k) * 0.3;
        p.ty = 0.45 + Math.sin(k * 1.3) * 0.2;
      }
      const nx = p.x + (p.tx - p.x) * 0.08;
      const ny = p.y + (p.ty - p.y) * 0.08;
      if (Math.abs(nx - p.x) > 0.002 || Math.abs(ny - p.y) > 0.002) {
        p.x = nx;
        p.y = ny;
        applyLight();
      }
      raf = requestAnimationFrame(loop);
    };
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el?.removeEventListener("pointermove", onMove);
      t0 = 0;
    };
  }, [reduce]);

  const current = materials.find((x) => x.id === m)!;
  // Leather and blind-emboss render dark: their caption switches to cream.
  const darkSurface = m === "leather" || m === "emboss";

  return (
    <div className="gutter py-[12vh]">
      <div className="grid gap-6 lg:grid-cols-12">
        <div role="tablist" aria-label="Materials" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-3 lg:flex-col lg:gap-0 lg:overflow-visible">
          {materials.map((x, i) => {
            const sel = x.id === m;
            return (
              <button
                key={x.id}
                role="tab"
                aria-selected={sel}
                aria-controls="material-field"
                onClick={() => setM(x.id)}
                onPointerMove={(e) => e.pointerType === "mouse" && (e.movementX !== 0 || e.movementY !== 0) && x.id !== m && setM(x.id)}
                className={`group flex shrink-0 items-baseline gap-4 whitespace-nowrap rounded-full border px-4 py-2.5 text-left transition-colors lg:w-full lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-5 ${
                  sel ? "border-ink bg-ink text-cream lg:bg-transparent lg:text-ink" : "border-hair text-ink-2 lg:border-hair"
                }`}
              >
                <span className="label text-[10px] opacity-60">0{i + 1}</span>
                <span className="text-[15px] font-semibold uppercase tracking-[-0.01em] lg:min-w-0 lg:text-[clamp(17px,1.45vw,22px)] lg:leading-tight">{x.name}</span>
                <span className={`ml-auto hidden h-px bg-copper transition-all duration-700 lg:block ${sel ? "w-10" : "w-0"}`} />
              </button>
            );
          })}
          <p className="label mt-8 hidden text-muted lg:block">Move across the surface</p>
        </div>

        <div
          ref={ref}
          id="material-field"
          role="tabpanel"
          aria-label={`${current.name} surface. ${current.note}`}
          data-cursor
          className="crop relative aspect-[4/5] touch-pan-y overflow-hidden bg-cream sm:aspect-[16/10] lg:col-span-9"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={m}
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              animate={{ clipPath: "inset(0 0 0 0%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Surface kind={m} />
            </motion.div>
          </AnimatePresence>
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-colors duration-500 md:p-8 ${
              darkSurface
                ? "bg-gradient-to-t from-black/60 via-black/25 to-transparent text-cream"
                : "text-ink"
            }`}
          >
            <div>
              <p className={`label text-[10px] ${darkSurface ? "text-cream/70" : "text-ink/60"}`}>Material sample</p>
              <p className="mt-1 text-[22px] font-bold uppercase tracking-[-0.02em] md:text-[32px]">{current.name}</p>
            </div>
            <p className={`label hidden max-w-[240px] text-right md:block ${darkSurface ? "text-cream/80" : "text-ink/70"}`}>{current.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Surface({ kind }: { kind: MaterialKind }) {
  // Light position comes from CSS variables set on the field (see applyLight).
  const px = "var(--lx, 35%)";
  const py = "var(--ly, 40%)";

  if (kind === "copper") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(40% 55% at ${px} ${py}, rgba(255,226,196,0.95) 0%, rgba(214,150,108,0.55) 30%, rgba(0,0,0,0) 65%),
            linear-gradient(calc(110deg + var(--lxn, 0.35) * 40deg), #6E3F26 0%, #A66A46 calc(20% + var(--lxn, 0.35) * 30%), #E0AD83 calc(40% + var(--lxn, 0.35) * 20%), #8A5234 calc(70% + var(--lyn, 0.4) * 10%), #5C3320 100%)`,
        }}
      >
        <svg className="absolute inset-0 h-full w-full mix-blend-overlay opacity-60" aria-hidden="true">
          <filter id="brushed"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" /></filter>
          <rect width="100%" height="100%" filter="url(#brushed)" />
        </svg>
      </div>
    );
  }

  if (kind === "screen") {
    return (
      <div className="absolute inset-0 bg-[#EFE7D6]">
        {[
          { c: "#69705A", s: 14, o: 0.9 },
          { c: "#A66A46", s: 18, o: 0.75 },
        ].map((l, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${l.c} 0 ${2 + i}px, transparent ${3 + i}px)`,
              backgroundSize: `${l.s}px ${l.s}px`,
              backgroundPosition: i ? "7px 5px" : "0 0",
              opacity: l.o,
              WebkitMaskImage: `radial-gradient(${40 + i * 10}% ${55 + i * 10}% at ${px} ${py}, #000 0%, rgba(0,0,0,${0.25 - i * 0.1}) 70%, rgba(0,0,0,0.12) 100%)`,
              maskImage: `radial-gradient(${40 + i * 10}% ${55 + i * 10}% at ${px} ${py}, #000 0%, rgba(0,0,0,${0.25 - i * 0.1}) 70%, rgba(0,0,0,0.12) 100%)`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #171717 0 5px, transparent 6px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "11px 11px",
            WebkitMaskImage: `radial-gradient(26% 34% at ${px} ${py}, #000 0%, rgba(0,0,0,0) 100%)`,
            maskImage: `radial-gradient(26% 34% at ${px} ${py}, #000 0%, rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>
    );
  }

  // Lit surfaces: real diffuse lighting on a height map, with the light at the pointer.
  const cfg = {
    leather: { base: "#8C6A52", light: "#FFE6CC", freq: "0.035", oct: 4, scale: 4, elev: 28 },
    paper: { base: "#EDE4D2", light: "#FFF8EC", freq: "0.9", oct: 3, scale: 1.4, elev: 35 },
    emboss: { base: "#ECE3D0", light: "#FFF7EA", freq: "0.6", oct: 2, scale: 0.6, elev: 22 },
  }[kind];

  return (
    // Rendered at half resolution and scaled up: the lighting filter cost drops ~4×.
    <svg className="absolute left-0 top-0 h-1/2 w-1/2 origin-top-left scale-[2]" preserveAspectRatio="none" viewBox="0 0 1000 625" aria-hidden="true">
      <defs>
        <filter id={`lit-${kind}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {kind === "emboss" ? (
            <>
              <feTurbulence type="fractalNoise" baseFrequency={cfg.freq} numOctaves={cfg.oct} result="grain" />
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blurShape" />
              <feComposite in="blurShape" in2="grain" operator="arithmetic" k1="0" k2="1" k3="0.08" k4="0" result="height" />
            </>
          ) : (
            <feTurbulence
              type={kind === "leather" ? "turbulence" : "fractalNoise"}
              baseFrequency={kind === "paper" ? "0.9 0.25" : cfg.freq}
              numOctaves={cfg.oct}
              seed="7"
              result="height"
            />
          )}
          <feDiffuseLighting in="height" surfaceScale={cfg.scale} diffuseConstant="1.15" lightingColor={cfg.light} result="lit">
            <fePointLight x={350} y={250} z={kind === "emboss" ? 90 : 160} />
          </feDiffuseLighting>
          <feFlood floodColor={cfg.base} result="base" />
          <feBlend in="lit" in2="base" mode="multiply" />
        </filter>
      </defs>
      {kind === "emboss" ? (
        <g filter={`url(#lit-${kind})`}>
          <rect width="1000" height="625" fill="#000" fillOpacity="0.001" />
          {/* blind emboss: a monogram pattern that only shadow reveals */}
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 8 }).map((__, c) => (
              <g key={`${r}-${c}`} transform={`translate(${c * 130 + (r % 2) * 65 + 20} ${r * 130 + 20})`}>
                <path d="M0 45 L45 0 L90 45 L45 90Z M22 45 L45 22 L68 45 L45 68Z" fill="#000" fillRule="evenodd" />
              </g>
            )),
          )}
        </g>
      ) : (
        <rect width="1000" height="625" filter={`url(#lit-${kind})`} />
      )}
    </svg>
  );
}

/* ─────────────── Paper → sheet → dieline → structure → package ─────────────── */

function MaterialToPackaging() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const p = useProgress(ref, PIN);

  // One object, start to finish: paper → sheet → dieline → folded tray → lidded,
  // wrapped, foiled, embossed box → then the real photographed piece beside it.
  const stage = useTransform(p, [0, 0.18, 0.34, 0.52, 0.66, 1], [0, 1, 2, 3, 4, 4]);
  const [idx, setIdx] = useState(0);
  useEffect(() => stage.on("change", (v) => setIdx(Math.min(4, Math.floor(v + 0.001)))), [stage]);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // 0 → 1: the paper from the opening shot fills the frame, then is cropped down to a sheet
  const paperClip = useTransform(p, [0.02, 0.17], ["inset(0% 0% 0% 0%)", "inset(30% 36% 30% 36%)"]);
  const paperOpacity = useTransform(p, [0.13, 0.2], [1, 0]);
  const paperScale = useTransform(p, [0, 0.17], reduce ? [1, 1] : [1.08, 1]);
  const netOpacity = useTransform(p, [0.12, 0.19], [0, 1]);
  // 1 → 2: dieline draws on the flat sheet, then leaves as the walls rise
  const dieline = useTransform(p, [0.18, 0.34], [0, 1]);
  const dielineFade = useTransform(p, [0.36, 0.44], [1, 0]);
  // 2 → 3: walls fold up into a tray
  const fold = useTransform(p, [0.34, 0.52], [0, 90]);
  const foldNeg = useTransform(fold, (v) => -v);
  const tilt = useTransform(p, [0.26, 0.5], reduce ? [55, 55] : [0, 55]);
  const spin = useTransform(p, [0.26, 0.62], reduce ? [-40, -40] : [0, -40]);
  // 3 → 4: lid drops on, board turns stone-grey, foil draws, emboss presses, magnet appears
  const lidDrop = useTransform(p, [0.52, 0.62], [22, 0]); // vmin above the tray
  const lidZ = useTransform(lidDrop, (v) => `${18.7 + v}vmin`); // walls are 55% of the 34vmin base
  const lidOpacity = useTransform(p, [0.52, 0.56], [0, 1]);
  const board = useTransform(p, [0.6, 0.7], ["#EFE6D4", "#B9AE9B"]);
  const foil = useTransform(p, [0.66, 0.74], [0, 1]);
  const emboss = useTransform(p, [0.72, 0.78], [0, 1]);
  const embossScale = useTransform(p, [0.72, 0.78], [1.25, 1]);
  const magnet = useTransform(p, [0.76, 0.8], [0, 1]);
  // the finished drawing steps aside for the photographed piece
  const boxX = useTransform(p, [0.82, 0.92], wide ? ["0vw", "-14vw"] : ["0vw", "0vw"]);
  const boxY = useTransform(p, [0.82, 0.92], wide ? ["0vh", "0vh"] : ["0vh", "-14vh"]);
  const boxScale = useTransform(p, [0.82, 0.92], [1, wide ? 0.92 : 0.78]);
  const plate = useTransform(p, [0.84, 0.94], ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]);
  const plateOpacity = useTransform(p, [0.84, 0.88], [0, 1]);
  const plateY = useTransform(p, [0.84, 0.96], reduce ? [0, 0] : [24, 0]);
  const groundShadow = useTransform(p, [0.4, 0.62], [0, 1]);

  return (
    <div ref={ref} className="relative" style={{ height: "340vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-cream" data-pinned>
        <div className="gutter relative z-10 flex items-center justify-between pt-24 md:pt-28">
          <p className="label text-ink-2">Material → Packaging</p>
          <p className="label text-muted">0{idx + 1} / 05</p>
        </div>

        {/* opening: full-bleed paper, cropped down toward the sheet */}
        <motion.div
          aria-hidden="true"
          style={{ clipPath: paperClip, opacity: paperOpacity }}
          className="pointer-events-none absolute inset-0"
        >
          <motion.img
            src="/img/story/packaging-paper.jpg"
            alt=""
            loading="lazy"
            style={{ scale: paperScale }}
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="relative flex flex-1 items-center justify-center" style={{ perspective: "1400px" }}>
          <motion.div style={{ x: boxX, y: boxY, scale: boxScale, perspective: "1400px" }} className="relative">
            {/* contact shadow: grounds the drawn box on the page like the photographed one on its table */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 block h-[16vmin] w-[62vmin] -translate-x-1/2 translate-y-[10%] rounded-[50%]"
              style={{ opacity: groundShadow, background: "radial-gradient(closest-side, rgba(42,38,34,0.32), rgba(42,38,34,0.12) 55%, rgba(42,38,34,0) 100%)" }}
            />
            <motion.div
              role="img"
              aria-label="A flat board folds into a tray, a lid drops on, and it becomes a stone-grey rigid box with a copper foil line, an embossed mark and a copper magnetic closure."
              style={{ rotateX: tilt, rotateZ: spin, opacity: netOpacity, transformStyle: "preserve-3d" }}
              className="relative h-[34vmin] w-[34vmin]"
            >
              <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {/* base and four walls hinged on its edges */}
                <Panel color={board} shade={0.06} />
                <motion.div className="absolute bottom-full left-0 h-[55%] w-full origin-bottom" style={{ rotateX: foldNeg, transformStyle: "preserve-3d" }}>
                  <Panel color={board} shade={0.02} />
                </motion.div>
                <motion.div className="absolute left-0 top-full h-[55%] w-full origin-top" style={{ rotateX: fold, transformStyle: "preserve-3d" }}>
                  <Panel color={board} shade={0.16} />
                </motion.div>
                <motion.div className="absolute right-full top-0 h-full w-[55%] origin-right" style={{ rotateY: fold, transformStyle: "preserve-3d" }}>
                  <Panel color={board} shade={0.22} />
                </motion.div>
                <motion.div className="absolute left-full top-0 h-full w-[55%] origin-left" style={{ rotateY: foldNeg, transformStyle: "preserve-3d" }}>
                  <Panel color={board} shade={0.1} />
                </motion.div>

                {/* dieline drawn over the flat net */}
                <motion.svg
                  style={{ opacity: dielineFade }}
                  className="pointer-events-none absolute -inset-[55%] h-[210%] w-[210%] overflow-visible"
                  viewBox="0 0 210 210"
                  aria-hidden="true"
                >
                  <motion.path d="M55 55 H155 V155 H55Z" fill="none" stroke="#A66A46" strokeWidth="0.6" strokeDasharray="3 2" style={{ pathLength: dieline }} />
                  <motion.path
                    d="M55 55 V0 H155 V55 H210 V155 H155 V210 H55 V155 H0 V55Z"
                    fill="none"
                    stroke="#171717"
                    strokeWidth="0.6"
                    style={{ pathLength: dieline }}
                  />
                </motion.svg>

                {/* lid: a slightly larger top with skirts hanging over the walls */}
                <motion.div className="absolute -inset-[3%]" style={{ z: lidZ, opacity: lidOpacity, transformStyle: "preserve-3d" }}>
                  <Panel color={board} shade={0} lid />
                  {/* copper foil line and blind emboss on the lid */}
                  <motion.span
                    className="absolute left-0 right-0 top-[64%] block h-[2.2%] origin-left"
                    style={{ scaleX: foil, background: "linear-gradient(90deg,#8A5234,#E6B58C 45%,#A66A46 60%,#7A4428)" }}
                  />
                  {/* blind emboss: the Hannah Pixels monogram, shown only by a light and a shadow edge */}
                  <motion.span className="absolute left-[39%] top-[16%] block h-[34%] w-[22%]" style={{ opacity: emboss, scale: embossScale }}>
                    <span className="absolute inset-0 block" style={{ ...MONOGRAM_MASK, background: "rgba(255,255,255,0.5)", transform: "translate(-0.9px,-0.9px)" }} />
                    <span className="absolute inset-0 block" style={{ ...MONOGRAM_MASK, background: "rgba(40,32,24,0.32)", transform: "translate(0.9px,0.9px)" }} />
                    <span className="absolute inset-0 block" style={{ ...MONOGRAM_MASK, background: "rgba(40,32,24,0.06)" }} />
                  </motion.span>
                  {/* skirts */}
                  <motion.div className="absolute bottom-full left-0 h-[20%] w-full origin-bottom" style={{ rotateX: 90 }}>
                    <Panel color={board} shade={0.04} />
                  </motion.div>
                  <motion.div className="absolute left-0 top-full h-[20%] w-full origin-top" style={{ rotateX: -90, transformStyle: "preserve-3d" }}>
                    <Panel color={board} shade={0.14} />
                    {/* copper magnetic closure on the front skirt */}
                    <motion.span
                      className="absolute left-1/2 top-1/2 block aspect-square h-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ opacity: magnet, scale: magnet, background: "radial-gradient(circle at 35% 30%,#F2C9A6,#B87550 70%)", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                    />
                  </motion.div>
                  <motion.div className="absolute right-full top-0 h-full w-[20%] origin-right" style={{ rotateY: -90 }}>
                    <Panel color={board} shade={0.2} />
                  </motion.div>
                  <motion.div className="absolute left-full top-0 h-full w-[20%] origin-left" style={{ rotateY: 90 }}>
                    <Panel color={board} shade={0.1} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* the real piece: the same box, photographed, laid beside the drawing as a plate */}
          <motion.figure
            style={{ clipPath: plate, opacity: plateOpacity, y: plateY }}
            className="crop absolute bottom-[3vh] left-1/2 w-[min(82vw,calc((100vh-440px)*1.3))] -translate-x-1/2 md:bottom-auto md:left-auto md:right-[9vw] md:top-1/2 md:w-[min(34vw,calc((100vh-330px)*1.3))] md:translate-x-0 md:-translate-y-1/2"
          >
            <img
              src="/img/story/packaging-finished.jpg"
              alt="The finished rigid box: stone-grey soft-touch wrap, a copper foil line, a blind-embossed mark and a copper magnetic closure"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover shadow-[0_30px_60px_-30px_rgba(42,38,34,0.55)]"
            />
            <figcaption className="label mt-3 flex justify-between gap-4 whitespace-nowrap text-[10px] text-ink-2">
              <span>05 · Finished piece</span>
              <span className="text-muted">Photographed</span>
            </figcaption>
          </motion.figure>
        </div>

        <ol className="gutter relative z-10 grid grid-cols-5 gap-2 pb-10 md:gap-6 md:pb-14">
          {materialsIntro.journey.map((j, i) => (
            <li key={j} className="relative">
              <span className="block h-px w-full bg-ink/15">
                <motion.span
                  className="block h-px origin-left bg-copper"
                  initial={false}
                  animate={{ scaleX: i <= idx ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </span>
              <span className={`label mt-3 block text-[9px] transition-colors md:text-[11px] ${i === idx ? "text-ink" : "text-muted"}`}>
                <span className="hidden md:inline">0{i + 1} </span>
                {j}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const MONOGRAM_MASK = {
  WebkitMaskImage: "url(/brand/mark-white.png)",
  maskImage: "url(/brand/mark-white.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

function Panel({ color, shade = 0, lid = false }: { color: MotionValue<string>; shade?: number; lid?: boolean }) {
  // Board colour animates cream → stone-grey; a fixed shade per face keeps the 3D form readable.
  return (
    <motion.div
      className={`absolute inset-0 ${lid ? "shadow-[inset_0_0_0_0.5px_rgba(23,23,23,0.35)]" : "shadow-[inset_0_0_0_0.5px_rgba(23,23,23,0.3)]"}`}
      style={{ backgroundColor: color, backfaceVisibility: "visible" }}
    >
      <span className="absolute inset-0 block" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,${shade}))` }} />
    </motion.div>
  );
}
