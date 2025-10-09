"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import toast from "react-hot-toast";

// ✅ Constants outside component
const MAX_OTP_ATTEMPTS = 3;
const OTP_LENGTH = 6;
const RESEND_TIMER_SECONDS = 30;

// ✅ Memoized Error Alert Component
const ErrorAlert = memo(({ 
  error, 
  otpError, 
  currentStep, 
  otpAttempts 
}: { 
  error: string; 
  otpError: boolean; 
  currentStep: number; 
  otpAttempts: number;
}) => {
  if (!error) return null;

  return (
    <div
      className={`mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg ${
        otpError ? "animate-shake" : ""
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          {otpError && currentStep === 2 && otpAttempts < MAX_OTP_ATTEMPTS && (
            <p className="text-xs text-red-600 mt-1">
              Please try again or request a new OTP.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

ErrorAlert.displayName = "ErrorAlert";

// ✅ Memoized Redirecting Alert Component
const RedirectingAlert = memo(({ profileLoaded }: { profileLoaded: boolean }) => (
  <div className="mb-4 p-3 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
      <div className="ml-3">
        <p className="text-sm text-cyan-700">
          {profileLoaded ? "Redirecting to dashboard..." : "Loading your profile..."}
        </p>
      </div>
    </div>
  </div>
));

RedirectingAlert.displayName = "RedirectingAlert";

// ✅ Memoized OTP Input Component
const OTPInput = memo(({ 
  otp, 
  otpRefs, 
  otpError, 
  isLoading, 
  isRedirecting,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste 
}: {
  otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  otpError: boolean;
  isLoading: boolean;
  isRedirecting: boolean;
  onOtpChange: (value: string, index: number) => void;
  onOtpKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex justify-center gap-2 sm:gap-3">
    {otp.map((digit, index) => (
      <input
        key={index}
        ref={(ref) => {
          otpRefs.current[index] = ref;
        }}
        type="text"
        maxLength={1}
        value={digit}
        onChange={(e) => onOtpChange(e.target.value, index)}
        onKeyDown={(e) => onOtpKeyDown(e, index)}
        onPaste={onOtpPaste}
        className={`w-10 h-10 sm:w-12 sm:h-12 text-center border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-xl font-bold transition-all duration-200 text-black bg-white ${
          otpError ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
        inputMode="numeric"
        pattern="\d*"
        disabled={isLoading || isRedirecting}
      />
    ))}
  </div>
));

OTPInput.displayName = "OTPInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER_SECONDS);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { sendOTP, login, profileLoaded } = useAuth();

  // ✅ Resend timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === 2 && !canResendOtp && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, canResendOtp, resendTimer]);

  // ✅ Memoized email submit handler
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendOTP(email);
      setCurrentStep(2);
      setCanResendOtp(false);
      setResendTimer(RESEND_TIMER_SECONDS);
      setOtpAttempts(0);
      toast.success("OTP sent successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, sendOTP]);

  // ✅ Memoized OTP change handler
  const handleOtpChange = useCallback((value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length <= 1) {
      setOtp(prev => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });
      setOtpError(false);
      setError("");

      if (value && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }

      if (!value && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  }, []);

  // ✅ Memoized OTP keydown handler
  const handleOtpKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  // ✅ Memoized OTP paste handler
  const handleOtpPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setOtpError(false);
      setError("");
      otpRefs.current[OTP_LENGTH - 1]?.focus();
    }
  }, []);

  // ✅ Memoized OTP submit handler
  const handleOtpSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      toast.error("Please enter complete OTP");
      setError("Please enter complete OTP");
      setOtpError(true);
      return;
    }

    if (isLoading || isRedirecting) return;

    setIsLoading(true);
    setError("");
    setOtpError(false);

    try {
      await login(email, otpCode);
      setIsRedirecting(true);
      toast.success("Login successful! Redirecting...");
    } catch (error) {
      const newAttempts = otpAttempts + 1;
      
      setOtpAttempts(newAttempts);
      setOtpError(true);
      setIsLoading(false);
      setIsRedirecting(false);
      
      const errorMessage = error instanceof Error ? error.message : "Login failed";

      if (newAttempts >= MAX_OTP_ATTEMPTS) {
        toast.error("Too many failed attempts. Requesting new OTP...");
        setError("Too many failed attempts. Please request a new OTP.");
        
        setTimeout(() => {
          handleBackToEmail();
        }, 2000);
      } else {
        toast.error(`Invalid OTP (Attempt ${newAttempts}/${MAX_OTP_ATTEMPTS})`);
        setError(`${errorMessage} (Attempt ${newAttempts}/${MAX_OTP_ATTEMPTS})`);
        
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      }
    }
  }, [otp, email, isLoading, isRedirecting, otpAttempts, login]);

  // ✅ Memoized resend OTP handler
  const handleResendOtp = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setOtpError(false);

    try {
      await sendOTP(email);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpAttempts(0);
      setCanResendOtp(false);
      setResendTimer(RESEND_TIMER_SECONDS);
      toast.success("New OTP sent successfully!");
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend OTP";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, sendOTP]);

  // ✅ Memoized back to email handler
  const handleBackToEmail = useCallback(() => {
    setCurrentStep(1);
    setError("");
    setOtpError(false);
    setIsRedirecting(false);
    setIsLoading(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpAttempts(0);
    setCanResendOtp(false);
    setResendTimer(RESEND_TIMER_SECONDS);
  }, []);

  // ✅ Memoized heading text
  const headingText = useMemo(
    () => (currentStep === 1 ? "Welcome Back" : "Verify Your Identity"),
    [currentStep]
  );

  const subHeadingText = useMemo(
    () =>
      currentStep === 1
        ? "Sign in securely with passwordless authentication"
        : "Enter the verification code sent to your email",
    [currentStep]
  );

  return (
    <div className="bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md lg:max-w-5xl">
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

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent mb-2">
                {headingText}
              </h1>
              <p className="text-gray-600 text-sm">{subHeadingText}</p>
            </div>

            <ErrorAlert 
              error={error} 
              otpError={otpError} 
              currentStep={currentStep} 
              otpAttempts={otpAttempts} 
            />

            {isRedirecting && <RedirectingAlert profileLoaded={profileLoaded} />}

            {currentStep === 1 && (
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black bg-white"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full py-3 px-6 text-base bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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

                <div className="text-center pt-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <form className="space-y-4" onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Enter the 6-digit verification code sent to
                    </p>
                    <p className="text-sm font-semibold text-cyan-600 bg-cyan-50 rounded-lg py-2 px-4 inline-block mb-4 break-all">
                      {email}
                    </p>
                  </div>

                  <OTPInput
                    otp={otp}
                    otpRefs={otpRefs}
                    otpError={otpError}
                    isLoading={isLoading}
                    isRedirecting={isRedirecting}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onOtpPaste={handleOtpPaste}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isRedirecting}
                  className="w-full py-3 px-6 text-base bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="flex flex-col items-center space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading || isRedirecting || !canResendOtp}
                    className="text-sm text-cyan-600 hover:text-cyan-800 font-medium disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                  >
                    {canResendOtp ? "Didn't receive the code? Resend" : `Resend OTP in ${resendTimer}s`}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    disabled={isRedirecting}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
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
