import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "../content";

export const metadata: Metadata = {
  title: "Privacy Policy | Hannah Pixels",
  description: "Privacy policy, confidentiality safeguards, and data protection commitments for Hannah Pixels bespoke print and packaging clients worldwide.",
  alternates: { canonical: "/privacy/" },
  openGraph: {
    title: "Privacy Policy | Hannah Pixels",
    description: "Privacy policy and client confidentiality commitments for Hannah Pixels print & packaging house.",
    url: "/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="min-h-screen bg-cream text-charcoal pt-32 pb-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow & Header */}
        <div className="border-b border-charcoal/10 pb-10 mb-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-copper mb-4">
            Legal &amp; Trust Anchor
          </p>
          <h1 className="display text-[clamp(36px,5vw,64px)] leading-[1.08] text-charcoal mb-6">
            Privacy Policy &amp; Confidentiality
          </h1>
          <p className="text-[17px] text-charcoal/70 max-w-2xl leading-relaxed">
            Where ideas take form with structural integrity and utmost discretion. We treat proprietary brand dielines, artwork, and client information with strict confidentiality.
          </p>
          <p className="text-[13px] font-mono text-charcoal/50 mt-4">
            Last Updated: September 2026 | Effective for all global production contracts and inquiries
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12 text-[16px] text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="display text-2xl text-charcoal mb-3">1. Data Controller &amp; Corporate Identity</h2>
            <p>
              Hannah Pixels is an international print and packaging house operating under <strong>BRAHM Global Holdings</strong>. We design, engineer, and manufacture custom luxury rigid boxes, folding cartons, fragrance packaging, paper bags, and bespoke publishing objects for brands across the world.
            </p>
            <p className="mt-3">
              For any data privacy inquiries, you may contact our compliance team directly at{" "}
              <a href="mailto:info@hannahpixels.com" className="text-copper underline underline-offset-4">
                info@hannahpixels.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">2. Proprietary Artwork &amp; Design Confidentiality</h2>
            <p>
              We understand that packaging design represents the core tangible identity of your brand. All vector artwork, custom dielines, structural mockups, foil stamping plates, and embossing dies submitted to Hannah Pixels are held under strict non-disclosure.
            </p>
            <p className="mt-3">
              We never share, license, or repurpose proprietary client dielines or artwork with any third parties or competing brands without your prior written authorization.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">3. Information We Collect</h2>
            <p>When you start a project, request quotation samples, or collaborate with our engineering team, we collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li><strong>Contact Information:</strong> Name, professional email address, corporate telephone number, and company name.</li>
              <li><strong>Project Specifications:</strong> Packaging dimensions, material selections, finish preferences, unit quantities, and delivery targets.</li>
              <li><strong>Production Files:</strong> Adobe Illustrator dielines, PDF print files, colour targets (Pantone PMS), and brand typography guidelines.</li>
              <li><strong>Logistics Data:</strong> Delivery addresses, customs clearance details, and freight handling instructions.</li>
            </ul>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">4. How We Use Client Information</h2>
            <p>Collected information is used strictly to fulfill manufacturing obligations, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Generating accurate production estimates and cost analyses.</li>
              <li>Preparing structural unprinted white samples and printed wet proofs.</li>
              <li>Operating high-precision offset, screen printing, foiling, and die-cutting machinery.</li>
              <li>Coordinating door-to-door international freight and customs logistics.</li>
            </ul>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">5. Data Retention &amp; Security Measures</h2>
            <p>
              Digital artwork and structural project files are stored in access-controlled environments with encrypted off-site backups. We retain past production dielines to facilitate seamless repeat production runs and quality parity across manufacturing batches. Clients may request complete archival deletion of design files at any time upon project completion.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">6. International Transfers &amp; Logistics</h2>
            <p>
              Because Hannah Pixels delivers worldwide, fulfillment may require sharing consignment weight, recipient address, and commercial invoices with bonded logistics partners (such as DHL Express, FedEx, or dedicated sea-freight forwarders). These partners are contractually bound to use recipient data solely for customs clearance and transport.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-charcoal mb-3">7. Your Rights &amp; Regulatory Compliance</h2>
            <p>
              Under global data protection standards (including UK GDPR and Indian DPDP guidelines), you have the right to access, rectify, or request deletion of personal information held by Hannah Pixels. To exercise these rights, submit your request to <strong>info@hannahpixels.com</strong>.
            </p>
          </section>

          <section className="pt-6 border-t border-charcoal/10">
            <h2 className="display text-2xl text-charcoal mb-3">8. Contact Information</h2>
            <p>
              For questions regarding our privacy commitments or to request a mutual Non-Disclosure Agreement (NDA) prior to sending packaging specs:
            </p>
            <div className="mt-4 p-6 bg-charcoal/5 rounded-lg border border-charcoal/10">
              <p className="font-semibold text-charcoal">Hannah Pixels — Client Care &amp; Legal</p>
              <p className="mt-1">Email: <a href="mailto:info@hannahpixels.com" className="text-copper">info@hannahpixels.com</a></p>
              <p>Telephone: <a href={brand.phoneHref} className="text-copper">{brand.phone}</a></p>
              <p className="mt-2 text-sm text-charcoal/60">Registered Group: BRAHM Global Holdings</p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-16 pt-8 border-t border-charcoal/10">
          <Link href="/" className="inline-flex items-center gap-2 text-[15px] font-semibold text-charcoal hover:text-copper transition-colors">
            <span>&larr;</span> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
