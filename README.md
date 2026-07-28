# Doujin Ndichan

Situs baca komik (manga, manhwa, komik indie) — Next.js 14 App Router, Tailwind CSS, Zustand.

## Menjalankan secara lokal

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Buka http://localhost:3000

## Environment variable

```
NEXT_PUBLIC_API_URL=https://api.ndikacunk.my.id
```

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project di https://vercel.com/new
3. Set environment variable `NEXT_PUBLIC_API_URL` di dashboard Vercel.
4. Deploy — Vercel otomatis mendeteksi Next.js.

## Struktur

- `app/` — semua halaman App Router (home, explore, manga detail, reader, profile, login, register)
- `app/components/` — komponen UI (Navbar, Footer, MangaCard, ChapterList, CommentSection, Modal, Toast, Pagination, LoadingSkeleton, ProtectedRoute)
- `app/lib/` — klien API, helper auth token, util format
- `app/hooks/` — hook data-fetching (useAuth, useManga)
- `app/store/` — Zustand store (auth, toast)
- `middleware.js` — proteksi route `/profile` di edge

## Catatan auth

Token API disimpan di `localStorage` untuk dipakai di setiap request. Karena middleware Next.js berjalan di edge runtime dan tidak bisa membaca `localStorage`, sebuah cookie flag ringan (`ndichan_auth`, bukan token asli) di-mirror saat login/logout supaya middleware bisa mem-redirect pengguna yang belum login dari `/profile`. `ProtectedRoute` di sisi klien menjadi lapisan kedua yang memverifikasi sesi lewat `GET /v1/doujin/auth/me`.
