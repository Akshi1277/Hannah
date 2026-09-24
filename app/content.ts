// Central content configuration for the Hannah Pixels site.
// Edit copy here; components only handle presentation.

export const brand = {
  name: "Hannah Pixels",
  tagline: "Where ideas take form.",
  description:
    "Hannah Pixels is a print and packaging house creating considered physical experiences for brands across the world.",
  seoTitle: "Hannah Pixels | Print & Packaging Worldwide",
  seoDescription:
    "Hannah Pixels creates considered print and packaging for brands worldwide, from luxury rigid boxes and fragrance packaging to bespoke paper bags, publishing and bespoke packaging.",
  url: "https://hannahpixels.com",
  email: "info@hannahpixels.com",
  phone: "+91 70390 38842",
  phoneHref: "tel:+917039038842",
  whatsapp: "917039038842",
  logo: {
    dark: "/brand/logo-dark.png", // terracotta + green, for cream backgrounds
    light: "/brand/logo-white.png", // for charcoal backgrounds
    mark: "/brand/mark-white.png", // monogram only
    ratio: 1820 / 660,
  },
};

export const nav = [
  { label: "Capabilities", href: "/capabilities/" },
  { label: "Process", href: "/process/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const contactHref = "/contact/";

// Per-page metadata for the dedicated pages.
export const pages = {
  capabilities: {
    title: "Capabilities | Hannah Pixels",
    description:
      "Luxury packaging, product packaging, fragrance and beauty, chocolate and confectionery, paper and carry, and books and publishing — with the materials and finishes that bring them together.",
  },
  process: {
    title: "Process | Hannah Pixels",
    description:
      "From first conversation to finished delivery: discover, develop, refine, produce, finish and deliver — and how a printed sheet is built, pass by pass.",
  },
  about: {
    title: "About | Hannah Pixels",
    description:
      "Hannah Pixels was created to bring greater thought, craft and character to the way brands are experienced in the physical world.",
  },
  contact: {
    title: "Start a Project | Hannah Pixels",
    description: "Tell us about your product, your brand and what you have in mind. Enquiries worldwide.",
  },
};

export const cta = {
  primary: "Start a project",
  secondary: "Explore capabilities",
  getInTouch: "Get in touch",
};

export const hero = {
  label: "Print & Packaging House — Worldwide",
  title: ["Where", "ideas", "take form."],
  body: brand.description,
  material: {
    label: "Materials that matter",
    title: "The right material changes everything.",
    body: "The right material can transform how a product is seen, held and remembered.",
  },
  form: {
    label: "From idea to finished piece",
    title: "Flat becomes form.",
    body: "Every project follows a considered sequence, from first conversation to finished delivery. Each stage is an opportunity to refine the detail.",
  },
  final: {
    label: "Hannah Pixels",
    title: ["Made to be", "remembered."],
    body: "Print, packaging and physical brand experiences created with intention.",
  },
};

export const intro = {
  words: ["Designed", "with", "intention."],
  second: "Made to be remembered.",
  body: "Packaging is more than protection. It is the first touch. The first impression. The moment a brand becomes tangible.",
};

export type CapabilityKind = "rigid" | "carton" | "fragrance" | "confection" | "bag" | "book";

export const capabilities: {
  n: string;
  title: string;
  body: string;
  kind: CapabilityKind;
}[] = [
  { n: "01", title: "Luxury Packaging", body: "Packaging created for brands where every detail matters.", kind: "rigid" },
  { n: "02", title: "Product Packaging", body: "Packaging developed around your product and brand.", kind: "carton" },
  { n: "03", title: "Fragrance & Beauty", body: "Packaging for fragrance, beauty and personal care.", kind: "fragrance" },
  { n: "04", title: "Chocolate & Confectionery", body: "Packaging that makes indulgence part of the experience.", kind: "confection" },
  { n: "05", title: "Paper & Carry", body: "Paper products that extend your brand beyond the package.", kind: "bag" },
  { n: "06", title: "Books & Publishing", body: "Print created for stories, ideas and objects worth keeping.", kind: "book" },
];

export const capabilitiesIntro = {
  label: "What we create",
  title: ["Print and packaging", "with purpose."],
  body: "Print and packaging developed around the character, purpose and physical experience of your brand.",
};

export type MaterialKind = "copper" | "leather" | "paper" | "emboss" | "screen";

export const materials: { id: MaterialKind; name: string; note: string }[] = [
  { id: "copper", name: "Copper Foil", note: "Light travels across the foil as you move." },
  { id: "leather", name: "Leather Texture", note: "Grain rises and settles under raking light." },
  { id: "paper", name: "Specialty Paper", note: "Fibres shift as the light changes angle." },
  { id: "emboss", name: "Embossed Handmade Paper", note: "Depth appears only through shadow." },
  { id: "screen", name: "Screen Printing", note: "Ink density builds where you look." },
];

export const materialsIntro = {
  title: ["Materials", "that matter."],
  body: "The right material can transform how a product is seen, held and remembered.",
  journey: ["Paper texture", "Flat sheet", "Dieline", "Folded structure", "Finished packaging"],
};

export const process = {
  label: "05 / The Process",
  title: ["From idea", "to finished", "piece."],
  body: "Every project follows a considered sequence — from first conversation to finished delivery. Each stage is an opportunity to refine the detail.",
  stages: [
    { n: "01", title: "Discover", body: "We begin with your brand, your product and the purpose behind the piece." },
    { n: "02", title: "Develop", body: "Ideas become structures, materials, finishes and considered details." },
    { n: "03", title: "Refine", body: "We explore papers, boards, textures, colours and specialist finishes to find the right combination." },
    { n: "04", title: "Produce", body: "Every piece is produced with precision and close attention to detail." },
    { n: "05", title: "Finish", body: "From embossing and debossing to foiling, speciality papers and bespoke constructions, the final details bring the work together." },
    { n: "06", title: "Deliver", body: "Finished pieces are prepared for delivery across the world." },
  ],
};

export const print = {
  title: "Print that speaks.",
  body: "Every printed surface is an opportunity to communicate something about the brand behind it.",
  layers: ["Layer 1", "Layer 2", "Layer 3", "Foil", "Emboss", "Final print"],
};

export const standard = {
  label: "06 / The Hannah Pixels Standard",
  title: ["The Hannah Pixels", "standard."],
  principles: [
    { n: "01", word: "Thoughtful", title: "Thoughtful by design.", body: "Every decision has a purpose, from the structure of a box to the feel of the paper." },
    { n: "02", word: "Material", title: "Materials that matter.", body: "The right material can transform how a product is seen, held and remembered." },
    { n: "03", word: "Precision", title: "Precision in every detail.", body: "Good packaging should feel effortless. That comes from getting the details right." },
    { n: "04", word: "Lasting", title: "Made to last.", body: "We create pieces designed to be experienced, kept and remembered." },
  ],
};

export const details = {
  title: ["Details make", "the object."],
  list: [
    "Embossing",
    "Debossing",
    "Foiling",
    "Specialty papers",
    "Bespoke constructions",
    "Custom die-cut shapes",
    "Premium wrapping",
    "Structural details",
  ],
};

export const worldwide = {
  title: ["Without", "borders."],
  body: "From a single bespoke project to larger production runs, Hannah Pixels works with brands across markets and delivers worldwide.",
  message: ["One idea.", "Many destinations."],
};

export const about = {
  title: ["To make", "the physical world", "of brands", "more beautiful."],
  body: [
    "We believe packaging is more than protection.",
    "It is the first touch. The first impression. The moment a brand becomes tangible.",
    "Hannah Pixels was created to bring greater thought, craft and character to the way brands are experienced in the physical world.",
  ],
};

export const contact = {
  title: ["Let's make", "something", "tangible."],
  body: ["Have a project in mind?", "Tell us about your product, your brand and what you have in mind."],
  projectTypes: [
    "Luxury Packaging",
    "Product Packaging",
    "Fragrance & Beauty",
    "Chocolate & Confectionery",
    "Paper & Carry",
    "Books & Publishing",
    "Bespoke Project",
    "Other",
  ],
  disclaimer: "This enquiry does not constitute a confirmed production order.",
};

export const footer = {
  lines: ["Where ideas take form.", "Design, print and packaging worldwide."],
  signoff: ["Where ideas", "take form."],
  strap: "Design, print and packaging worldwide.",
  enquiriesNote: "Worldwide enquiries welcome.",
  watermark: "Hannah",
  nav: [
    { label: "Home", href: "/" },
    { label: "Capabilities", href: "/capabilities/" },
    { label: "Process", href: "/process/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
  copyright: "© 2026 Hannah Pixels. All rights reserved.",
  sign: "Design · Print · Packaging Worldwide.",
};
