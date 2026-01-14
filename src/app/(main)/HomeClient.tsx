"use client";

import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import MiddleHero from "@/components/MiddleHero";
import ProductExplorer from "@/components/ProductExplorer";
import Video from "@/components/Vedio";
import About from "@/components/About";
import BrandLogos from "@/components/BrandLogos";
import Testimonials from "@/components/Testimonials";

export default function HomeClient() {
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
