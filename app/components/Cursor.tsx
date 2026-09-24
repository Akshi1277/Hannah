"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReduce } from "./primitives";

/** A registration-mark cursor companion. Fine pointers only; off under reduced motion. */
export default function Cursor() {
  const reduce = useReduce();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setActive(!!t?.closest?.("a,button,input,select,textarea,[data-cursor]"));
    };
    window.addEventListener("pointermove", move);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("pointermove", move);
    };
  }, [reduce, x, y]);

  if (!enabled || reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-multiply"
      style={{ x: sx, y: sy }}
    >
      <motion.svg
        viewBox="0 0 40 40"
        className="-ml-5 -mt-5 h-10 w-10 text-copper"
        animate={{ scale: active ? 1.6 : 0.7, rotate: active ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M20 6v8M20 26v8M6 20h8M26 20h8" stroke="currentColor" strokeWidth="1" />
      </motion.svg>
    </motion.div>
  );
}
