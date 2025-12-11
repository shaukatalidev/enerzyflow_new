import Hero from '@/components/Hero';
import ProductExplorer from '@/components/ProductExplorer';
import Testimonials from '@/components/Testimonials';
import BrandLogos from '@/components/BrandLogos';
import About from '@/components/About';
import Video from '@/components/Vedio';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <ProductExplorer />
      <BrandLogos/>
      <Video/>
      <About/>
      <Testimonials />
    </main>
  );
}