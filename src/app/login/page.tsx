"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { sendOTP, login, getPostLoginRedirectPath, profileLoaded } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendOTP(email);
      setCurrentStep(2);
    } catch (error) {
      // ✅ FIX 1: Removed `: any`
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setError(errorMessage);
      console.error("❌ Send OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }

      if (!value && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsRedirecting(true);

    try {
      // Wait for login and profile loading to complete
      await login(email, otpCode);
      
      // Now that login is complete and profile is loaded, get redirect path
      const redirectPath = getPostLoginRedirectPath();
  
      router.push(redirectPath);
      
    } catch (error) {
      // ✅ FIX 2: Removed `: any`
      console.error("❌ Login error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      setIsRedirecting(false);
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");

    try {
      await sendOTP(email);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (error) {
      // ✅ FIX 3: Removed `: any`
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep(1);
    setError("");
    setIsRedirecting(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Main card with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center">
            {/* Logo or brand icon */}
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Create New Account
            </h1>
            <p className="text-gray-600 text-sm mb-8">
              {currentStep === 1 &&
                "Enter your email to get started with secure access"}
              {currentStep === 2 &&
                "Move ahead towards Dashboard - verify your identity"}
            </p>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* REDIRECTING INDICATOR */}
          {isRedirecting && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {profileLoaded ? 'Redirecting...' : 'Loading profile data...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black bg-white"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>

              <div className="text-center pt-4">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Secure passwordless authentication</span>
                </div>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-6">
                    Enter the 6-digit verification code sent to
                  </p>
                  <p className="text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg py-2 px-4 inline-block mb-6">
                    {email}
                  </p>
                </div>

                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(ref) => {
                        otpRefs.current[index] = ref;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold transition-all duration-200 text-black bg-white"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full py-3 px-4 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading || isRedirecting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>
                      {isRedirecting 
                        ? (profileLoaded ? 'Redirecting...' : 'Loading profile...') 
                        : 'Verifying...'
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Access Dashboard</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </button>

              <div className="flex flex-col items-center space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || isRedirecting}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 transition-colors duration-200"
                >
                  {/* ✅ FIX 4: Escaped apostrophe */}
                  Didn&apos;t receive the code? Resend OTP
                </button>

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  disabled={isRedirecting}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
                >
                  ← Change Email Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
