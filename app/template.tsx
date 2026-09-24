"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE, useReduce } from "./components/primitives";

// The first paint must show the hero immediately, so the sheet only runs on
// client-side navigations between pages.
let firstLoad = true;

/**
 * Page transition: a cream sheet covers the new page and lifts away, with a copper
 * crease along its edge, like turning to the next sheet of a proof.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReduce();
  const [show] = useState(() => !firstLoad);
  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <>
      {show && !reduce && (
        <motion.div
          aria-hidden="true"
          data-page-sheet
          className="pointer-events-none fixed inset-0 z-[75] bg-cream"
          initial={{ y: "0%" }}
          animate={{ y: "-101%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.05 }}
        >
          <span className="absolute inset-x-0 bottom-0 h-px bg-copper/70" />
          <span className="absolute inset-x-0 bottom-0 h-16 translate-y-full bg-gradient-to-b from-charcoal/10 to-transparent" />
        </motion.div>
      )}
      {children}
    </>
  );
}
