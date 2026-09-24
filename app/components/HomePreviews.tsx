"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { about, brand, contact, contactHref, cta, process, standard } from "../content";
import { Arrow, CtaButton, EASE, FadeUp, MaskLines, SectionLabel } from "./primitives";

/** Underlined text link with an arrow, used for "see more" moments on the home page. */
export function MoreLink({ href, children, tone = "ink" }: { href: string; children: React.ReactNode; tone?: "ink" | "cream" }) {
  return (
    <Link
      href={href}
      className={`label group inline-flex items-center gap-3 py-2 ${tone === "cream" ? "text-cream" : "text-ink"}`}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-50 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </span>
      <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}

const STAGE_PHOTOS = [
  "/img/story/process-discover.jpg",
  "/img/story/process-develop.jpg",
  "/img/story/process-refine.jpg",
  "/img/story/process-produce.jpg",
  "/img/story/process-finish.jpg",
  "/img/story/process-deliver.jpg",
];

/** Six stages at a glance: one row of photographs that leads to the full Process page. */
export function ProcessPreview() {
  return (
    <section aria-labelledby="process-preview-title" className="relative bg-cream py-[14vh]">
      <div className="gutter">
        <SectionLabel className="mb-8">{process.label}</SectionLabel>
        <div className="grid gap-8 md:grid-cols-12">
          <MaskLines
            id="process-preview-title"
            lines={process.title}
            className="display text-[clamp(44px,6.4vw,112px)] text-ink md:col-span-7"
          />
          <FadeUp className="self-end md:col-span-4 md:col-start-9">
            <p className="text-[17px] leading-relaxed text-ink-2">{process.body}</p>
            <div className="mt-6">
              <MoreLink href="/process/">See the full process</MoreLink>
            </div>
          </FadeUp>
        </div>
      </div>

      <ol className="mt-[8vh] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(16px,4vw,64px)] pb-4 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
        {process.stages.map((s, i) => (
          <motion.li
            key={s.n}
            className="w-[64vw] shrink-0 snap-start md:w-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }}
          >
            <Link href="/process/" className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream-2">
                <img
                  src={STAGE_PHOTOS[i]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <span className="label absolute left-3 top-3 text-[10px] text-cream [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">{s.n}</span>
              </div>
              <p className="mt-4 text-[20px] font-bold uppercase tracking-[-0.02em] text-ink">{s.title}</p>
              <p className="mt-1 line-clamp-3 text-[14px] leading-snug text-ink-2">{s.body}</p>
            </Link>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/** The manifesto headline with the four principles beneath it: one screen, then on to /about. */
export function AboutPreview() {
  return (
    <section aria-labelledby="about-preview-title" className="relative bg-cream py-[14vh]">
      <div className="gutter">
        <SectionLabel className="mb-8">About — Manifesto</SectionLabel>
        <div className="grid gap-8 md:grid-cols-12">
          <h2 id="about-preview-title" className="display text-[clamp(40px,5.6vw,100px)] text-ink md:col-span-8">
            {about.title.map((l, i) => (
              <span key={l} className={`block ${i === about.title.length - 1 ? "text-copper" : ""}`}>
                {l}
              </span>
            ))}
          </h2>
          <FadeUp className="self-end md:col-span-4">
            <p className="text-[17px] leading-relaxed text-ink-2">
              {about.body[0]} {about.body[1]}
            </p>
            <div className="mt-6">
              <MoreLink href="/about/">Read the manifesto</MoreLink>
            </div>
          </FadeUp>
        </div>

        <p className="label mt-[10vh] text-ink-2">{standard.label}</p>
        <ol className="mt-6 grid border-t border-hair sm:grid-cols-2 lg:grid-cols-4">
          {standard.principles.map((p, i) => (
            <motion.li
              key={p.n}
              className="border-b border-hair py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:pl-8 lg:first:pl-0 lg:last:border-r-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
            >
              <span className="label text-copper">{p.n}</span>
              <p className="display mt-4 text-[clamp(34px,3.4vw,56px)] text-ink">{p.word}</p>
              <p className="mt-5 text-[16px] font-semibold uppercase tracking-[-0.01em] text-ink">{p.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Closing call to action on the home page; the full form lives on /contact. */
export function ContactPrompt() {
  return (
    <section id="contact" aria-labelledby="contact-prompt-title" className="relative bg-cream pb-[16vh] pt-[10vh]">
      <div className="gutter">
        <SectionLabel className="mb-8">Contact — Start a project</SectionLabel>
        <MaskLines id="contact-prompt-title" lines={contact.title} className="display text-[clamp(52px,10vw,184px)] text-ink" />
        <div className="mt-[8vh] grid gap-10 md:grid-cols-12">
          <FadeUp className="md:col-span-5">
            {contact.body.map((b, k) => (
              <p key={k} className={k === 0 ? "text-[24px] font-semibold tracking-[-0.02em] text-ink" : "mt-3 text-[17px] leading-relaxed text-ink-2"}>
                {b}
              </p>
            ))}
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-col gap-6 md:col-span-6 md:col-start-7 md:items-end">
            <CtaButton href={contactHref}>{cta.primary}</CtaButton>
            <div className="flex flex-col gap-1 md:items-end">
              <a href={`mailto:${brand.email}`} className="text-[18px] font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-copper">
                {brand.email}
              </a>
              <a href={brand.phoneHref} className="text-[18px] text-ink-2 hover:text-ink">
                {brand.phone}
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
