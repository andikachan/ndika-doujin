"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";
import MangaCard from "../components/MangaCard";
import { GridSkeleton } from "../components/LoadingSkeleton";
import { initials, levelFromXp, timeAgo } from "../lib/utils";
import { toast } from "../store/toastStore";

function ProfileContent() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.allSettled([api.getHistory(token), api.getBookmarks(token)]).then(([h, b]) => {
      if (h.status === "fulfilled") setHistory(h.value?.data || h.value?.history || []);
      if (b.status === "fulfilled") setBookmarks(b.value?.data || b.value?.bookmarks || []);
      setLoading(false);
    });
  }, [token]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    setEditing(false);
    toast("Profil diperbarui secara lokal.", "success");
  }

  const xp = user?.xp || 0;
  const { level, currentLevelXp, nextLevelXp } = levelFromXp(xp);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-light bg-card-light p-8 text-center shadow-sm animate-fadeIn dark:border-border-dark dark:bg-card-dark sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
          {initials(user?.full_name || user?.username || "U")}
        </span>

        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink-light dark:text-ink-dark">
            {user?.full_name || user?.username}
          </h1>
          <p className="text-sm text-ink-light/50 dark:text-ink-dark/40">@{user?.username}</p>
          <p className="text-sm text-ink-light/50 dark:text-ink-dark/40">{user?.email}</p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-medium text-ink-light/60 dark:text-ink-dark/40">
              <span>Level {level}</span>
              <span>{currentLevelXp}/{nextLevelXp} XP</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border-light dark:bg-border-dark">
              <div
                className="h-full bg-gradient-to-r from-primary-light to-primary-dark transition-all duration-500"
                style={{ width: `${(currentLevelXp / nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-light transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-ink-dark"
          >
            Edit Profil
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Logout
          </button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSaveProfile} className="mt-4 flex animate-fadeIn gap-2 rounded-xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap"
            className="flex-1 rounded-lg border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
          />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
            Simpan
          </button>
        </form>
      )}

      <div className="mt-8 flex gap-2 border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "history" ? "border-b-2 border-primary text-primary" : "text-ink-light/50 dark:text-ink-dark/40"}`}
        >
          Riwayat Baca
        </button>
        <button
          onClick={() => setTab("bookmarks")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "bookmarks" ? "border-b-2 border-primary text-primary" : "text-ink-light/50 dark:text-ink-dark/40"}`}
        >
          Bookmark
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <GridSkeleton count={6} />
        ) : tab === "history" ? (
          history.length === 0 ? (
            <EmptyState message="Belum ada riwayat baca." />
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <Link
                  key={h.id || `${h.manga_id}-${h.chapter_id}`}
                  href={h.chapter_id ? `/reader/${h.chapter_id}` : `/manga/${h.manga?.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border-light px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5 dark:border-border-dark"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-light dark:text-ink-dark">
                      {h.manga?.title || h.manga_title}
                    </p>
                    <p className="text-xs text-ink-light/50 dark:text-ink-dark/40">
                      Chapter {h.chapter?.number ?? h.chapter_number} · {timeAgo(h.updated_at || h.created_at)}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-light/30">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              ))}
            </div>
          )
        ) : bookmarks.length === 0 ? (
          <EmptyState message="Belum ada bookmark." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {bookmarks.map((b) => (
              <MangaCard key={b.id || b.manga_id} manga={b.manga || b} isBookmarked />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-xl border border-dashed border-border-light py-16 text-center text-sm text-ink-light/50 dark:border-border-dark dark:text-ink-dark/40">
      {message}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
