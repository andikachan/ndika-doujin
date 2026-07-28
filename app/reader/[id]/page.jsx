"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import CommentSection from "../../components/CommentSection";
import { TextLineSkeleton } from "../../components/LoadingSkeleton";

export default function ReaderPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api
      .getChapter(id)
      .then((res) => {
        if (active) setChapter(res?.data || res);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  // record history / view once chapter loads
  useEffect(() => {
    if (!chapter) return;
    api.recordChapterView(id, token || undefined).catch(() => {});
  }, [chapter, id, token]);

  // scroll progress bar
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const height = doc.scrollHeight - doc.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goPrev = useCallback(() => {
    if (chapter?.prev_chapter_id) router.push(`/reader/${chapter.prev_chapter_id}`);
  }, [chapter, router]);

  const goNext = useCallback(() => {
    if (chapter?.next_chapter_id) router.push(`/reader/${chapter.next_chapter_id}`);
  }, [chapter, router]);

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (loading) {
    return (
      <div className="mx-auto max-w-reader space-y-4 px-4 py-10">
        <TextLineSkeleton className="h-6 w-2/3" />
        <TextLineSkeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm text-red-500">{error || "Chapter tidak ditemukan."}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const pages = chapter.pages || chapter.images || [];
  const chapterList = chapter.chapters || [];
  const mangaSlug = chapter.manga?.slug || chapter.manga_slug;

  return (
    <div ref={containerRef}>
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-border-light dark:bg-border-dark">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <header className="sticky top-1 z-40 border-b border-border-light bg-surface-light/90 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/90">
        <div className="mx-auto flex max-w-reader items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => (mangaSlug ? router.push(`/manga/${mangaSlug}`) : router.back())}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-light/70 hover:bg-primary/10 hover:text-primary dark:text-ink-dark/60"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold text-ink-light dark:text-ink-dark">
              {chapter.manga?.title || chapter.manga_title}
            </p>
            <p className="text-xs text-ink-light/50 dark:text-ink-dark/40">
              Chapter {chapter.number ?? chapter.chapter_number}
            </p>
          </div>

          {chapterList.length > 0 ? (
            <select
              value={id}
              onChange={(e) => router.push(`/reader/${e.target.value}`)}
              className="max-w-[120px] shrink-0 rounded-lg border border-border-light bg-transparent px-2 py-1 text-xs dark:border-border-dark"
            >
              {chapterList.map((c) => (
                <option key={c.id} value={c.id}>
                  Ch. {c.number ?? c.chapter_number}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-8 shrink-0" />
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-reader flex-col items-center gap-1 px-0 py-4 sm:px-4">
        {pages.length === 0 ? (
          <p className="py-16 text-sm text-ink-light/50">Halaman belum tersedia.</p>
        ) : (
          pages.map((page, idx) => {
            const src = typeof page === "string" ? page : page.url || page.image;
            return (
              <div key={idx} className="relative w-full" style={{ aspectRatio: "auto" }}>
                <Image
                  src={api.proxyImageUrl(src)}
                  alt={`Halaman ${idx + 1}`}
                  width={900}
                  height={1273}
                  sizes="(max-width: 900px) 100vw, 900px"
                  className="h-auto w-full"
                  loading={idx < 2 ? "eager" : "lazy"}
                  priority={idx === 0}
                />
              </div>
            );
          })
        )}
      </main>

      <div className="mx-auto flex max-w-reader items-center justify-between gap-3 px-4 py-6">
        <button
          onClick={goPrev}
          disabled={!chapter.prev_chapter_id}
          className="flex items-center gap-1 rounded-full border border-border-light px-5 py-2.5 text-sm font-medium text-ink-light transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-dark dark:text-ink-dark"
        >
          ← Sebelumnya
        </button>
        <button
          onClick={goNext}
          disabled={!chapter.next_chapter_id}
          className="flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Selanjutnya →
        </button>
      </div>

      <div className="mx-auto max-w-reader border-t border-border-light px-4 pb-16 pt-6 dark:border-border-dark">
        <CommentSection targetId={id} type="chapter" />
      </div>
    </div>
  );
}
