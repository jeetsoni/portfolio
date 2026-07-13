import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBand from "@/components/StatsBand";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import VelocityBand from "@/components/VelocityBand";
import Educator from "@/components/Educator";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <StatsBand />
        <About />
        <Experience />
        <VelocityBand text="Selected Work" />
        <Projects />
        <Educator />
        <Skills />
        <VelocityBand text="Let's Talk" />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
