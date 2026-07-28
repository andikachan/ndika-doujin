"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "../lib/utils";

export function ChapterCard({ chapter, mangaSlug }) {
  return (
    <Link
      href={`/reader/${chapter.id}`}
      className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3 transition-colors duration-200 hover:border-primary hover:bg-primary/5 dark:border-border-dark"
    >
      <div>
        <p className="text-sm font-medium text-ink-light dark:text-ink-dark">
          Chapter {chapter.number ?? chapter.chapter_number}
          {chapter.title ? ` — ${chapter.title}` : ""}
        </p>
        <p className="text-xs text-ink-light/50 dark:text-ink-dark/40">
          {formatDate(chapter.created_at || chapter.date)}
        </p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-light/30 dark:text-ink-dark/30">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export default function ChapterList({ chapters = [], mangaSlug }) {
  const [order, setOrder] = useState("desc");

  const sorted = useMemo(() => {
    const copy = [...chapters];
    copy.sort((a, b) => {
      const an = Number(a.number ?? a.chapter_number ?? 0);
      const bn = Number(b.number ?? b.chapter_number ?? 0);
      return order === "desc" ? bn - an : an - bn;
    });
    return copy;
  }, [chapters, order]);

  if (chapters.length === 0) {
    return <p className="text-sm text-ink-light/50 dark:text-ink-dark/40">Belum ada chapter.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark">
          Daftar Chapter ({chapters.length})
        </h3>
        <button
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="rounded-full border border-border-light px-3 py-1 text-xs font-medium text-ink-light/70 transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-ink-dark/60"
        >
          {order === "desc" ? "Terbaru" : "Terlama"} ↕
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {sorted.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} mangaSlug={mangaSlug} />
        ))}
      </div>
    </div>
  );
}
