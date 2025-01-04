"use client";

import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useLoader } from "./components/shared/LoaderComponent";

export default function Home() {
  const { showLoader, hideLoader } = useLoader();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (status === "authenticated") {
      router.push("/inventory"); // Redirect to dashboard if authenticated
    }
  }, [status]);

  if (status === "loading") {
    showLoader();
  }
  if (status === "authenticated") {
    redirect("/inventory");
  }
  if (status === "unauthenticated") {
    redirect("/login");
  }
  return null;
}
