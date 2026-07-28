"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { TextLineSkeleton } from "./LoadingSkeleton";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-16">
        <TextLineSkeleton className="h-8 w-1/3" />
        <TextLineSkeleton className="h-4 w-full" />
        <TextLineSkeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
