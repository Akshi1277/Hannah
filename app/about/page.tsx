import type { Metadata } from "next";
import { pages } from "../content";
import About from "../components/About";
import Standard from "../components/Standard";
import Worldwide from "../components/Worldwide";

export const metadata: Metadata = {
  title: { absolute: pages.about.title },
  description: pages.about.description,
  alternates: { canonical: "/about/" },
  openGraph: { title: pages.about.title, description: pages.about.description, url: "/about/" },
};

export default function Page() {
  return (
    <main id="main" className="pt-[6vh]">
      <About />
      <Standard />
      <Worldwide />
    </main>
  );
}
