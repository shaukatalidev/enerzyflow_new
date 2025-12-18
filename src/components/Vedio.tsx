"use client";

import { useEffect, useRef } from "react";

const Vedio = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      id="software"
      className="relative bg-surface overflow-hidden py-32"
    >
      {/* ================= TOP TEXT (NO BOX) ================= */}
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          The <span className="text-cyan-400"> “Invisible”</span> Operating System
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Once scanned, the bottle becomes a single point of connection.
          Powered by{" "}
          <span className="text-cyan-400 text-xl font-semibold">AI</span>. No
          downloads. No friction.
        </p>
      </div>

     {/* ================= VIDEO BLOCK (30% TEXT | 70% VIDEO) ================= */}
<div className="container mx-auto px-6 flex justify-center mb-24">
  <div
    className="
      w-full max-w-7xl
      bg-white/10
      border border-white/10
      rounded-2xl
      shadow-2xl
      overflow-hidden
      backdrop-blur-sm
      grid grid-cols-1 md:grid-cols-[30%_70%]
    "
  >
    {/* ---------- LEFT : BRAND TEXT (30%) ---------- */}
    <div className="flex items-center justify-center px-10 py-16 text-center md:text-left">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="text-white block">ENERZY</span>
        <span className="text-brand text-glow block">FLOW</span>
      </h2>
    </div>

    {/* ---------- RIGHT : VIDEO (70%) ---------- */}
    <div className="h-[210px] sm:h-[250px] md:h-[400px] lg:h-[380px]">
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
  </div>
</div>


      {/* ================= FEATURE CARDS ================= */}
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="glass-panel p-8 rounded-2xl hover:border-brand/50 transition duration-500 group">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center text-brand text-2xl mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            ✨
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors">
            AI Offer Engine
          </h3>
          <p className="text-gray-400">
            Inventory heavy? The AI automatically designs and pushes a “Flash
            Sale” banner to clear stock instantly.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="glass-panel p-8 rounded-2xl border-brand/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] transform md:-translate-y-4 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_#00F0FF]"></div>
          <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center text-black text-2xl mb-6 animate-pulse">
            📱
          </div>
          <h3 className="text-2xl font-bold mb-3 text-brand text-glow">
            Frictionless Ordering
          </h3>
          <p className="text-gray-400">
            Scan to order. Scan to pay. Scan to book. We reduce waiter dependency
            by 40%.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="glass-panel p-8 rounded-2xl hover:border-brand/50 transition duration-500 group">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center text-brand text-2xl mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            🧲
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors">
            Retention Loop
          </h3>
          <p className="text-gray-400">
            We capture the “Ghost Customer” and retarget them later with a
            personalized comeback offer.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Vedio;
