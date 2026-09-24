"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { brand, contactHref, cta, nav } from "../content";
import { Arrow, EASE } from "./primitives";
import { floatingCta } from "./FloatingCta";
import { useScrollY } from "./useProgress";

const MotionLink = motion.create(Link);

export default function Nav() {
  const scrollY = useScrollY();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const floatingShown = useSyncExternalStore(floatingCta.subscribe, floatingCta.get, () => false);
  const pathname = usePathname() || "/";
  const isActive = (href: string) => pathname.replace(/\/?$/, "/") === href;

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 80));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-ink px-4 py-3 text-cream focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <motion.nav
          aria-label="Primary"
          initial={false}
          animate={
            compact
              ? { marginTop: 12, paddingTop: 10, paddingBottom: 10, maxWidth: 980 }
              : { marginTop: 0, paddingTop: 26, paddingBottom: 26, maxWidth: 2400 }
          }
          transition={{ duration: 0.7, ease: EASE }}
          className={`pointer-events-auto flex w-full items-center justify-between gap-6 md:grid md:grid-cols-[1fr_auto_1fr] transition-[background-color,border-color,box-shadow,border-radius] duration-700 ${
            compact
              ? "mx-3 rounded-full border border-hair bg-cream/95 px-5 shadow-[0_10px_40px_-20px_rgba(42,38,34,0.45)] md:px-6"
              : "gutter rounded-none border border-transparent bg-transparent"
          }`}
        >
          <Link href="/" aria-label={`${brand.name} — home`} className="block shrink-0">
            <img
              src={brand.logo.dark}
              alt={brand.name}
              width={Math.round(36 * brand.logo.ratio)}
              height={36}
              className={`w-auto transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${compact ? "h-9" : "h-11 md:h-14"}`}
            />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`label group relative py-2 transition-colors hover:text-ink ${isActive(n.href) ? "text-ink" : "text-ink-2"}`}
                >
                  {n.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full bg-copper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive(n.href) ? "origin-left scale-x-100" : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* folds away while the floating CTA is on screen: one "Start a project" at a time */}
          <AnimatePresence initial={false}>
            {!floatingShown && (
              <MotionLink
                key="nav-cta"
                href={contactHref}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="label group hidden shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-ink px-5 py-3 text-cream transition-colors hover:bg-copper md:inline-flex md:justify-self-end"
              >
                {cta.primary}
                <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
              </MotionLink>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="label flex items-center gap-3 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-px w-6 bg-ink" />
              <span className="block h-px w-4 self-end bg-ink" />
            </span>
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-charcoal text-cream"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="gutter flex items-center justify-between py-6">
              <img src={brand.logo.light} alt={brand.name} width={88} height={32} className="h-8 w-auto" />
              <button type="button" className="label" onClick={() => setOpen(false)} autoFocus>
                Close
              </button>
            </div>
            {/* dieline guide behind the menu — the menu is a sheet laid on the table */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-15" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M12 0V100M88 0V100M0 30H100M0 78H100" stroke="#F3EEE4" strokeWidth="0.15" strokeDasharray="1 1" fill="none" />
            </svg>
            <ul className="gutter relative mt-8 flex flex-1 flex-col justify-center gap-2">
              {nav.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <MotionLink
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline gap-4 py-1 text-[clamp(36px,11vw,96px)]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.07 }}
                  >
                    <span className="label text-copper">0{i + 1}</span>
                    {n.label}
                  </MotionLink>
                </li>
              ))}
            </ul>
            <div className="gutter relative flex flex-col gap-2 pb-10">
              <a href={`mailto:${brand.email}`} className="label text-cream/80">{brand.email}</a>
              <a href={brand.phoneHref} className="label text-cream/80">{brand.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
