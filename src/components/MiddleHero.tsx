'use client';

import Image from "next/image";
import Link from "next/link";

const MiddleHero = () => {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Grid & Gradient */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-dark"></div>

      {/* Main Container */}
      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Text Section */}
        <div className="order-2 md:order-1 hero-text">

          {/* Badge */}
          

          {/* Hero Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
            Bottles With a <br/>
            <span className="text-cyan-400">Voice.</span>
          </h1>

          {/* Hero Description */}
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            We don&apos;t just sell water. We upgrade your table with a <b>Live Digital Interface</b>. 
            Quench thirst, kill plastic waste, and drive revenue.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            
            {/* See Designs Button */}
           <Link href="/products">
  <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden">
    <span className="relative z-10 
    
    transition-colors duration-300 ease-out group-hover:text-cyan-500 ">
      See Designs
    </span>
    <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
  </button>
</Link>

            {/* How It Works Button */}
            <Link href="/video">
            <button className="px-8 py-4 border border-white/20 rounded-full font-bold flex items-center gap-3 group transition hover:text-cyan-400">
               <span
      className="
        ml-0.5
        w-0 h-0
        border-t-[6px] border-b-[6px] border-l-[10px]
        border-t-transparent
        border-b-transparent
        border-l-white
        group-hover:border-l-cyan-400
      "
    ></span>
              How It Works
            </button>
            </Link>

          </div>
        </div>

        {/* Right Image Section */}
        <div className="order-1 md:order-2 relative h-[600px] flex items-center justify-center perspective-1000">

          {/* Main Hero Card */}
          <div className="absolute w-48 h-[500px] bg-gradient-to-b from-gray-800 to-black rounded-[40px] border border-white/10 shadow-2xl transform transition-transform duration-700 hover:rotate-y-12 hero-card z-10 flex items-center justify-center overflow-hidden group">
            <Image
              src="/images/hero/image2.png"
              alt="EnerzyFlow Smart Bottle Interface"
              fill
              className="object-cover opacity-100 mix-blend-overlay"
              style={{ filter: "hue-rotate(180deg)" }}
              priority
            />
           <div className="absolute bottom-10 inset-x-0 text-center">
  <div className="w-16 h-16 bg-white mx-auto rounded-md overflow-hidden shadow-md">
    <Image
      src="/images/hero/image1.png"
      alt="QR Code"
      width={64}
      height={64}
      className="object-contain"
      quality={100}
      unoptimized
    />
  </div>


              <p className="text-[10px] text-brand uppercase  text-cyan-400 tracking-widest transition-colors duration-300 ease-out group-hover:text-white">
                Scan to Order
              </p>
            </div>
          </div>

          {/* Secondary Hero Card */}
          <div className="absolute right-0 bottom-20 w-64 h-[450px] transform translate-x-12 translate-y-12 rotate-[-5deg] hero-card z-20 overflow-hidden">
            <Image
              src="/images/hero/image1.png"
              alt="EnerzyFlow Live Display"
              fill
              className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none">
              <div className="absolute bottom-6 left-6">
                <div className="bg-brand text-cyan-400 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 shadow-[0_0_10px_rgba(0,240,255,0.5)] animate-pulse">
                  LIVE NOW
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </header>
  );
};

export default MiddleHero;
