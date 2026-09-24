"use client";

import { motion } from "framer-motion";
import { brand, capabilities, footer } from "../content";
import { EASE, RegMark } from "./primitives";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal pb-28 pt-[14vh] text-cream md:pb-10">
      <div className="gutter">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src={brand.logo.light} alt={brand.name} width={220} height={80} className="mb-10 h-14 w-auto md:h-16" loading="lazy" />
            {footer.lines.map((l, k) => (
              <p key={l} className={k === 0 ? "text-[26px] font-semibold tracking-[-0.02em]" : "mt-2 text-[16px] text-cream/65"}>{l}</p>
            ))}
            <div className="mt-8 space-y-1">
              <a href={`mailto:${brand.email}`} className="block text-[17px] hover:text-copper">{brand.email}</a>
              <a href={brand.phoneHref} className="block text-[17px] hover:text-copper">{brand.phone}</a>
            </div>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="label mb-5 text-cream/45">Navigate</p>
            <ul className="space-y-2">
              {footer.nav.map((n) => (
                <li key={n.href}><a href={n.href} className="text-[16px] text-cream/85 hover:text-copper">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="label mb-5 text-cream/45">Capabilities</p>
            <ul className="space-y-2">
              {capabilities.map((c) => (
                <li key={c.n}><a href="#capabilities" className="text-[16px] text-cream/85 hover:text-copper">{c.title}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-[12vh] overflow-hidden px-2" aria-hidden="true">
        <motion.p
          className="display whitespace-nowrap text-center text-[clamp(64px,19.5vw,420px)] leading-[0.8]"
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          Hannah
        </motion.p>
        <motion.p
          className="display whitespace-nowrap text-center text-[clamp(64px,19.5vw,420px)] leading-[0.8] text-copper"
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
        >
          Pixels
        </motion.p>
      </div>
      <p className="sr-only">Hannah Pixels</p>

      <div className="gutter mt-10 flex flex-col gap-3 border-t border-cream/10 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="label text-cream/55">{footer.copyright}</p>
        <p className="label flex items-center gap-3 text-cream/55"><RegMark className="h-3 w-3 text-copper" /> {footer.sign}</p>
      </div>
    </footer>
  );
}
