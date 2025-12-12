'use client';

import { useEffect, useRef } from "react";

const Vedio = () => {
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
    <section className="w-full bg-gray-900 py-10 flex justify-center px-4">
      <div
        className="
          w-full max-w-7xl
          h-[220px]       
          sm:h-[300px]    
          md:h-[400px]    
          lg:h-[500px]  
          xl:h-[600px]  
          bg-white/10
          border border-white/10
          rounded-2xl
          shadow-2xl
          overflow-hidden
          backdrop-blur-sm
        "
      >
        <video
          ref={videoRef}
          src="/images/hero/vd1.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
};

export default Vedio;
