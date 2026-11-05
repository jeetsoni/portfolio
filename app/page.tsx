import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBand from "@/components/StatsBand";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import VelocityBand from "@/components/VelocityBand";
import Writing from "@/components/Writing";
import Educator from "@/components/Educator";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { getPosts } from "@/lib/writing";

// matches WRITING_REVALIDATE: new Avesta posts show up within the hour
export const revalidate = 3600;

export default async function Home() {
  const posts = await getPosts();

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
        <Writing posts={posts} />
        <Educator />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
