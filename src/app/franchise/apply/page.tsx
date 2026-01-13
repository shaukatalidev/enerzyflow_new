"use client";

import { useState } from "react";

export default function FranchiseApplication() {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);

  // Brand Color reference: #00F0FF

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleReset = () => {
    setStep(1);
    setAgreed(false);
  };

  const handleSubmit = () => {
    if (!agreed) {
      setShowError(true);
      setTimeout(() => setShowError(false), 500); // Reset shake animation
      return;
    }
    setStep(4); // 4 represents the success state
  };

  // Calculate Progress Width
  const progressWidth = step === 4 ? "100%" : `${(step / 3) * 100}%`;

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-sans relative overflow-hidden p-4">
      {/* Background decoration to match your theme */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* GLASS CARD CONTAINER */}
      <div className="max-w-xl w-full bg-[#141414]/60 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] relative overflow-hidden animate-in fade-in zoom-in duration-500 shadow-2xl z-10">
        {/* PROGRESS BAR (Hidden on Success Step) */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[#00F0FF] text-[10px] font-black uppercase tracking-[0.3em]">
                Franchise Onboarding
              </span>
              <span className="text-gray-500 text-[10px] font-bold uppercase">
                Step {step} of 3
              </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00F0FF] transition-all duration-500 ease-out"
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <h2 className="text-3xl font-bold mb-6 font-sans">
                Let's start with <span className="text-[#00F0FF]">You.</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300"
                    placeholder="Enter your name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300"
                    placeholder="+91"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-8 bg-[#00F0FF] text-black font-bold py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 tracking-wide"
              >
                CONTINUE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: TERRITORY */}
          {step === 2 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <h2 className="text-3xl font-bold mb-6 font-sans">
                Target <span className="text-[#00F0FF]">Territory.</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Proposed City
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300"
                    placeholder="e.g. Surat, Gujarat"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Logistics Capacity
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 transition-all duration-300 appearance-none cursor-pointer">
                    <option className="bg-black text-gray-300">
                      I have storage space/warehouse
                    </option>
                    <option className="bg-black text-gray-300">
                      I can lease a space
                    </option>
                    <option className="bg-black text-gray-300">
                      I need guidance on setup
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#00F0FF] text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300 uppercase tracking-wide text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINAL CHECK */}
          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <h2 className="text-3xl font-bold mb-6 font-sans">
                Final <span className="text-[#00F0FF]">Check.</span>
              </h2>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Are you ready to commit to a monthly target of{" "}
                  <b className="text-white">500 cases</b> and an initial setup
                  fee of <b className="text-white">₹80,999</b>?
                </p>

                <div
                  className={`flex items-center gap-3 p-4 bg-[#00F0FF]/5 rounded-2xl border transition-colors duration-300 ${
                    showError
                      ? "border-red-500 animate-[shake_0.5s_ease-in-out]"
                      : "border-[#00F0FF]/20"
                  }`}
                  style={
                    showError
                      ? {
                          animation:
                            "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
                        }
                      : {}
                  }
                >
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 accent-[#00F0FF] rounded cursor-pointer"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs text-gray-300 cursor-pointer select-none"
                  >
                    I am ready to invest and lead operations in my city.
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#00F0FF] text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300 uppercase tracking-wide text-sm"
                >
                  Submit Portal
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === 4 && (
            <div className="text-center animate-in zoom-in-95 duration-500 fade-in">
              <div className="w-20 h-20 bg-[#00F0FF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,242,255,0.4)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 font-sans">
                Application <span className="text-[#00F0FF]">Received.</span>
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Our territory managers will review your profile and reach out
                within 24 business hours.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-[#00F0FF] text-black font-bold py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Start New Application
              </button>
            </div>
          )}
        </form>

        {/* Decorative Mesh Bubble */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Shake Animation Keyframes (Inline for standalone component) */}
      <style jsx>{`
        @keyframes shake {
          10%,
          90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%,
          80% {
            transform: translate3d(2px, 0, 0);
          }
          30%,
          50%,
          70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%,
          60% {
            transform: translate3d(4px, 0, 0);
          }
        }
      `}</style>
    </main>
  );
}
