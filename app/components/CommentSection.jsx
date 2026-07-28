"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { timeAgo, initials } from "../lib/utils";
import { toast } from "../store/toastStore";

export function CommentItem({ comment, onReply, depth = 0 }) {
  const { isAuthenticated, token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count || comment.likes || 0);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  async function handleLike() {
    if (!isAuthenticated) {
      toast("Login dulu untuk menyukai komentar", "error");
      return;
    }
    try {
      await api.likeComment(comment.id, token);
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    } catch (err) {
      toast(err.message || "Gagal menyukai komentar", "error");
    }
  }

  function handleReport() {
    toast("Komentar dilaporkan. Tim kami akan meninjau.", "success");
  }

  function submitReply() {
    if (!replyText.trim()) return;
    onReply?.(comment.id, replyText.trim());
    setReplyText("");
    setReplying(false);
  }

  return (
    <div className={depth > 0 ? "ml-8 mt-3 border-l border-border-light pl-4 dark:border-border-dark" : "border-b border-border-light py-4 last:border-none dark:border-border-dark"}>
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initials(comment.user?.full_name || comment.user?.username || comment.username || "?")}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-light dark:text-ink-dark">
              {comment.user?.username || comment.username || "Pengguna"}
            </span>
            <span className="text-xs text-ink-light/40 dark:text-ink-dark/40">
              {timeAgo(comment.created_at)}
            </span>
          </div>
          {comment.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comment.imageUrl} alt="lampiran" className="mt-2 max-h-48 rounded-lg border border-border-light dark:border-border-dark" loading="lazy" />
          )}
          <p className="mt-1 text-sm leading-relaxed text-ink-light/80 dark:text-ink-dark/70">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center gap-4 text-xs font-medium text-ink-light/50 dark:text-ink-dark/40">
            <button onClick={handleLike} className={`flex items-center gap-1 transition-colors hover:text-primary ${liked ? "text-primary" : ""}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              </svg>
              {likeCount}
            </button>
            <button onClick={() => setReplying((v) => !v)} className="hover:text-primary">
              Balas
            </button>
            <button onClick={handleReport} className="hover:text-red-500">
              Laporkan
            </button>
          </div>

          {replying && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="flex-1 rounded-lg border border-border-light bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary dark:border-border-dark"
              />
              <button onClick={submitReply} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover">
                Kirim
              </button>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ targetId, type = "manga" }) {
  const { isAuthenticated, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [submitting, setSubmitting] = useState(false);

  const fetcher = type === "manga" ? api.getMangaComments : api.getChapterComments;
  const poster = type === "manga" ? api.postMangaComment : api.postChapterComment;

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);
    fetcher(targetId, { sortBy })
      .then((res) => setComments(res?.data || res?.comments || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, sortBy]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast("Login untuk mengirim komentar", "error");
      return;
    }
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await poster(token, { content: content.trim() });
      setContent("");
      toast("Komentar terkirim", "success");
      const res = await fetcher(targetId, { sortBy });
      setComments(res?.data || res?.comments || []);
    } catch (err) {
      toast(err.message || "Gagal mengirim komentar", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(parentId, text) {
    if (!isAuthenticated) {
      toast("Login untuk membalas komentar", "error");
      return;
    }
    try {
      await poster(token, { content: text, parentId });
      toast("Balasan terkirim", "success");
      const res = await fetcher(targetId, { sortBy });
      setComments(res?.data || res?.comments || []);
    } catch (err) {
      toast(err.message || "Gagal membalas komentar", "error");
    }
  }

  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark">
          Komentar ({comments.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-border-light bg-transparent px-2 py-1 text-xs text-ink-light dark:border-border-dark dark:text-ink-dark"
        >
          <option value="Latest">Terbaru</option>
          <option value="Oldest">Terlama</option>
          <option value="Popular">Populer</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? "Tulis komentar..." : "Login untuk berkomentar"}
          disabled={!isAuthenticated}
          className="flex-1 rounded-lg border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-border-dark"
        />
        <button
          type="submit"
          disabled={submitting || !isAuthenticated}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          Kirim
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink-light/40">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-light/40">Jadilah yang pertama berkomentar.</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} onReply={handleReply} />
          ))}
        </div>
      )}
    </section>
  );
}
