"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { about } from "../content";
import { RegMark } from "./primitives";
import { useProgress } from "./useProgress";

/** Manifesto: the words ink in one by one as you read down the sheet. */
export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useProgress(ref, [[0, 0.85], [1, 0.6]]);
  const words = about.title.flatMap((line, li) => line.split(" ").map((w, wi) => ({ w, br: wi === 0 && li > 0 })));
  const bodyWords = about.body.join(" ").split(" ");

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-cream py-[18vh]">
      <div ref={ref} className="gutter">
        <p className="label mb-10 flex items-center gap-3 text-ink-2">
          <RegMark className="h-3 w-3" /> About — Manifesto
        </p>
        <h2 id="about-title" className="display text-[clamp(48px,9.5vw,176px)] text-ink" aria-label={about.title.join(" ")}>
          {words.map(({ w, br }, k) => (
            <span key={k}>
              {br && <br />}
              {/* the headline opens the About page, so it reads immediately; the paragraph below inks in with scroll */}
              <span aria-hidden="true" className={w === "beautiful." ? "text-copper" : ""}>
                {w}
              </span>{" "}
            </span>
          ))}
        </h2>

        <div className="mt-[10vh] grid md:grid-cols-12">
          <p className="text-[clamp(22px,2.6vw,38px)] font-medium leading-[1.25] tracking-[-0.02em] text-ink md:col-span-8 md:col-start-5" aria-label={about.body.join(" ")}>
            {bodyWords.map((w, k) => (
              <span key={k}>
                <Word p={scrollYProgress} range={[0.55 + (k / bodyWords.length) * 0.4, 0.55 + ((k + 1) / bodyWords.length) * 0.4]}>
                  {w}
                </Word>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({ p, range, children, accent }: { p: MotionValue<number>; range: [number, number]; children: string; accent?: boolean }) {
  const opacity = useTransform(p, range, [0.14, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className={accent ? "text-copper" : ""}>
      {children}
    </motion.span>
  );
}
