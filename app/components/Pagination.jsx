export default function Pagination({ onLoadMore, loading, hasMore, resultCount, totalCount }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {typeof resultCount === "number" && (
        <p className="text-xs text-ink-light/50 dark:text-ink-dark/40">
          Menampilkan {resultCount}{totalCount ? ` dari ${totalCount}` : ""} komik
        </p>
      )}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Muat Lebih Banyak"}
        </button>
      )}
    </div>
  );
}
