import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ToolSection from '../components/ToolSection';
import HowToUse from '../components/HowToUse';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { toolCategories } from '../data/siteData';
import { scrollToSection } from '../utils/scrollToSection';

function HomePage({ scrollTarget = null }) {
  useEffect(() => {
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [scrollTarget]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {toolCategories.map((category) => (
          <ToolSection key={category.id} {...category} />
        ))}
        <HowToUse />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
