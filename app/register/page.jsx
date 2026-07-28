"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../store/toastStore";
import SakuraLogo from "../components/SakuraLogo";

function validateUsername(username) {
  if (username.length < 6) return "Username minimal 6 karakter.";
  if (/\s/.test(username)) return "Username tidak boleh mengandung spasi.";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const usernameError = validateUsername(username);
    if (usernameError) {
      setFormError(usernameError);
      return;
    }

    setSubmitting(true);
    try {
      await register({ username, email, password, full_name: fullName || undefined });
      toast("Akun berhasil dibuat. Silakan masuk.", "success");
      router.push("/login");
    } catch (err) {
      setFormError(err.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center animate-fadeIn">
        <SakuraLogo className="h-10 w-10" />
        <h1 className="mt-3 text-2xl font-bold text-ink-light dark:text-ink-dark">Buat akun baru</h1>
        <p className="mt-1 text-sm text-ink-light/50 dark:text-ink-dark/40">Gabung dan simpan progres bacaanmu</p>
      </div>

      <form onSubmit={handleSubmit} className="animate-fadeIn space-y-4 rounded-2xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        {formError && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{formError}</p>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-light/70 dark:text-ink-dark/50">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="minimal 6 karakter, tanpa spasi"
            className="w-full rounded-lg border border-border-light bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-light/70 dark:text-ink-dark/50">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            className="w-full rounded-lg border border-border-light bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-light/70 dark:text-ink-dark/50">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-border-light bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-light/70 dark:text-ink-dark/50">
            Nama Lengkap <span className="text-ink-light/40">(opsional)</span>
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama kamu"
            className="w-full rounded-lg border border-border-light bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? "Memproses..." : "Daftar"}
        </button>
        <p className="text-center text-sm text-ink-light/60 dark:text-ink-dark/40">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
