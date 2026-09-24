"use client";

import { motion } from "framer-motion";
import { brand, capabilities, footer } from "../content";
import { EASE } from "./primitives";

const colLabel = "mb-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-cream/45";
const link = "text-[17px] text-cream/85 transition-colors duration-300 hover:text-copper";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#141210] text-cream">
      {/* HANNAH watermark: a light serif, barely lifted off the page and cut by the bottom edge */}
      <motion.p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 select-none whitespace-nowrap text-center font-[family-name:var(--font-serif)] text-[clamp(64px,21.5vw,460px)] font-light uppercase leading-[0.8] tracking-[0.03em] text-cream/[0.045]"
        initial={{ opacity: 0, y: "55%" }}
        whileInView={{ opacity: 1, y: "40%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {footer.watermark}
      </motion.p>

      <div className="gutter pb-10 pt-[12vh] md:pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-0">
          {/* sign-off */}
          <div className="lg:col-span-4 lg:pr-10">
            <img src={brand.logo.light} alt={brand.name} width={165} height={60} className="mb-10 h-11 w-auto opacity-90" loading="lazy" />
            <p className="font-[family-name:var(--font-serif)] text-[clamp(44px,4.4vw,68px)] font-light leading-[1.02]">
              {footer.signoff[0]}
              <br />
              <em className="text-[#C39A6B]">{footer.signoff[1]}</em>
            </p>
            <p className="mt-8 text-[17px] text-cream/65">{footer.strap}</p>
          </div>

          {/* sitemap */}
          <nav aria-label="Footer" className="lg:col-span-2 lg:border-l lg:border-cream/10 lg:pl-8 lg:pl-12">
            <p className={colLabel}>Sitemap</p>
            <ul className="space-y-3">
              {footer.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={link}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* capabilities */}
          <div className="lg:col-span-3 lg:border-l lg:border-cream/10 lg:pl-8 lg:pl-12">
            <p className={colLabel}>Capabilities</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {capabilities.map((c) => (
                <li key={c.n}>
                  <a href="#capabilities" className={`${link} leading-snug`}>{c.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* enquiries */}
          <div className="lg:col-span-3 lg:border-l lg:border-cream/10 lg:pl-8 lg:pl-12">
            <p className={colLabel}>Enquiries</p>
            <a href={`mailto:${brand.email}`} className="block whitespace-nowrap text-[17px] text-[#C39A6B] transition-colors hover:text-cream">
              {brand.email}
            </a>
            <a href={brand.phoneHref} className={`${link} mt-2 block`}>{brand.phone}</a>
            <p className="mt-3 text-[15px] leading-snug text-cream/50">{footer.enquiriesNote}</p>
          </div>
        </div>

        <div className="mt-[14vh] flex flex-col gap-3 border-t border-cream/10 pb-16 pt-6 md:mt-[18vh] md:flex-row md:items-center md:justify-between md:pb-0">
          <p className="text-[15px] text-cream/55">{footer.copyright}</p>
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-cream/55">{footer.sign}</p>
        </div>
      </div>
    </footer>
  );
}
