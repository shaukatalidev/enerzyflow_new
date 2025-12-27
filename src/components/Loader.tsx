'use client';

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function Loader() {
  const pathname = usePathname();

  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---------- VISIBILITY LOGIC ---------- */
  useEffect(() => {
    const hasShown = sessionStorage.getItem("loader-shown");

    // ✅ Always show loader on HOME reload
    if (pathname === "/") {
      setIsVisible(true);
      return;
    }

    // ✅ Other pages → show once per session
    if (!hasShown) {
      setIsVisible(true);
      sessionStorage.setItem("loader-shown", "true");
    } else {
      gsap.set(contentRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      });
    }
  }, [pathname]);

  /* ---------- FAKE PROGRESS ---------- */
  useEffect(() => {
    if (!isVisible) return;

    let value = 0;
    const timer = setInterval(() => {
      value += Math.random() * 2.5;

      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        setIsDone(true);
      }

      setProgress(value);

      const liquid = sphereRef.current?.querySelector<HTMLDivElement>(".liquid");
      if (liquid) liquid.style.height = `${value}%`;
    }, 50);

    return () => clearInterval(timer);
  }, [isVisible]);

  /* ---------- EXIT ANIMATION ---------- */
  useEffect(() => {
    if (!isDone) return;

    gsap
      .timeline({
        onComplete: () => {
          loaderRef.current!.style.display = "none";
          gsap.to(contentRef.current, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
          });
        },
      })
      .to(textRef.current, { opacity: 0, duration: 0.3 })
      .to(
        sphereRef.current,
        {
          scale: 30,
          opacity: 0,
          duration: 1.5,
          ease: "power4.in",
        },
        "<"
      )
      .to(loaderRef.current, { opacity: 0, duration: 0.5 }, "-=0.5");
  }, [isDone]);

  return (
    <>
      {/* MAIN CONTENT */}
      <div
        ref={contentRef}
        className="opacity-0 scale-[0.95]"
      >
        {/* Your main content here */}
      </div>

      {/* LOADER */}
      {isVisible && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          <div className="flex flex-col items-center">

            {/* Sphere */}
            <div
              ref={sphereRef}
              className="relative w-[140px] h-[140px] rounded-full border-2 border-cyan-400/30 bg-black/80 overflow-hidden mb-8"
            >
              <div className="absolute w-full h-[2px] bg-white/70 animate-scan" />

              <div className="liquid absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-cyan-300 transition-all duration-100">
                <div className="absolute w-[200%] h-[200%] top-[-150%] left-[-50%] rounded-[38%] bg-white/20 animate-wave" />
                <div className="absolute w-[200%] h-[200%] top-[-150%] left-[-50%] rounded-[35%] bg-white/10 animate-wave-reverse" />
              </div>
            </div>

            {/* Text */}
            <div
              ref={textRef}
              className={`text-center transition-opacity duration-700 ${
                progress > 20 ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-cyan-400 text-xs tracking-[0.3em] uppercase mb-2">
                Magic Happening
              </p>
              <h1 className="text-white text-4xl font-extrabold tracking-widest">
                ENERZY <span className="text-cyan-400">FLOW</span>
              </h1>
            </div>

          </div>
        </div>
      )}
    </>
  );
}