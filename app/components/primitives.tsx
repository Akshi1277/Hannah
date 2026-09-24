"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** prefers-reduced-motion, but false until mounted so server and client first render agree. */
export function useReduce(): boolean {
  const r = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!r;
}

/** Pulls its child gently toward the pointer, like a sheet resisting a magnet. */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" fill="none" aria-hidden="true" className={`h-3 w-5 ${className}`}>
      <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Primary pill button used for every "Start a project" moment. */
export function CtaButton({
  href,
  children,
  tone = "dark",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const tones = {
    dark: "bg-ink text-cream border-ink hover:bg-charcoal",
    light: "bg-cream text-ink border-cream hover:bg-cream-2",
    outline: "bg-transparent text-current border-current/40 hover:border-current",
  };
  return (
    <Magnetic>
      <a
        href={href}
        onClick={onClick}
        className={`group inline-flex items-center gap-4 rounded-full border px-6 py-4 label !text-[12px] transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] ${tones[tone]} ${className}`}
      >
        <span>{children}</span>
        <span className="relative flex h-3 w-5 overflow-hidden">
          <Arrow className="absolute transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-6" />
          <Arrow className="absolute -translate-x-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
        </span>
      </a>
    </Magnetic>
  );
}

/** Masked line reveal: each line slides up out of a paper slot. */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  as = "h2",
  id,
}: {
  id?: string;
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  // Observe the (unclipped) heading itself; the lines start hidden inside overflow slots.
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName}`}
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small section label with a registration mark. */
export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 text-ink-2 ${className}`}>
      <RegMark className="h-3 w-3" />
      {children}
    </p>
  );
}

export function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1" />
      <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
