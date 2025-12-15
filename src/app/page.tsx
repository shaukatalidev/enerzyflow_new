import Hero from '@/components/Hero';
import ProductExplorer from '@/components/ProductExplorer';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import About from '@/components/About';
import Video from '@/components/Vedio';
import MiddleHero from '@/components/MiddleHero';
import CustomCursor from '@/components/CustomCursor';
export default function Home() {
  return (
    <main className="background-color: #050505; color: #fff; overflow-x: hidden; cursor: none;">
      <CustomCursor />
      <Hero />
      <MiddleHero />
      <ProductExplorer />
      <BrandLogos/>
      <Video/>
      <About/>
      <Testimonials />
    </main>
  );
}