import ScrollHero from "./components/ScrollHero";
import Nav from "./components/Nav";
import Intro from "./components/Intro";
import Capabilities from "./components/Capabilities";
import Materials from "./components/Materials";
import Process from "./components/Process";
import PrintSpeaks from "./components/PrintSpeaks";
import Standard from "./components/Standard";
import Details from "./components/Details";
import Worldwide from "./components/Worldwide";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingCta from "./components/FloatingCta";
import Cursor from "./components/Cursor";

// IDEA → MATERIAL → STRUCTURE → PRINT → FINISH → OBJECT → DELIVERY
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <ScrollHero />
        <Intro />
        <Capabilities />
        <Materials />
        <Process />
        <PrintSpeaks />
        <Standard />
        <Details />
        <Worldwide />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingCta />
      <Cursor />
    </>
  );
}
