import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";

const STATUS_STYLES = {
  Ongoing: "bg-primary/10 text-primary",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Hiatus: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function MangaCard({ manga, isBookmarked = false }) {
  if (!manga) return null;
  const {
    slug,
    title,
    cover,
    cover_image,
    type,
    status,
    latest_chapter,
  } = manga;

  const coverUrl = cover || cover_image;
  const imgSrc = coverUrl ? api.proxyImageUrl(coverUrl) : null;

  return (
    <Link
      href={`/manga/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 animate-fadeIn dark:border-border-dark dark:bg-card-dark"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-border-light dark:bg-border-dark">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-light/40">
            No cover
          </div>
        )}

        {isBookmarked && (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-primary-light backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2h12a1 1 0 011 1v18l-7-4-7 4V3a1 1 0 011-1z" />
            </svg>
          </span>
        )}

        {type && (
          <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
            {type}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-light group-hover:text-primary dark:text-ink-dark">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          {status && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[status] || "bg-border-light text-ink-light/60"}`}>
              {status}
            </span>
          )}
          {latest_chapter && (
            <span className="text-[11px] text-ink-light/50 dark:text-ink-dark/40">
              Ch. {latest_chapter}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
