"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SakuraLogo from "./SakuraLogo";
import { useAuth } from "../hooks/useAuth";
import { initials } from "../lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-light dark:border-border-dark bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <SakuraLogo className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-lg font-semibold tracking-tight text-ink-light dark:text-ink-dark">
            Doujin <span className="text-primary">Ndichan</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-ink-light/70 hover:text-primary dark:text-ink-dark/70"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5 text-sm font-medium text-ink-light transition-colors hover:border-primary dark:border-border-dark dark:text-ink-dark"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {initials(user?.full_name || user?.username || "U")}
                </span>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-light/60 transition-colors hover:text-primary dark:text-ink-dark/60"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-light dark:text-ink-dark md:hidden"
          aria-label="Buka menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border-light dark:border-border-dark md:hidden animate-fadeIn">
          <div className="flex flex-col gap-1 px-4 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-light hover:bg-primary/10 hover:text-primary dark:text-ink-dark"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-light hover:bg-primary/10 hover:text-primary dark:text-ink-dark"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-light/70 hover:bg-primary/10 hover:text-primary dark:text-ink-dark/70"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
