'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroVideos = [
  {
    src: "/images/hero/vd1.mp4",
    alt: "Premium water bottle showcase video",
  },
  {
    src: "/images/hero/vd2.mp4",
    alt: "Modern style premium water bottle promotional video",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + heroVideos.length) % heroVideos.length
    );
  }, []);

  // ✅ Handle video ended event to auto-advance
  const handleVideoEnded = useCallback(() => {
    goToNext();
  }, [goToNext]);

  // ✅ Play current video and pause others when index changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          // Play current video
          video.currentTime = 0; // Reset to start
          video.play().catch((error) => {
            console.log("Video autoplay failed:", error);
          });
        } else {
          // Pause other videos
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        {heroVideos.map((video, index) => (
          <video
            key={video.src}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            src={video.src}
            autoPlay={index === 0} // Only autoplay first video initially
            muted // Required for autoplay to work in most browsers
            playsInline // Required for iOS Safari
            onEnded={handleVideoEnded} // Auto-advance when video ends
            preload={index === 0 ? "auto" : "metadata"}
            aria-label={video.alt}
          >
            Your browser does not support the video tag.
          </video>
        ))}
      </div>

      {/* Dark overlay */}
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
          aria-label="Previous video"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all"
          aria-label="Next video"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 flex space-x-3">
          {heroVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
