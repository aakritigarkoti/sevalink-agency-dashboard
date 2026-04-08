"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPendingPhone, getStoredUser, setStoredUser } from "@/lib/local-auth";

type SetupErrors = {
  name?: string;
  agency?: string;
  location?: string;
};

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<SetupErrors>({});

  useEffect(() => {
    const user = getStoredUser();

    if (user?.name && user.phone) {
      router.replace("/dashboard");
      return;
    }

    const pendingPhone = getPendingPhone();

    if (!pendingPhone) {
      router.replace("/login");
      return;
    }

    setPhone(pendingPhone);
  }, [router]);

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SetupErrors = {};

    if (!name.trim()) nextErrors.name = "Full name is required";
    if (!agency.trim()) nextErrors.agency = "Agency name is required";
    if (!location.trim()) nextErrors.location = "Location is required";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !phone) {
      return;
    }

    setStoredUser({
      name: name.trim(),
      agency: agency.trim(),
      location: location.trim(),
      phone,
    });

    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-gray-950">
      <div className="animate-auth-in w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 dark:border dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="mb-7 text-center">
          <Image src="/SevaLink-logo-r.png" alt="SevaLink" width={120} height={32} className="mx-auto" priority />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Complete Setup</h1>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">Tell us about your agency profile</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            {errors.location ? <p className="mt-1 text-xs text-rose-600">{errors.location}</p> : null}
          </div>

          <button type="submit" className="h-10 w-full rounded-lg bg-blue-600 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
