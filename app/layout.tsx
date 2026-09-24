import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import Providers from "./components/Providers";
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
  title: brand.seoTitle,
  description: brand.seoDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: brand.name,
    title: brand.seoTitle,
    description: brand.seoDescription,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 670,
        alt: "Finished rigid box, fragrance carton, paper bag and book arranged as a still life in a warm studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.seoTitle,
    description: brand.seoDescription,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: brand.url,
  email: brand.email,
  telephone: brand.phone,
  description: brand.description,
  slogan: brand.tagline,
  logo: `${brand.url}${brand.logo.dark}`,
  contactPoint: {
    "@type": "ContactPoint",
    email: brand.email,
    telephone: brand.phone,
    contactType: "sales",
    areaServed: "Worldwide",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
