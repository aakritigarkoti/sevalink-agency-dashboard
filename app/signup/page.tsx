"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { getStoredUser, setStoredUser } from "@/lib/local-auth";

type SignupErrors = {
  name?: string;
  agency?: string;
  location?: string;
  phone?: string;
  otp?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("123456");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});

  useEffect(() => {
    const user = getStoredUser();

    if (user?.name && user.phone) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignupErrors = {};

    if (!name.trim()) nextErrors.name = "Full name is required";
    if (!agency.trim()) nextErrors.agency = "Agency name is required";
    if (!location.trim()) nextErrors.location = "Location is required";
    if (!/^\d{10}$/.test(phone)) nextErrors.phone = "Phone number must be 10 digits";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsOtpStep(true);
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp) || otp !== "123456") {
      setErrors((current) => ({ ...current, otp: "Invalid OTP" }));
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setStoredUser({
      name: name.trim(),
      agency: agency.trim(),
      location: location.trim(),
      phone,
    });

    addToast("Account Created", "success");
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-gray-950">
      <div className="animate-auth-in w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 dark:border dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-7 text-center">
          <Image src="/SevaLink-logo-r.png" alt="SevaLink" width={120} height={32} className="mx-auto" priority />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create Account</h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">Set up your agency access</p>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              disabled={isOtpStep}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="agency" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Agency Name</label>
            <input
              id="agency"
              type="text"
              value={agency}
              onChange={(event) => setAgency(event.target.value)}
              placeholder="Enter agency name"
              disabled={isOtpStep}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
            {errors.agency ? <p className="mt-1 text-xs text-rose-600">{errors.agency}</p> : null}
          </div>

          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Enter location"
              disabled={isOtpStep}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
            {errors.location ? <p className="mt-1 text-xs text-rose-600">{errors.location}</p> : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter 10-digit phone"
              disabled={isOtpStep}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
            {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
          </div>

          {!isOtpStep ? (
            <button type="submit" className="h-10 w-full rounded-lg bg-blue-600 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Create Account
            </button>
          ) : (
            <>
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">OTP</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Pre-filled OTP: 123456</p>
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
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
