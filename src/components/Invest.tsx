'use client';

import CustomCursor from "@/components/CustomCursor";

export const metadata = {
  title: "Invest / Coming Soon | EnerzyFlow",
  description: "Our investment page is coming soon. Stay tuned for updates and opportunities to invest in EnerzyFlow.",
};

export default function InvestPage() {
  return (
    <section className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 sm:px-10 overflow-hidden">

      <CustomCursor />

      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          <span className="text-cyan-400">Coming</span> Soon
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl mb-10">
          The Invest page is under development. Stay tuned for exciting opportunities to grow with EnerzyFlow.
        </p>

       
      </div>

      {/* Optional background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-900/20 to-black pointer-events-none" />
    </section>
  );
}
