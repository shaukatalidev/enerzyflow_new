'use client';
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
          <div className="inline-block border border-brand-30 rounded-full px-4 py-1 mb-6 bg-brand-5 backdrop-blur-sm">
            <span className="text-brand text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              IIT Kharagpur Alumnus Startup
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            Bottles With a<br/>
            <span className="text-brand text-shadow-glow font-serif italic">Voice.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            We don't just sell water. We upgrade your table with a <b>Live Digital Interface</b>. Quench thirst, kill plastic waste, and drive revenue.
          </p>

          <div className="flex gap-4">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden">
              <span className="relative z-10 group-hover:text-brand transition-colors">See Designs</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
            </button>
             
            <Link
  href="/vedio"
  className="px-8 py-4 border border-white/20 rounded-full font-bold
             hover:bg-white/5 transition flex items-center gap-3 group"
>
  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                   group-hover:bg-brand group-hover:text-black transition-colors">
    <i className="fa-solid fa-play text-xs"></i>
  </span>
  How It Works
</Link>

          </div>
        </div>

        {/* Right Image Section */}
        <div className="order-1 md:order-2 relative h-[600px] flex items-center justify-center perspective-1000">
          
          {/* Main Hero Card */}
          <div className="absolute w-48 h-[500px] bg-gradient-to-b from-gray-800 to-black rounded-[40px] border border-white/10 shadow-2xl transform transition-transform duration-700 hover:rotate-y-12 hero-card z-10 flex items-center justify-center overflow-hidden group">
            <img
              src="/images/hero/image2.png"
              alt="Bottle"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              style={{ filter: "hue-rotate(180deg)" }}
            />

            <div className="absolute bottom-10 left-0 right-0 text-center">
              <div className="w-16 h-16 bg-white mx-auto rounded-lg p-1 mb-2">
                <img src="/images/hero/image1.png" className="w-full h-full"/>
              </div>
              <p className="text-[10px] text-brand uppercase tracking-widest group-hover:text-white transition-colors">Scan to Order</p>
            </div>
          </div>

          {/* Secondary Hero Card */}
          <div className="absolute right-0 bottom-20 w-64 h-[450px] bg-surface rounded-[30px] border border-brand-50 shadow-[0_0_50px_rgba(0,240,255,0.25)] transform translate-x-12 translate-y-12 rotate-[-5deg] hero-card z-20 overflow-hidden">
            <img src="/images/hero/image1.png" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none">
              <div className="absolute bottom-6 left-6">
                <div className="bg-brand text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 shadow-[0_0_10px_rgba(0,240,255,0.5)] animate-pulse">LIVE NOW</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default MiddleHero;
