import type { Metadata } from "next";
import { pages } from "../content";
import Process from "../components/Process";
import PrintSpeaks from "../components/PrintSpeaks";

export const metadata: Metadata = {
  title: { absolute: pages.process.title },
  description: pages.process.description,
  alternates: { canonical: "/process/" },
  openGraph: { title: pages.process.title, description: pages.process.description, url: "/process/" },
};

export default function Page() {
  return (
    <main id="main" className="pt-[14vh] md:pt-[16vh]">
      <Process />
      <PrintSpeaks />
    </main>
  );
}
