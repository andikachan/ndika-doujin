"use client";

import Link from "next/link";
import { useMangaList } from "./hooks/useManga";
import MangaCard from "./components/MangaCard";
import { GridSkeleton } from "./components/LoadingSkeleton";
import SakuraLogo from "./components/SakuraLogo";

export default function HomePage() {
  const popular = useMangaList({ limit: 12, sort: "popular" });
  const latest = useMangaList({ limit: 12, sort: "latest_chapter" });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border-light dark:border-border-dark">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-32 h-64 w-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-fadeIn">
            <SakuraLogo className="h-9 w-9" />
          </div>
          <h1 className="animate-fadeIn text-3xl font-bold tracking-tight text-ink-light dark:text-ink-dark sm:text-5xl">
            Baca komik favoritmu, <span className="text-primary">tanpa gangguan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl animate-fadeIn text-sm text-ink-light/60 dark:text-ink-dark/50 sm:text-base">
            Ribuan judul manga, manhwa, dan komik indie — diperbarui setiap hari, tampil rapi di setiap layar.
          </p>
          <div className="mt-8 flex animate-fadeIn items-center justify-center gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Mulai Jelajahi
            </Link>
            <Link
              href="/explore?sort=popular"
              className="rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-light transition-colors duration-200 hover:border-primary hover:text-primary dark:border-border-dark dark:text-ink-dark"
            >
              Lihat Populer
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark sm:text-2xl">
            Komik Populer
          </h2>
          <Link href="/explore?sort=popular" className="text-sm font-medium text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        {popular.loading ? (
          <GridSkeleton count={6} />
        ) : popular.error ? (
          <p className="text-sm text-red-500">{popular.error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {popular.data.map((manga) => (
              <MangaCard key={manga.id || manga.slug} manga={manga} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark sm:text-2xl">
            Update Terbaru
          </h2>
          <Link href="/explore?sort=latest_chapter" className="text-sm font-medium text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        {latest.loading ? (
          <GridSkeleton count={6} />
        ) : latest.error ? (
          <p className="text-sm text-red-500">{latest.error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {latest.data.map((manga) => (
              <MangaCard key={manga.id || manga.slug} manga={manga} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
