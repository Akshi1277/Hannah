"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, contact, cta } from "../content";
import { Arrow, EASE, FadeUp, Magnetic, MaskLines, RegMark } from "./primitives";

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  quantity: string;
  message: string;
};

const EMPTY: Fields = { name: "", company: "", email: "", phone: "", projectType: "", quantity: "", message: "" };

export function buildEnquiry(f: Fields) {
  const rows = [
    `Name: ${f.name.trim()}`,
    f.company.trim() && `Company: ${f.company.trim()}`,
    `Email: ${f.email.trim()}`,
    f.phone.trim() && `Phone: ${f.phone.trim()}`,
    `Project type: ${f.projectType}`,
    f.quantity.trim() && `Approximate quantity: ${f.quantity.trim()}`,
  ].filter(Boolean);
  const text = ["Hello Hannah Pixels, I'd like to start a project.", "", ...rows, "", f.message.trim()].join("\n");
  return {
    text,
    whatsapp: `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`,
    mailto: `mailto:${brand.email}?subject=${encodeURIComponent(`Project enquiry — ${f.projectType || "Hannah Pixels"}`)}&body=${encodeURIComponent(text)}`,
  };
}

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = "Please tell us your name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.phone && !/^[+\d][\d\s()-]{6,}$/.test(f.phone.trim())) e.phone = "Please check the phone number.";
  if (!f.projectType) e.projectType = "Choose the closest project type.";
  if (f.message.trim().length < 10) e.message = "A sentence or two about the project helps.";
  return e;
}

export default function Contact() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState<null | { whatsapp: string; mailto: string }>(null);

  const set = (k: keyof Fields) => (v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    const q = buildEnquiry(f);
    setSent(q);
    window.open(q.whatsapp, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-cream pb-[14vh] pt-[16vh]">
      <div className="gutter">
        <p className="label mb-10 flex items-center gap-3 text-ink-2">
          <RegMark className="h-3 w-3" /> Contact — Start a project
        </p>
        <MaskLines id="contact-title" lines={contact.title} className="display text-[clamp(56px,11vw,200px)] text-ink" />

        <div className="mt-[10vh] grid gap-16 lg:grid-cols-12">
          <FadeUp className="lg:col-span-4">
            {contact.body.map((b, k) => (
              <p key={k} className={k === 0 ? "text-[24px] font-semibold tracking-[-0.02em] text-ink" : "mt-3 text-[17px] leading-relaxed text-ink-2"}>
                {b}
              </p>
            ))}
            <dl className="mt-10 space-y-5 border-t border-hair pt-8">
              <div>
                <dt className="label text-muted">Email</dt>
                <dd><a className="text-[20px] font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-copper" href={`mailto:${brand.email}`}>{brand.email}</a></dd>
              </div>
              <div>
                <dt className="label text-muted">Phone / WhatsApp</dt>
                <dd><a className="text-[20px] font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-copper" href={brand.phoneHref}>{brand.phone}</a></dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <a href={`mailto:${brand.email}`} className="label group inline-flex items-center gap-3 rounded-full border border-ink/30 px-5 py-3 text-ink transition-colors hover:border-ink">
                  {cta.getInTouch} <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </Magnetic>
            </div>
          </FadeUp>

          <form noValidate onSubmit={submit} className="lg:col-span-7 lg:col-start-6" aria-describedby="form-note">
            <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
              <Field id="name" label="Name" required value={f.name} onChange={set("name")} error={errors.name} autoComplete="name" />
              <Field id="company" label="Company" value={f.company} onChange={set("company")} autoComplete="organization" />
              <Field id="email" label="Email" type="email" required value={f.email} onChange={set("email")} error={errors.email} autoComplete="email" />
              <Field id="phone" label="Phone" type="tel" value={f.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
              <SelectField id="projectType" label="Project type" value={f.projectType} onChange={set("projectType")} error={errors.projectType} options={contact.projectTypes} />
              <Field id="quantity" label="Approximate quantity" value={f.quantity} onChange={set("quantity")} inputMode="numeric" />
              <div className="md:col-span-2">
                <Field id="message" label="Message" multiline required value={f.message} onChange={set("message")} error={errors.message} />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p id="form-note" className="label max-w-[340px] leading-relaxed text-muted">
                {contact.disclaimer} Submitting opens WhatsApp with your enquiry prefilled.
              </p>
              <Magnetic strength={0.35}>
                <button
                  type="submit"
                  className="label group inline-flex items-center gap-5 rounded-full bg-ink py-5 pl-8 pr-6 !text-[12px] text-cream transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:bg-copper"
                >
                  {cta.primary}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-[-45deg]">
                    <Arrow className="h-2.5 w-4" />
                  </span>
                </button>
              </Magnetic>
            </div>

            <AnimatePresence>
              {sent && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mt-8 border-l-2 border-copper bg-cream px-5 py-4 text-[15px] leading-relaxed text-ink-2"
                >
                  Your enquiry is ready in WhatsApp. If it didn&apos;t open,{" "}
                  <a className="font-semibold text-ink underline underline-offset-4" href={sent.whatsapp} target="_blank" rel="noopener noreferrer" data-testid="wa-link">
                    open WhatsApp
                  </a>{" "}
                  or{" "}
                  <a className="font-semibold text-ink underline underline-offset-4" href={sent.mailto}>
                    send it by email to {brand.email}
                  </a>
                  .
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}

function Shell({ id, label, required, error, filled, children }: { id: string; label: string; required?: boolean; error?: string; filled: boolean; children: ReactNode }) {
  return (
    <div className="group relative pb-7 pt-6">
      <label
        htmlFor={`f-${id}`}
        className={`pointer-events-none absolute left-0 origin-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          filled ? "top-0 text-[11px] tracking-[0.14em] text-muted" : "top-9 text-[18px] text-ink-2"
        } group-focus-within:top-0 group-focus-within:text-[11px] group-focus-within:tracking-[0.14em] group-focus-within:text-copper font-[family-name:var(--font-mono)] uppercase`}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      <span className="absolute bottom-7 left-0 h-px w-full bg-ink/20" aria-hidden="true" />
      <span
        className={`absolute bottom-7 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100 ${error ? "scale-x-100 bg-[#A2412E]" : "bg-copper"}`}
        aria-hidden="true"
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`e-${id}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-1 left-0 text-[13px] text-[#A2412E]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = "block w-full bg-transparent pb-2 pt-3 text-[18px] text-ink outline-none placeholder:text-transparent";

function Field({
  id, label, value, onChange, error, required, type = "text", multiline, autoComplete, inputMode,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; required?: boolean;
  type?: string; multiline?: boolean; autoComplete?: string; inputMode?: "numeric" | "text";
}) {
  const common = {
    id: `f-${id}`,
    name: id,
    value,
    required,
    "aria-invalid": !!error,
    "aria-describedby": error ? `e-${id}` : undefined,
    className: inputCls,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <Shell id={id} label={label} required={required} error={error} filled={!!value}>
      {multiline ? <textarea {...common} rows={4} className={`${inputCls} resize-none`} /> : <input {...common} type={type} autoComplete={autoComplete} inputMode={inputMode} />}
    </Shell>
  );
}

function SelectField({ id, label, value, onChange, error, options }: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; options: string[] }) {
  return (
    <Shell id={id} label={label} required error={error} filled={!!value}>
      <select
        id={`f-${id}`}
        name={id}
        value={value}
        required
        aria-invalid={!!error}
        aria-describedby={error ? `e-${id}` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none ${value ? "" : "text-transparent"}`}
      >
        <option value="" disabled hidden></option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <Arrow className="pointer-events-none absolute bottom-10 right-0 rotate-90 text-ink-2" />
    </Shell>
  );
}
