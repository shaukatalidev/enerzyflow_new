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
          The <span className="text-cyan-400"> “Invisible”</span> Operating
          System
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Once scanned, the bottle becomes a single point of connection. Powered
          by <span className="text-cyan-400 text-xl font-semibold">AI</span>. No
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
            <h2 className="text-4xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight">
              <span className="text-white g-6 ">ENERZY FLOW</span>
              <span className="text-brand text-center text-glow block  g-6 text-3xl">
                {" "}
                AI POS
              </span>
            </h2>
          </div>

          {/* ---------- RIGHT : VIDEO (70%) ---------- */}
          <div className="h-52.5 sm:h-62.5 md:h-100 lg:h-95">
            <video
              ref={videoRef}
              src="/images/hero/vd1.mp4"
              className="w-full h-full object-centered"
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
      <div className="container mx-auto px-6 grid gap-6 place-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1 */}
        <div className="glass-panel w-full max-w-sm p-8 rounded-2xl hover:border-brand/50 transition duration-500 group">
          <div className="w-14 h-14 bg-brand/24 rounded-xl flex items-center justify-center text-brand text-2xl mb-15 group-hover:scale-110 transition shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            📱
          </div>
          <h3 className="text-2xl font-bold mb-5 text-brand text-glow">
            Frictionless Ordering
          </h3>
          <p className="text-gray-400">
            Scan to order, pay, or book instantly. Reduces waiter dependency by
            40%.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="glass-panel w-full max-w-sm p-8 rounded-2xl border-brand/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative lg:-translate-y-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_#00F0FF]" />
          <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center text-black text-2xl mb-6 animate-pulse">
            ✨
          </div>

          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors">
            AI Offer Engine
          </h3>
          <p className="text-gray-400">
            The Brain: Automatically designs and launches &quot;Flash Sale&quot;
            banners on the bottle&apos;s QR menu to clear excess stocks or show
            festivals wishings and daily offer depending upon requirement.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="glass-panel w-full max-w-sm p-8 rounded-2xl border-brand/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative lg:-translate-y-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_#00F0FF]" />
          <div className="w-15 h-30 bg-brand rounded-xl flex items-center justify-center text-black text-2xl mb-6 animate-pulse">
            🤖
          </div>

          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors">
            Auto Inventory AI
          </h3>
          <p className="text-gray-400">
            Real-time tracking.Every digital order automatically deducts
            stock.updates approximated inventory in store using ordered data .
          </p>
        </div>

        {/* CARD 4 */}
        <div className="glass-panel w-full max-w-sm p-8 rounded-2xl hover:border-brand/50 transition duration-500 group">
          <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center text-brand text-2xl mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            🧲
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand transition-colors">
            Retention Loop
          </h3>
          <p className="text-gray-400">
            Offer is pushed to current diners via Bottle QR Web and past diners
            via SMS and Coupon codes. Retargets the customer with offer after
            they leave with a &quot;Come Back Soon&quot; offer generated by the
            Engine.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Vedio;
