"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { Inter, Space_Grotesk } from "next/font/google";
import {
  FaBottleWater,
  FaCheck,
  FaTruckFast,
  FaIndustry,
  FaUserTie,
  FaBullhorn,
  FaHandshake,
  FaRocket,
  FaShieldHalved,
} from "react-icons/fa6";

// --- FONT CONFIGURATION ---
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

// --- SUB-COMPONENTS ---

const SectionHeading = ({
  title,
  highlight,
  subtitle,
}: {
  title: string;
  highlight: string;
  subtitle: string;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-20">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-6 font-heading"
    >
      {title}{" "}
      <span className="text-brand drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
        {highlight}
      </span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-gray-400 text-lg leading-relaxed"
    >
      {subtitle}
    </motion.p>
  </div>
);

const GlassCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`p-10 rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-xl hover:border-brand/40 hover:-translate-y-2 hover:bg-brand/5 transition-all duration-300 relative overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---

export default function FranchisePage() {
  // Custom Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${inter.variable} ${spaceGrotesk.variable} bg-dark text-white font-sans overflow-x-hidden selection:bg-brand selection:text-black min-h-screen cursor-none`}
    >
      {/* --- CUSTOM CURSOR --- */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-brand rounded-full pointer-events-none z-[9999] shadow-[0_0_15px_#00F0FF] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`,
        }}
      />
      <div
        className={`fixed top-0 left-0 border border-brand/30 bg-brand/5 rounded-full pointer-events-none z-[9998] transition-all duration-200 ease-out hidden md:block`}
        style={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`,
          borderColor: isHovering ? "#fff" : "rgba(0, 240, 255, 0.3)",
        }}
      />

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_80%)] pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-10 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8 font-heading">
              Own the{" "}
              <span className="text-cyan-400 italic drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                Flow.
              </span>
              <br />
              Scale the City.
            </h1>
            <p className="text-gray-400 text-xl max-w-lg leading-relaxed mb-12">
              Launch your own <b>Customised Water Bottle</b> business. We handle
              manufacturing and tech; You handle sales and distribution. <br />
              <span className="text-white font-bold block mt-4 font-heading underline decoration-brand/30 underline-offset-8">
                Zero Competition. Exclusive Territory Lock.
              </span>
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <Link
                href="/franchise/apply"
                className="bg-cyan-400 text-black font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest
             hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,240,255,0.4)]
             font-heading flex items-center gap-3"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Start Application
              </Link>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white leading-none font-heading">
                    Turnkey
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-heading">
                    Ready Setup
                  </p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-cyan-400 leading-none font-heading">
                    ₹81k
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-heading">
                    One-time Fee
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            <div className="absolute w-[400px] h-[400px] bg-brand/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative w-full max-w-md aspect-square rounded-[40px] border border-brand/30 bg-surface/50 backdrop-blur-xl flex flex-col items-center justify-center p-10 overflow-hidden group hover:border-brand/60 transition-colors">
              <FaBottleWater className="text-8xl text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)] transform group-hover:-rotate-12 transition-transform duration-500" />
              <h3 className="text-2xl font-bold text-center mb-2 font-heading">
                Exclusive Sales Partner
              </h3>
              <p className="text-center text-gray-500 text-sm mb-8">
                You control the relationships. We control the supply.
              </p>

              <div className="w-full bg-surface p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold">
                    <FaCheck />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white font-bold font-heading">
                      Full Support
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Brand + Leads + Logistics
                    </p>
                  </div>
                </div>
                <FaTruckFast className="text-cyan-400 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- THE MODEL --- */}
      <section
        id="model"
        className="py-32 relative border-y border-white/5 bg-surface"
      >
        <div className="container mx-auto px-6 md:px-10">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              The Partnership <span className="text-brand">Model</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              No factories. No production stress. Just the power of a national
              brand in your local market.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 01 */}
            <div className="glass-card p-10 rounded-3xl relative overflow-hidden  border border-white/20">
              <span className="absolute -right-4 -top-4 text-9xl font-black text-white/5 select-none font-heading"></span>

              <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-brand text-3xl border border-brand/20 bg-brand/10">
                <FaIndustry className="text-cyan-400 text-3xl" />
              </div>

              <h3 className="text-2xl font-bold mb-4 font-heading">
                We Manufacture
              </h3>

              <p className="text-gray-400 leading-relaxed">
                EnerzyFlow HQ manages manufacturing, quality control, and
                premium label printing. You receive ready-to-sell stock for
                elite venues.
              </p>
            </div>

            {/* Card 02 (Highlighted) */}
            <div className="glass-card p-10 rounded-3xl relative overflow-hidden bg-brand/5 border border-brand/40 shadow-[0_0_30px_rgba(0,240,255,0.05)]">
              <span className="absolute -right-4 -top-4 text-9xl font-black text-brand/10 select-none font-heading"></span>

              <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-black text-3xl bg-brand shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <FaUserTie className="text-cyan-400 text-3xl" />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white font-heading">
                You Sell
              </h3>

              <p className="text-gray-300 leading-relaxed">
                You drive on-ground sales, collect orders from Hotels & Cafés,
                and manage distribution within your exclusive territory.
              </p>
            </div>

            {/* Card 03 */}
            <div className="glass-card p-10 rounded-3xl relative overflow-hidden  border border-white/20">
              <span className="absolute -right-4 -top-4 text-9xl font-black text-white/5 select-none font-heading"></span>

              <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-brand text-3xl border border-brand/20 bg-brand/10">
                <FaBullhorn className="text-cyan-400 text-3xl" />
              </div>

              <h3 className="text-2xl font-bold mb-4 font-heading">
                Support & Leads
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Central marketing powers your city launch, verified leads,
                branding, and 24/7 operational support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINANCIALS --- */}
      <section id="earnings" className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-bold mb-12 font-heading leading-tight"
            >
              High Velocity{" "}
              <span className="text-brand drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                Earnings.
              </span>
            </motion.h2>

            <div className="space-y-6">
              {[
                {
                  label: "Franchise Fee",
                  value: "get quote",
                  icon: FaHandshake,
                  sub: null,
                },
                {
                  label: "Monthly Commitment",
                  value: "500 Cases",
                  icon: null,
                  sub: "~12,000 Bottles",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl flex justify-between items-center group hover:bg-brand/10 transition-colors border border-white/10 bg-surface/60 backdrop-blur-md"
                >
                  <div>
                    {item.label === "Franchise Fee" ? (
                      <button
                        onClick={scrollToApply}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="text-3xl font-bold text-white hover:underline transition font-heading"
                      >
                        {item.value}
                      </button>
                    ) : (
                      <p className="text-3xl font-bold text-white group-hover:text-brand transition font-heading">
                        {item.value}
                      </p>
                    )}
                  </div>
                  {item.icon ? (
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                      <item.icon className="text-brand" />
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold">
                        {item.sub}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-2xl flex justify-between items-center group 
             border border-white/10 
             bg-surface/60 backdrop-blur-md 
             hover:bg-brand/10 transition-colors"
              >
                <div>
                  <p className="text-xs text-brand uppercase font-bold tracking-wider mb-1 font-heading">
                    Avg. ROI Period
                  </p>
                  <p className="text-5xl font-black text-white font-heading group-hover:text-brand transition">
                    &lt; 3–6 Months
                  </p>
                </div>

                <FaRocket className="text-4xl text-brand animate-bounce" />
              </motion.div>

              <p className="mt-6 text-gray-500 text-sm italic">
                * ROI based on average sales turnover from current Tier-2 city
                partners.
              </p>
            </div>
          </div>

          {/* Visual Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-[48px] text-center border border-brand/20 relative overflow-hidden bg-surface/80 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
            <h3 className="text-2xl font-bold mb-10 relative z-10 font-heading tracking-wide">
              The Profit Engine
            </h3>

            <div className="flex items-end justify-center gap-6 h-72 mb-8 relative z-10">
              <div className="w-24 bg-gray-800 rounded-t-2xl relative group h-[50%] transition-all hover:h-[55%]">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  Purchase
                </span>
              </div>
              <div className="w-24 bg-cyan-400 rounded-t-2xl relative group h-[85%] shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all hover:h-[90%]">
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-lg font-bold text-brand font-heading">
                  Margin
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10 max-w-sm mx-auto">
              You earn on the spread between manufacturing cost and wholesale
              distribution price. Consistent re-orders = Stable income.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- APPLICATION FORM --- */}
      <section id="apply" className="py-32 bg-black border-t border-white/10">
        <div className="container mx-auto px-6 md:px-10 max-w-4xl">
          <SectionHeading
            title="Secure Your"
            highlight="Territory"
            subtitle="We onboard only one partner per city. Check if yours is still available."
          />

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-[48px] grid md:grid-cols-2 gap-10 border border-brand/20 bg-surface/50 backdrop-blur-xl"
          >
            {[
              { label: "Full Name", type: "text", placeholder: "John Doe" },
              { label: "Contact Number", type: "tel", placeholder: "+91" },
              {
                label: "Target City / Zone",
                type: "text",
                placeholder: "e.g. Surat, Pune, Ludhiana",
                full: true,
              },
            ].map((field, idx) => (
              <div
                key={idx}
                className={
                  field.full ? "col-span-2" : "col-span-2 md:col-span-1"
                }
              >
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 font-heading">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="w-full rounded-2xl px-5 py-4 bg-white/5 border border-white/10 focus:border-brand focus:bg-brand/5 outline-none transition-all duration-300 text-white placeholder-gray-700"
                  placeholder={field.placeholder}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                />
              </div>
            ))}

            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 font-heading">
                Experience in Sales/Logistics?
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-2xl px-5 py-4 bg-white/5 border border-white/10 focus:border-brand focus:bg-brand/5 outline-none transition-all duration-300 text-white appearance-none cursor-pointer"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <option className="bg-black text-gray-300">
                    Yes, I am experienced
                  </option>
                  <option className="bg-black text-gray-300">
                    No, but I have a network
                  </option>
                  <option className="bg-black text-gray-300">
                    I am a first-time entrepreneur
                  </option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand">
                  ▼
                </div>
              </div>
            </div>

            <div className="col-span-2 mt-6">
              <button
                type="button"
                className="w-full bg-cyan-400 text-black font-black text-xl py-5 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all font-heading uppercase tracking-wider"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Submit Interest
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-6 tracking-widest uppercase flex items-center justify-center gap-2">
                <FaShieldHalved /> Confidential Application. Our team will call
                within soon.
              </p>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
