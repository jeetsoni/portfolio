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
import { getChannelVideos } from "@/lib/channel";

// hourly: new Avesta posts and SynapByte uploads show up without a deploy
export const revalidate = 3600;

export default async function Home() {
  const [posts, videos] = await Promise.all([getPosts(), getChannelVideos()]);

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
        <Educator videos={videos} />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
