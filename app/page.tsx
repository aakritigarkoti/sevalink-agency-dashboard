"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/local-auth";

export default function HomeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();

    if (user?.name && user.phone) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}
