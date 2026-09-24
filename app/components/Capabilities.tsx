"use client";

import { useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { capabilities, capabilitiesIntro } from "../content";
import ObjectVisual from "./ObjectVisual";
import { Arrow, EASE, FadeUp, MaskLines, SectionLabel, useReduce } from "./primitives";

export default function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(0); // mobile accordion
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const my = useMotionValue(0);
  const y = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 });

  // Hover follows real mouse movement only. When the page scrolls under a resting
  // cursor, browsers fire pointer events at the same coordinates; ignoring those
  // stops rows from flickering through their hover states mid-scroll.
  const last = useRef({ x: -1, y: -1 });
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    const moved = e.clientX !== last.current.x || e.clientY !== last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    if (!moved) return;
    const r = listRef.current.getBoundingClientRect();
    my.set(e.clientY - r.top);
    const li = (e.target as Element).closest<HTMLElement>("li[data-i]");
    setActive(li ? Number(li.dataset.i) : null);
  };

  return (
    <section id="capabilities" aria-labelledby="cap-title" className="relative bg-cream py-[16vh]">
      <div className="gutter">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel className="mb-8">{capabilitiesIntro.label}</SectionLabel>
            <MaskLines
              id="cap-title"
              lines={capabilitiesIntro.title}
              className="display text-[clamp(44px,7.5vw,128px)] text-ink"
            />
          </div>
          <FadeUp className="self-end md:col-span-4 md:col-start-9">
            <p className="text-[17px] leading-relaxed text-ink-2">{capabilitiesIntro.body}</p>
          </FadeUp>
        </div>
      </div>

      <div
        ref={listRef}
        onPointerMove={move}
        onPointerLeave={() => setActive(null)}
        className="relative mt-[10vh]"
      >
      <ul className="border-t border-hair">
        {capabilities.map((c, i) => {
          const on = active === i;
          const mOpen = open === i;
          return (
            <li
              key={c.n}
              data-i={i}
              className="group relative border-b border-hair"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 origin-bottom bg-cream-2"
                initial={false}
                animate={{ scaleY: on ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <button
                type="button"
                className="gutter relative flex w-full items-center gap-5 py-7 text-left md:cursor-default md:py-9"
                aria-expanded={mOpen}
                aria-controls={`cap-${i}`}
                onClick={() => setOpen(mOpen ? null : i)}
                onFocus={() => setActive(i)}
              >
                <motion.span
                  className="label w-10 shrink-0 text-muted"
                  animate={{ x: on ? 18 : 0, color: on ? "#A66A46" : "#777168" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {c.n}
                </motion.span>
                <motion.span
                  className="display block origin-left text-[clamp(30px,5.4vw,92px)] text-ink md:max-w-[calc(100%-470px)]"
                  animate={{ scale: on && !reduce ? 1.04 : 1, x: on ? 18 : 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {c.title}
                </motion.span>
                {/* shown visually inside the floating panel on desktop, inline on mobile */}
                <span className="sr-only">{c.body}</span>
                <motion.span
                  className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hair text-ink"
                  animate={{
                    rotate: on || mOpen ? -45 : 0,
                    backgroundColor: on ? "#171717" : "rgba(0,0,0,0)",
                    color: on ? "#F3EEE4" : "#171717",
                  }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <Arrow />
                </motion.span>
              </button>

              {/* mobile / tablet: tap to open, visual shown inline */}
              <AnimatePresence initial={false}>
                {mOpen && (
                  <motion.div
                    id={`cap-${i}`}
                    className="relative overflow-hidden md:hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <div className="gutter flex items-center gap-6 pb-8">
                      <div className="h-36 w-36 shrink-0 rounded-sm bg-cream-2 p-3">
                        <ObjectVisual kind={c.kind} />
                      </div>
                      <p className="text-[15px] leading-relaxed text-ink-2">{c.body}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

        {/* desktop: the object rides beside the list, following the cursor vertically,
            parked on the right so it never covers a title */}
        <motion.div
          aria-hidden="true"
          style={{ y }}
          className="pointer-events-none absolute right-[clamp(84px,8vw,136px)] top-0 z-10 hidden md:block"
        >
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: "inset(100% 0 0 0)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0 0 0)" }}
                exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="crop w-[250px] -translate-y-1/2 bg-cream p-5 shadow-[0_30px_60px_-30px_rgba(42,38,34,0.5)] lg:w-[270px]"
              >
                <div className="label mb-2 flex justify-between text-[10px] text-muted">
                  <span>{capabilities[active].n}</span>
                  <span>{capabilities[active].kind} / study</span>
                </div>
                <div className="h-[180px] lg:h-[200px]">
                  <ObjectVisual kind={capabilities[active].kind} />
                </div>
                <p className="mt-3 border-t border-hair pt-3 text-[14px] leading-snug text-ink-2">
                  {capabilities[active].body}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
