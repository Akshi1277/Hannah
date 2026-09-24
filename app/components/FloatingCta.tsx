"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, cancelFrame, frame, motion } from "framer-motion";
import { cta } from "../content";
import { Arrow, EASE, Magnetic } from "./primitives";

/** Persistent "Start a project" — hidden inside the hero (which has its own CTA) and at the contact form. */
export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Runs in framer's read phase, so these measurements never force a layout.
    const check = () => {
      const hero = document.getElementById("top");
      const contact = document.getElementById("contact");
      const vh = window.innerHeight;
      const pastHero = hero ? hero.getBoundingClientRect().bottom < vh * 0.6 : true;
      const atContact = contact ? contact.getBoundingClientRect().top < vh * 0.8 : false;
      setShow(pastHero && !atContact);
    };
    frame.read(check, true);
    return () => cancelFrame(check);
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
              <a
                href="#contact"
                className="label group flex items-center gap-4 rounded-full border border-ink bg-ink py-4 pl-6 pr-5 text-cream shadow-[0_18px_40px_-18px_rgba(23,23,23,0.6)] transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-copper hover:bg-cream hover:text-ink"
              >
                {cta.primary}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/30 transition-transform duration-500 group-hover:translate-x-1">
                  <Arrow className="h-2.5 w-4" />
                </span>
              </a>
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
            <a
              href="#contact"
              className="label flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-cream"
            >
              {cta.primary}
              <Arrow />
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
