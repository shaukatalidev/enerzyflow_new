import Hero from '@/components/Hero';
import ProductExplorer from '@/components/ProductExplorer';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import About from '@/components/About';
import Video from '@/components/Vedio';
import MiddleHero from '@/components/MiddleHero';
import CustomCursor from '@/components/CustomCursor';

import Loader from '@/components/Loader';

export default function Home() {
  return (
    <main className="bg-dark text-white overflow-x-hidden cursor-none min-h-screen">
      <CustomCursor />
      <Loader />
      <Hero />
      <MiddleHero />
      <ProductExplorer />
      
      <Video />
      <About />
      <BrandLogos />
      <Testimonials />
    </main>
  );
}
