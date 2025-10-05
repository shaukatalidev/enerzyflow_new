"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      setError(errorMessage);
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
      await login(email, otpCode);
      const redirectPath = getPostLoginRedirectPath();
      router.push(redirectPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md lg:max-w-5xl">
        <div className="mb-4 px-4 sm:px-0">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200 group cursor-pointer"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 lg:grid lg:grid-cols-2 overflow-hidden">
          <div className="hidden lg:block relative h-full min-h-[600px]">
            <Image
              src="/images/hero/auth.jpg"
              alt="Secure Login Illustration"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 50vw"
              priority
            />
          </div>

          <div className="p-6 sm:p-10 md:p-12">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
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

              {/* ✅ UPDATED: Changed heading to reflect OTP login instead of account creation */}
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent mb-3">
                {currentStep === 1 ? "Welcome Back" : "Verify Your Identity"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-8">
                {currentStep === 1
                  ? "Sign in securely with passwordless authentication"
                  : "Enter the verification code sent to your email"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
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

            {isRedirecting && (
              <div className="mb-6 p-4 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-cyan-700">
                      {profileLoaded
                        ? "Redirecting to dashboard..."
                        : "Loading your profile..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black bg-white"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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
                  className="w-full py-4 px-6 text-base bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

            {currentStep === 2 && (
              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium text-gray-700 mb-6">
                      Enter the 6-digit verification code sent to
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-cyan-600 bg-cyan-50 rounded-lg py-3 px-6 inline-block mb-8 break-all">
                      {email}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-2 sm:space-x-3">
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
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg sm:text-xl font-bold transition-all duration-200 text-black bg-white"
                        inputMode="numeric"
                        pattern="\d*"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isRedirecting}
                  className="w-full py-4 px-6 text-base bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {isLoading || isRedirecting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>
                        {isRedirecting
                          ? profileLoaded
                            ? "Redirecting..."
                            : "Loading profile..."
                          : "Verifying..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Access Dashboard</span>
                      <svg
                        className="w-5 h-5"
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
                    className="text-sm sm:text-base text-cyan-600 hover:text-cyan-800 font-medium disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                  >
                    Didn&apos;t receive the code? Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    disabled={isRedirecting}
                    className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    ← Change Email Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
