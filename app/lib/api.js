const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Core request helper. Attaches Authorization header when a token is passed.
 * Throws an Error with a readable message on non-2xx responses.
 */
async function request(path, { method = "GET", body, token, cache } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: cache || "no-store",
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // response had no JSON body
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

function qs(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const search = new URLSearchParams(clean).toString();
  return search ? `?${search}` : "";
}

export const api = {
  // ---- Manga ----
  getMangaList: (params = {}) => request(`/api/v1/doujin/manga${qs(params)}`),
  getMangaDetail: (slug) => request(`/api/v1/doujin/manga/${slug}`),
  getGenres: () => request(`/api/v1/doujin/genres`),

  // ---- Chapter ----
  getChapter: (id) => request(`/api/v1/doujin/chapter/${id}`),
  recordChapterView: (id, token) =>
    request(`/api/v1/doujin/chapter/${id}/view`, { method: "POST", token }),

  // ---- Comments ----
  getMangaComments: (id, params = {}) =>
    request(`/api/v1/doujin/manga/comments${qs({ id, sortBy: "Latest", page: 1, limit: 15, ...params })}`),
  getChapterComments: (id, params = {}) =>
    request(`/api/v1/doujin/chapter/comments${qs({ id, sortBy: "Latest", page: 1, limit: 15, ...params })}`),
  postMangaComment: (token, { content, imageUrl, parentId }) =>
    request(`/api/v1/doujin/manga/comments`, { method: "POST", token, body: { content, imageUrl, parentId } }),
  postChapterComment: (token, { content, imageUrl, parentId }) =>
    request(`/api/v1/doujin/chapter/comments`, { method: "POST", token, body: { content, imageUrl, parentId } }),
  likeComment: (id, token) => request(`/api/v1/doujin/comment/${id}/like`, { method: "POST", token }),

  // ---- Auth ----
  register: ({ username, email, password, full_name }) =>
    request(`/api/v1/doujin/auth/register`, { method: "POST", body: { username, email, password, full_name } }),
  login: ({ email, password }) =>
    request(`/api/v1/doujin/auth/login`, { method: "POST", body: { email, password } }),
  getMe: (token) => request(`/api/v1/doujin/auth/me`, { token }),

  // ---- User ----
  getHistory: (token) => request(`/api/v1/doujin/user/history`, { token }),
  getBookmarks: (token) => request(`/api/v1/doujin/user/bookmarks`, { token }),
  addBookmark: (token, manga_id) =>
    request(`/api/v1/doujin/user/bookmarks`, { method: "POST", token, body: { manga_id } }),

  // ---- Image proxy ----
  proxyImageUrl: (url) => `${BASE_URL}/api/v1/doujin/proxy-image${qs({ url })}`,
};

export default api;
