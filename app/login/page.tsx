"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { getStoredUser, setPendingPhone } from "@/lib/local-auth";

type LoginErrors = {
  phone?: string;
  otp?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => {
    const user = getStoredUser();

    if (user?.name && user.phone) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setErrors({ phone: "Phone number must be 10 digits" });
      return;
    }

    setErrors({});
    setIsOtpStep(true);
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp) || otp !== "123456") {
      setErrors({ otp: "Invalid OTP" });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = getStoredUser();

    addToast("Login Successful", "success");

    if (user?.phone === phone && user.name) {
      router.replace("/dashboard");
    } else {
      setPendingPhone(phone);
      router.replace("/setup");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-gray-950">
      <div className="animate-auth-in w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 dark:border dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-7 text-center">
          <Image src="/SevaLink-logo-r.png" alt="SevaLink" width={120} height={32} className="mx-auto" priority />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">Login with your phone number</p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter 10-digit phone number"
              disabled={isLoading || isOtpStep}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 dark:text-gray-100 ${
                errors.phone
                  ? "border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-500 dark:border-rose-500/60 dark:bg-rose-500/10"
                  : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
              } disabled:bg-gray-100 dark:disabled:bg-gray-800`}
            />
            {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
          </div>

          {!isOtpStep ? (
            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-blue-600 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Send OTP
            </button>
          ) : (
            <>
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 dark:text-gray-100 ${
                    errors.otp
                      ? "border-rose-300 bg-rose-50 focus:ring-2 focus:ring-rose-500 dark:border-rose-500/60 dark:bg-rose-500/10"
                      : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Demo OTP: 123456</p>
                {errors.otp ? <p className="mt-1 text-xs text-rose-600">{errors.otp}</p> : null}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </>
          )}
        </form>

        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
          New agency?{" "}
          <Link href="/signup" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
