'use client';

export default function Solution() {
  return (
    <section className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.12),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-8">
          <span className="text-cyan-400">Coming</span> Soon
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl mb-10">
          We’re building powerful solutions to redefine sustainable hydration.
          Stay tuned.
        </p>

        <video
          src="/images/hero/vd1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl object-cover shadow-[0_0_70px_rgba(0,240,255,0.35)]"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
