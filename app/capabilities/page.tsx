import type { Metadata } from "next";
import { pages } from "../content";
import Capabilities from "../components/Capabilities";
import Materials from "../components/Materials";
import Details from "../components/Details";

export const metadata: Metadata = {
  title: { absolute: pages.capabilities.title },
  description: pages.capabilities.description,
  alternates: { canonical: "/capabilities/" },
  openGraph: { title: pages.capabilities.title, description: pages.capabilities.description, url: "/capabilities/" },
};

export default function Page() {
  return (
    <main id="main" className="pt-[14vh] md:pt-[16vh]">
      <Capabilities />
      <Materials />
      <Details />
    </main>
  );
}
