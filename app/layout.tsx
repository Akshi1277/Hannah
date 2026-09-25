import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import Providers from "./components/Providers";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingCta from "./components/FloatingCta";
import Cursor from "./components/Cursor";
import { brand } from "./content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: "Hannah Pixels | Luxury Print & Packaging House Worldwide",
    template: "%s | Hannah Pixels",
  },
  description: brand.seoDescription,
  keywords: [
    "Hannah Pixels",
    "HannahPixels",
    "hannahpixels.com",
    "Luxury Packaging",
    "Custom Packaging Manufacturer",
    "Rigid Box Manufacturer",
    "Fragrance Packaging",
    "Perfume Boxes",
    "Cosmetic Packaging",
    "Chocolate & Confectionery Packaging",
    "Bespoke Paper Bags",
    "Luxury Print House",
    "Book Printing & Publishing",
    "Foil Stamping Packaging",
    "Embossed Paper Packaging",
    "Worldwide Packaging Production",
  ],
  applicationName: "Hannah Pixels",
  appleWebApp: {
    title: "Hannah Pixels",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: brand.name,
    title: "Hannah Pixels | Luxury Print & Packaging House Worldwide",
    description: brand.seoDescription,
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 670,
        alt: "Hannah Pixels — Luxury print and packaging still life featuring bespoke rigid boxes, fragrance cartons, and fine papers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hannah Pixels | Luxury Print & Packaging House Worldwide",
    description: brand.seoDescription,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${brand.url}/#website`,
      "url": brand.url,
      "name": "Hannah Pixels",
      "alternateName": ["HannahPixels", "Hannah Pixels Print & Packaging", "hannahpixels.com"],
      "description": "Where ideas take form. Luxury print and packaging house creating considered physical experiences for brands worldwide.",
      "publisher": {
        "@id": `${brand.url}/#organization`,
      },
      "inLanguage": "en",
    },
    {
      "@type": "Organization",
      "@id": `${brand.url}/#organization`,
      "name": brand.name,
      "legalName": "Hannah Pixels",
      "alternateName": ["HannahPixels", "Hannah Pixels Packaging", "Hannah Pixels Print & Packaging House"],
      "url": brand.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${brand.url}${brand.logo.dark}`,
        "caption": "Hannah Pixels Logo",
      },
      "image": `${brand.url}/og.jpg`,
      "description": brand.description,
      "slogan": brand.tagline,
      "email": brand.email,
      "telephone": brand.phone,
      "parentOrganization": {
        "@type": "Organization",
        "name": "BRAHM Global Holdings",
        "url": "https://brahmglobalholdings.com",
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "email": brand.email,
          "telephone": brand.phone,
          "contactType": "sales",
          "areaServed": "Worldwide",
          "availableLanguage": ["English", "Hindi"],
        },
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Print & Packaging Capabilities",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Luxury Rigid Box Packaging",
              "description": "Custom rigid boxes with magnetic closures, shoulder boxes, and presentation packaging.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Fragrance & Beauty Packaging",
              "description": "Secondary packaging, perfume cartons, beauty boxes with custom velvet and foam inserts.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Chocolate & Confectionery Packaging",
              "description": "Food-grade certified presentation boxes, multi-tier chocolate packaging, and bespoke sleeves.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bespoke Paper & Carry Bags",
              "description": "Luxury retail shopping bags with custom handles, grosgrain ribbons, and specialty textures.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Books & Editorial Publishing",
              "description": "Hardcover books, coffee table editions, lookbooks, and custom slipcases.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Specialty Foiling & Embossing Finishes",
              "description": "Precision hot foil stamping, blind and multi-level embossing, debossing, and specialty textures.",
            },
          },
        ],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <Nav />
          {children}
          <Footer />
          <FloatingCta />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
