import Link from "next/link";
import SakuraLogo from "./SakuraLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <SakuraLogo className="w-6 h-6" />
              <span className="text-base font-semibold text-ink-light dark:text-ink-dark">
                Doujin <span className="text-primary">Ndichan</span>
              </span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-ink-light/60 dark:text-ink-dark/50">
              Baca manga, manhwa, dan komik indie favoritmu — rapi, cepat, dan nyaman di mata.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div>
              <p className="mb-2 font-medium text-ink-light dark:text-ink-dark">Navigasi</p>
              <ul className="space-y-1.5 text-ink-light/60 dark:text-ink-dark/50">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/explore" className="hover:text-primary">Explore</Link></li>
                <li><Link href="/profile" className="hover:text-primary">Profile</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink-light dark:text-ink-dark">Akun</p>
              <ul className="space-y-1.5 text-ink-light/60 dark:text-ink-dark/50">
                <li><Link href="/login" className="hover:text-primary">Login</Link></li>
                <li><Link href="/register" className="hover:text-primary">Register</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border-light pt-6 text-xs text-ink-light/40 dark:border-border-dark dark:text-ink-dark/40">
          © {new Date().getFullYear()} Doujin Ndichan. Dibuat untuk pembaca komik.
        </div>
      </div>
    </footer>
  );
}
