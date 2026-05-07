"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api-config";
import { setAuthSession } from "@/lib/local-auth";

type LoginErrors = {
  phone?: string;
  password?: string;
  submit?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    const cleanedPhone = phone.replace(/\D/g, "").slice(0, 10);

    if (!/^\d{10}$/.test(cleanedPhone)) {
      nextErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanedPhone,
          password,
        }),
      });

      const data = (await res.json()) as {
        accessToken?: string;
        message?: string;
        user?: {
          role?: string;
          name?: string;
          phone?: string;
          [key: string]: unknown;
        };
      };

      if (!res.ok) {
        setErrors({ submit: data.message || "Login failed. Please try again." });
        return;
      }

      if (!data.accessToken) {
        setErrors({ submit: "Invalid server response. Missing access token." });
        return;
      }

      if (data.user?.role !== "homecare_agency") {
        setErrors({ submit: "This account is not authorized as an agency user." });
        return;
      }

      setAuthSession(data.accessToken, data.user ?? { phone: cleanedPhone });
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Unable to connect. Please check your server and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-sky-50 via-white to-blue-50 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_18%,rgba(186,230,253,0.55),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(219,234,254,0.5),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md items-center">
        <Card className="w-full rounded-3xl border-border/70 bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-8 text-center">
            <Image
              src="/SevaLink-logo-r.png"
              alt="SevaLink"
              width={132}
              height={36}
              className="mx-auto"
              priority
            />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              Agency Sign In
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Login to manage bookings, providers, and operations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errors.submit ? (
              <div className="rounded-xl border border-rose-300/70 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
                {errors.submit}
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={loading}
                className="h-11 rounded-xl bg-background/70 px-3"
              />
              {errors.phone ? <p className="text-xs font-medium text-rose-600">{errors.phone}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                className="h-11 rounded-xl bg-background/70 px-3"
              />
              {errors.password ? <p className="text-xs font-medium text-rose-600">{errors.password}</p> : null}
            </div>

            <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl text-sm font-semibold">
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 text-sm">
            <Link href="/auth/forgot-password" className="text-muted-foreground transition-colors hover:text-foreground">
              Forgot password?
            </Link>
            <p className="text-xs text-muted-foreground">Need access? Contact your administrator.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
