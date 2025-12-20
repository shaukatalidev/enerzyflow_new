'use client';
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 2.5;
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        setDone(true);
      }
      setProgress(value);

      // Update liquid height dynamically
      const liquid = sphereRef.current?.querySelector<HTMLDivElement>(".liquid");
      if (liquid) liquid.style.height = `${value}%`;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!done) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = "none";
        if (mainContentRef.current) {
          gsap.to(mainContentRef.current, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1 });
        }
      }
    });

    tl.to(textRef.current, { opacity: 0, duration: 0.3 })
      .to(sphereRef.current, { scale: 30, opacity: 0, duration: 1.5, ease: "power4.in" }, "<")
      .to(loaderRef.current, { opacity: 0, duration: 0.5 }, "-=0.5");
  }, [done]);

  return (
    <>
      <div ref={mainContentRef} id="main-content" className="opacity-0 scale-[0.95]">
        {/* Your main content goes here */}
      </div>

      <div ref={loaderRef} className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">

          {/* HYDRO SPHERE */}
          <div ref={sphereRef} className="relative w-[140px] h-[140px] rounded-full border-2 border-cyan-400/30 bg-black/80 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.2)] mb-8">
            {/* SCAN BAR */}
            <div className="absolute w-full h-[2px] bg-white/70 animate-scan" />

            {/* LIQUID */}
            <div className="liquid absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-cyan-300 shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-100 overflow-hidden">
              <div className="absolute w-[200%] h-[200%] top-[-150%] left-[-50%] rounded-[38%] bg-white/20 animate-wave" />
              <div className="absolute w-[200%] h-[200%] top-[-150%] left-[-50%] rounded-[35%] bg-white/10 animate-wave-reverse" />
            </div>
          </div>

          {/* TEXT */}
          <div ref={textRef} className={`text-center transition-opacity duration-700 ${progress > 20 ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">
              Magic Happening
            </p>
            <h1 className="text-white text-4xl font-extrabold tracking-widest">
              ENERZY <span className="text-cyan-400">FLOW</span>
            </h1>
          </div>

        </div>
      </div>
    </>
  );
}
