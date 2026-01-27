"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  franchiseService,
  FranchiseApplicationData,
} from "@/app/services/franchiseService";

interface FormData {
  fullName: string;
  mobileNumber: string;
  city: string;
  logisticsCapacity: string;
  agreedToTerms: boolean;
}

export default function FranchiseApplication() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      city: "",
      logisticsCapacity: "I have storage space/warehouse",
      agreedToTerms: false,
    },
  });

  // Brand Color reference: #00F0FF

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleReset = () => {
    setStep(1);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    if (!data.agreedToTerms) {
      setShowError(true);
      setTimeout(() => setShowError(false), 500); // Reset shake animation
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData: FranchiseApplicationData = {
        name: data.fullName,
        phone: data.mobileNumber,
        city: data.city,
        logistic_supports: data.logisticsCapacity,
      };

      const response =
        await franchiseService.submitApplication(applicationData);

      console.log("API Response:", response); // Debug log

      // Handle different response formats
      // If response has success property or if response exists (201/200 status)
      if (response.success || response) {
        toast.success(
          response.message || "Application submitted successfully!",
        );
        setStep(4); // Move to success state
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application",
      );
      console.error("Error submitting franchise application:", error);
    } finally {
      setIsSubmitting(false);
    }
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <h2 className="text-3xl font-bold mb-6 font-sans">
                Let&apos;s start with{" "}
                <span className="text-[#00F0FF]">You.</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`w-full bg-white/5 border ${
                      errors.fullName ? "border-red-500" : "border-white/10"
                    } text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300`}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[+]?[0-9]{10,15}$/,
                        message: "Please enter a valid mobile number",
                      },
                    })}
                    className={`w-full bg-white/5 border ${
                      errors.mobileNumber ? "border-red-500" : "border-white/10"
                    } text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300`}
                    placeholder="+91"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Validate step 1 fields before moving to next step
                  const fullName = watch("fullName");
                  const mobileNumber = watch("mobileNumber");

                  if (!fullName || fullName.length < 2) {
                    toast.error("Please enter a valid name");
                    return;
                  }
                  if (
                    !mobileNumber ||
                    !/^[+]?[0-9]{10,15}$/.test(mobileNumber)
                  ) {
                    toast.error("Please enter a valid mobile number");
                    return;
                  }
                  handleNext();
                }}
                className="w-full mt-8 bg-[#00F0FF] text-black font-bold py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 tracking-wide cursor-pointer"
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
                    {...register("city", {
                      required: "City is required",
                      minLength: {
                        value: 2,
                        message: "City name must be at least 2 characters",
                      },
                    })}
                    className={`w-full bg-white/5 border ${
                      errors.city ? "border-red-500" : "border-white/10"
                    } text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 focus:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all duration-300`}
                    placeholder="e.g. Surat, Gujarat"
                    autoFocus
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Logistics Capacity
                  </label>
                  <select
                    {...register("logisticsCapacity", {
                      required: "Please select your logistics capacity",
                    })}
                    className={`w-full bg-white/5 border ${
                      errors.logisticsCapacity
                        ? "border-red-500"
                        : "border-white/10"
                    } text-white p-4 rounded-2xl outline-none focus:border-[#00F0FF] focus:bg-[#00F0FF]/5 transition-all duration-300 appearance-none cursor-pointer`}
                    title="Select logistics capacity"
                  >
                    <option
                      className="bg-black text-gray-300"
                      value="I have storage space/warehouse"
                    >
                      I have storage space/warehouse
                    </option>
                    <option
                      className="bg-black text-gray-300"
                      value="I can lease a space"
                    >
                      I can lease a space
                    </option>
                    <option
                      className="bg-black text-gray-300"
                      value="I need guidance on setup"
                    >
                      I need guidance on setup
                    </option>
                  </select>
                  {errors.logisticsCapacity && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.logisticsCapacity.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition text-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Validate step 2 fields before moving to next step
                    const city = watch("city");

                    if (!city || city.length < 2) {
                      toast.error("Please enter a valid city name");
                      return;
                    }
                    handleNext();
                  }}
                  className="bg-[#00F0FF] text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300 uppercase tracking-wide text-sm cursor-pointer"
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
                      : errors.agreedToTerms
                        ? "border-red-500"
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
                    {...register("agreedToTerms", {
                      required: "You must agree to the terms to continue",
                    })}
                    className="w-5 h-5 accent-[#00F0FF] rounded cursor-pointer"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs text-gray-300 cursor-pointer select-none"
                  >
                    I am ready to invest and lead operations in my city.
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-red-400 text-xs ml-1">
                    {errors.agreedToTerms.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#00F0FF] text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Portal"
                  )}
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
                className="w-full bg-[#00F0FF] text-black font-bold py-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-300 uppercase tracking-widest text-sm cursor-pointer"
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
