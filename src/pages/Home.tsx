import { useEffect } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import About from '../components/About';
import Expertise from '../components/Expertise';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import { usePortfolio } from '../lib/PortfolioContext';

export default function Home() {
  const { data, loading } = usePortfolio();

  useEffect(() => {
    if (data?.hero.name) {
      document.title = `${data.hero.name} | Premium Landing Page Designer`;
    }
  }, [data]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white font-mono uppercase tracking-[0.5em] text-xs animate-pulse">
        Initializing Creative Environment...
      </div>
    );
  }

  return (
    <Layout>
      <Hero />
      <div className="relative">
        {/* Background elements that span sections */}
        <div className="absolute top-0 right-0 w-1/3 h-[2000px] bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
        <About />
        <Expertise />
        <Projects />
        <Contact />
      </div>
    </Layout>
  );
}
