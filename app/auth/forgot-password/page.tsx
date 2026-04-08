"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FormErrors {
  email?: string;
  submit?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex mb-4">
              <Image
                src="/SevaLink-logo-r.png"
                alt="SevaLink"
                width={120}
                height={32}
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive reset instructions
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex gap-3">
                  <div className="text-emerald-600 mt-0.5">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Check your email</p>
                    <p className="mt-1 text-xs text-emerald-800">
                      We've sent password reset instructions to {email}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Didn't receive an email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {errors.submit ? (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
                  <p className="text-sm font-medium text-rose-800">{errors.submit}</p>
                </div>
              ) : null}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 transition-colors duration-200 outline-none ${
                    errors.email
                      ? "border-rose-300 bg-rose-50 text-gray-900 focus:ring-2 focus:ring-rose-500"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                  } disabled:bg-gray-50 disabled:text-gray-500`}
                />
                {errors.email ? (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.email}</p>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-600 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
