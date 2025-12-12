'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) =>
        console.log("Video autoplay failed:", err)
      );
    }
  }, []);

  return (
    <section className="relative w-full h-[70vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] overflow-hidden bg-gray-900">

      {/* VIDEO BG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src="/images/hero/vd2.mp4"
          className="
            w-full
            h-full
            object-cover     
            md:object-contain
          "
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col items-center justify-end px-4 pb-8">
        <button
          onClick={() => router.push("/products")}
          className="
            bg-cyan-500 text-white px-8 py-3 rounded-full text-lg font-semibold
            hover:bg-cyan-600 cursor-pointer shadow-lg 
            hover:shadow-xl transform hover:scale-105 transition-all
          "
        >
          Shop Now
        </button>
      </div>

    </section>
  );
};

export default Hero;
