"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, cancelFrame, frame, motion } from "framer-motion";
import Link from "next/link";
import { cta, contactHref } from "../content";
import { Arrow, EASE, Magnetic } from "./primitives";

/**
 * Tiny shared store: whether the floating CTA is showing. The nav hides its own
 * "Start a project" while this one is visible, so only one is ever on screen.
 */
let floatingVisible = false;
const listeners = new Set<() => void>();
export const floatingCta = {
  get: () => floatingVisible,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
function publish(v: boolean) {
  if (v === floatingVisible) return;
  floatingVisible = v;
  listeners.forEach((l) => l());
}

/**
 * Persistent "Start a project". Hidden inside the hero (which has its own CTA),
 * during full-screen pinned sequences (so it never sits on their visuals), and at
 * the contact form.
 */
export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Runs in framer's read phase, so these measurements never force a layout.
    const check = () => {
      const hero = document.getElementById("top");
      const contact = document.getElementById("contact");
      const footer = document.querySelector("footer");
      const vh = window.innerHeight;
      const pastHero = hero ? hero.getBoundingClientRect().bottom < vh * 0.6 : true;
      const atContact = contact ? contact.getBoundingClientRect().top < vh * 0.8 : false;
      const atFooter = footer ? footer.getBoundingClientRect().top < vh * 0.95 : false;
      let pinned = false;
      document.querySelectorAll("[data-pinned]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 4 && r.bottom >= vh - 4) pinned = true;
      });
      const next = pastHero && !atContact && !atFooter && !pinned;
      setShow(next);
      publish(next);
    };
    frame.read(check, true);
    return () => {
      cancelFrame(check);
      publish(false);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="desk"
            className="fixed bottom-8 right-8 z-40 hidden md:block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Magnetic strength={0.4}>
              <Link
                href={contactHref}
                className="label group flex items-center gap-4 rounded-full border border-ink bg-ink py-4 pl-6 pr-5 text-cream shadow-[0_18px_40px_-18px_rgba(23,23,23,0.6)] transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-copper hover:bg-cream hover:text-ink"
              >
                {cta.primary}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/30 transition-transform duration-500 group-hover:translate-x-1">
                  <Arrow className="h-2.5 w-4" />
                </span>
              </Link>
            </Magnetic>
          </motion.div>
          <motion.div
            key="mob"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-cream/95 p-3 md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href={contactHref}
              className="label flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-cream"
            >
              {cta.primary}
              <Arrow />
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
