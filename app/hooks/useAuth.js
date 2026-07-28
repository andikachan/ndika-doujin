"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, token, status, init, login, register, logout } = useAuthStore();

  useEffect(() => {
    if (status === "idle") init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    user,
    token,
    isAuthenticated: status === "authenticated",
    isLoading: status === "idle" || status === "loading",
    login,
    register,
    logout,
  };
}
