"use client";

import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (status === "authenticated") {
      router.push("/inventory"); // Redirect to dashboard if authenticated
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    redirect("/inventory");
  }
  if (status === "unauthenticated") {
    redirect("/login");
  }
  return null;
}
