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
    <section className="relative w-full h-[70vh] sm:h-[75vh] md:h-[90vh] lg:h-[100vh] overflow-hidden bg-black">

      {/* VIDEO BG */}
      <video
        ref={videoRef}
        src="/images/hero/vd2.mp4"
        className="
          absolute inset-0
          w-full h-full
          object-cover
        "
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-end justify-center px-4 pb-8">
        <button
          onClick={() => router.push("/products")}
          className="
            bg-cyan-500 text-white px-8 py-3 rounded-full text-lg font-semibold
            hover:bg-cyan-600 shadow-lg hover:shadow-xl
            transform hover:scale-105 transition-all
          "
        >
          Shop Now
        </button>
      </div>

    </section>
  );
};

export default Hero;
