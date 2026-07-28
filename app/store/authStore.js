"use client";

import { create } from "zustand";
import api from "../lib/api";
import { getToken, setToken, clearToken } from "../lib/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  status: "idle", // idle | loading | authenticated | guest
  error: null,

  init: async () => {
    const token = getToken();
    if (!token) {
      set({ status: "guest" });
      return;
    }
    set({ status: "loading", token });
    try {
      const res = await api.getMe(token);
      set({ user: res?.data || res?.user || res, status: "authenticated", token });
    } catch (err) {
      clearToken();
      set({ user: null, token: null, status: "guest" });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    const res = await api.login({ email, password });
    const token = res?.token || res?.data?.token;
    if (!token) throw new Error("Token tidak ditemukan pada respons login.");
    setToken(token);
    set({ token, status: "loading" });
    try {
      const me = await api.getMe(token);
      set({ user: me?.data || me?.user || me, status: "authenticated" });
    } catch (_) {
      set({ status: "authenticated" });
    }
    return res;
  },

  register: async (payload) => {
    set({ error: null });
    const res = await api.register(payload);
    return res;
  },

  logout: () => {
    clearToken();
    set({ user: null, token: null, status: "guest" });
  },
}));
