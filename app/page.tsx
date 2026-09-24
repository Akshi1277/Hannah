import ScrollHero from "./components/ScrollHero";
import Intro from "./components/Intro";
import Capabilities from "./components/Capabilities";
import { AboutPreview, ContactPrompt, ProcessPreview } from "./components/HomePreviews";

// Home: the cinematic hero and a short tour. Each chapter continues on its own page.
// IDEA → MATERIAL → STRUCTURE → PRINT → FINISH → OBJECT → DELIVERY
export default function Home() {
  return (
    <main id="main">
      <ScrollHero />
      <Intro />
      <Capabilities more />
      <ProcessPreview />
      <AboutPreview />
      <ContactPrompt />
    </main>
  );
}
