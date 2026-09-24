import type { Metadata } from "next";
import { pages } from "../content";
import Contact from "../components/Contact";

export const metadata: Metadata = {
  title: { absolute: pages.contact.title },
  description: pages.contact.description,
  alternates: { canonical: "/contact/" },
  openGraph: { title: pages.contact.title, description: pages.contact.description, url: "/contact/" },
};

export default function Page() {
  return (
    <main id="main" className="pt-[6vh]">
      <Contact />
    </main>
  );
}
