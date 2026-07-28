'use client';

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "../lib/api";
import { useGenres } from "../hooks/useManga";
import MangaCard from "../components/MangaCard";
import Pagination from "../components/Pagination";
import { GridSkeleton } from "../components/LoadingSkeleton";

const STATUS_OPTIONS = ["Ongoing", "Completed", "Hiatus"];
const TYPE_OPTIONS = ["Manga", "Manhwa", "Doujinshi"];
const SORT_OPTIONS = [
  { value: "latest_chapter", label: "Update Terbaru" },
  { value: "newest", label: "Terbaru Ditambahkan" },
  { value: "oldest", label: "Terlama" },
  { value: "popular", label: "Populer" },
];
const PAGE_SIZE = 18;

// Komponen terpisah untuk bagian yang menggunakan useSearchParams
function ExploreContent() {
  const searchParams = useSearchParams();
  const { genres } = useGenres();

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest_chapter");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const buildParams = useCallback(
    (pageNum) => ({
      limit: PAGE_SIZE,
      page: pageNum,
      sort,
      search: search || undefined,
      genre: genre || undefined,
      status: status || undefined,
      type: type || undefined,
    }),
    [search, genre, status, type, sort]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPage(1);
    api
      .getMangaList(buildParams(1))
      .then((res) => {
        const data = res?.data || res?.results || [];
        setResults(data);
        setTotal(res?.meta?.total ?? res?.pagination?.total ?? null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [buildParams]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.getMangaList(buildParams(nextPage));
      const data = res?.data || res?.results || [];
      setResults((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMore = total ? results.length < total : results.length >= PAGE_SIZE * page;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-ink-light dark:text-ink-dark">Explore</h1>
      <p className="mt-1 text-sm text-ink-light/50 dark:text-ink-dark/40">
        Cari dan saring komik berdasarkan genre, status, tipe, dan urutan.
      </p>

      <div className="mt-6 space-y-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul komik..."
          className="w-full rounded-xl border border-border-light bg-card-light px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-card-dark"
        />

        <div className="flex flex-wrap gap-3">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-border-light bg-card-light px-3 py-2 text-sm dark:border-border-dark dark:bg-card-dark"
          >
            <option value="">Semua Genre</option>
            {genres.map((g) => (
              <option key={g.id || g.slug || g.name} value={g.slug || g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border-light bg-card-light px-3 py-2 text-sm dark:border-border-dark dark:bg-card-dark"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-border-light bg-card-light px-3 py-2 text-sm dark:border-border-dark dark:bg-card-dark"
          >
            <option value="">Semua Tipe</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-auto rounded-lg border border-border-light bg-card-light px-3 py-2 text-sm dark:border-border-dark dark:bg-card-dark"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <GridSkeleton count={12} />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : results.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-light/50 dark:text-ink-dark/40">
            Tidak ada komik yang cocok dengan filter ini.
          </p>
        ) : (
          <>
            <p className="mb-4 text-xs text-ink-light/50 dark:text-ink-dark/40">
              {results.length}{total ? ` dari ${total}` : ""} hasil ditemukan
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((manga) => (
                <MangaCard key={manga.id || manga.slug} manga={manga} />
              ))}
            </div>
            <Pagination onLoadMore={handleLoadMore} loading={loadingMore} hasMore={hasMore} />
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback
function ExploreFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-ink-light dark:text-ink-dark">Explore</h1>
      <p className="mt-1 text-sm text-ink-light/50 dark:text-ink-dark/40">Loading...</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        ))}
      </div>
    </div>
  );
}

// Export utama dengan Suspense
export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreContent />
    </Suspense>
  );
}