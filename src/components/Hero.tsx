'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
  {
    src: '/images/hero/b1.jpg',
    alt: 'Premium water bottle with a classic design on a clean background',
  },
  {
    src: '/images/hero/b3.jpeg',
    alt: 'Modern style premium water bottle with sleek lines',
  },
  {
    src: '/images/hero/b4.jpg',
    alt: 'Ergonomically designed premium water bottle held in hand',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  useEffect(() => {
    const timer = setInterval(goToNext, 5000); 
    return () => clearInterval(timer);
  }, [goToNext]);

  const currentImage = heroImages[currentIndex];

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <Image
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          priority={currentIndex === 0}
          quality={85}
          sizes="100vw"
          className="object-cover animate-fade-in-zoom" 
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center p-4">
        <div className="text-center text-white animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">
            Brand your own bottled water
          </h1>
          <p className="mt-4 text-lg max-w-md mx-auto">
            Premium water bottles with attitude.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-cyan-600 transition-colors hover:cursor-pointer"
          >
            Shop Now
          </button>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;