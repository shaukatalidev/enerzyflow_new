'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="
        relative w-full overflow-hidden bg-black
        h-[60vh] sm:h-[70vh] md:h-[85vh] lg:h-screen
      "
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/images/hero/kolkata.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="
          absolute inset-0
          w-full h-full
          object-cover
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div
        className="
          relative z-10
          h-full
          flex items-end justify-center
          pb-8 sm:pb-12 md:pb-16
          px-4
        "
      >
        <button
          onClick={() => router.push("/products")}
          className="
            bg-cyan-500 text-white
            px-6 sm:px-8 md:px-10
            py-2.5 sm:py-3 md:py-3.5
            text-base sm:text-lg
            font-semibold
            rounded-full
            shadow-lg
            transition-all duration-300
            hover:bg-cyan-600
            hover:shadow-xl
            hover:scale-105
            active:scale-95
          "
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
