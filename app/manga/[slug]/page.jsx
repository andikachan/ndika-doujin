"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMangaDetail } from "../../hooks/useManga";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/api";
import ChapterList from "../../components/ChapterList";
import CommentSection from "../../components/CommentSection";
import MangaCard from "../../components/MangaCard";
import { TextLineSkeleton } from "../../components/LoadingSkeleton";
import { truncate } from "../../lib/utils";
import { toast } from "../../store/toastStore";

export default function MangaDetailPage({ params }) {
  const { slug } = params;
  const { data: manga, loading, error } = useMangaDetail(slug);
  const { isAuthenticated, token } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [continueChapterId, setContinueChapterId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !manga) return;
    api
      .getBookmarks(token)
      .then((res) => {
        const list = res?.data || res?.bookmarks || [];
        setBookmarked(list.some((b) => b.manga_id === manga.id || b.id === manga.id || b.slug === manga.slug));
      })
      .catch(() => {});
    api
      .getHistory(token)
      .then((res) => {
        const list = res?.data || res?.history || [];
        const entry = list.find((h) => h.manga_id === manga.id || h.manga?.slug === manga.slug);
        if (entry) setContinueChapterId(entry.chapter_id || entry.chapter?.id);
      })
      .catch(() => {});
  }, [isAuthenticated, manga, token]);

  async function handleBookmark() {
    if (!isAuthenticated) {
      toast("Login untuk menambahkan bookmark", "error");
      return;
    }
    setBookmarkBusy(true);
    try {
      await api.addBookmark(token, manga.id);
      setBookmarked((v) => !v);
      toast(bookmarked ? "Dihapus dari bookmark" : "Ditambahkan ke bookmark", "success");
    } catch (err) {
      toast(err.message || "Gagal memperbarui bookmark", "error");
    } finally {
      setBookmarkBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6">
        <TextLineSkeleton className="h-64 w-full rounded-2xl" />
        <TextLineSkeleton className="h-8 w-1/2" />
        <TextLineSkeleton className="h-4 w-full" />
        <TextLineSkeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-sm text-red-500">{error || "Komik tidak ditemukan."}</p>
        <Link href="/explore" className="mt-4 inline-block text-sm text-primary hover:underline">
          Kembali ke Explore
        </Link>
      </div>
    );
  }

  const chapters = manga.chapters || [];
  const firstChapter = [...chapters].sort(
    (a, b) => (a.number ?? a.chapter_number ?? 0) - (b.number ?? b.chapter_number ?? 0)
  )[0];
  const readHref = continueChapterId ? `/reader/${continueChapterId}` : firstChapter ? `/reader/${firstChapter.id}` : null;
  const coverUrl = manga.cover || manga.cover_image;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative mx-auto aspect-[3/4] w-48 shrink-0 overflow-hidden rounded-2xl shadow-lg sm:mx-0 sm:w-56">
          {coverUrl ? (
            <Image src={api.proxyImageUrl(coverUrl)} alt={manga.title} fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-border-light dark:bg-border-dark" />
          )}
        </div>

        <div className="flex-1 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            {manga.type && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{manga.type}</span>
            )}
            {manga.status && (
              <span className="rounded-full bg-border-light px-3 py-1 text-xs font-medium text-ink-light/70 dark:bg-border-dark dark:text-ink-dark/60">
                {manga.status}
              </span>
            )}
            {manga.rating && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                ★ {manga.rating}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold text-ink-light dark:text-ink-dark sm:text-3xl">{manga.title}</h1>

          {manga.genres?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {manga.genres.map((g) => (
                <span key={g.id || g.name} className="rounded-full border border-border-light px-2.5 py-1 text-xs text-ink-light/60 dark:border-border-dark dark:text-ink-dark/50">
                  {g.name || g}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4">
            <p className={`text-sm leading-relaxed text-ink-light/70 dark:text-ink-dark/60 ${expanded ? "" : "line-clamp-3"}`}>
              {manga.synopsis || manga.description || "Sinopsis belum tersedia."}
            </p>
            {(manga.synopsis || manga.description || "").length > 160 && (
              <button onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs font-medium text-primary hover:underline">
                {expanded ? "Sembunyikan" : "Baca selengkapnya"}
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {readHref && (
              <Link
                href={readHref}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                {continueChapterId ? "Lanjut Membaca" : "Baca Chapter Pertama"}
              </Link>
            )}
            <button
              onClick={handleBookmark}
              disabled={bookmarkBusy}
              className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors ${
                bookmarked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-light text-ink-light hover:border-primary hover:text-primary dark:border-border-dark dark:text-ink-dark"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M6 2h12a1 1 0 011 1v18l-7-4-7 4V3a1 1 0 011-1z" />
              </svg>
              {bookmarked ? "Tersimpan" : "Bookmark"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ChapterList chapters={chapters} mangaSlug={slug} />
      </div>

      <div className="mt-10 border-t border-border-light pt-6 dark:border-border-dark">
        <CommentSection targetId={manga.id} type="manga" />
      </div>

      {manga.recommendations?.length > 0 && (
        <div className="mt-10 border-t border-border-light pt-6 dark:border-border-dark">
          <h3 className="mb-4 text-lg font-semibold text-ink-light dark:text-ink-dark">Rekomendasi</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {manga.recommendations.map((rec) => (
              <MangaCard key={rec.id || rec.slug} manga={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
