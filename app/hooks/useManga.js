"use client";

import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";

export function useMangaList(params) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMangaList(params);
      
      // 🔥 PERBAIKAN: Handle berbagai kemungkinan response
      let mangaData = [];
      let metaData = null;
      
      if (Array.isArray(res)) {
        // Response langsung array
        mangaData = res;
      } else if (res?.data && Array.isArray(res.data)) {
        // Response { data: [...] }
        mangaData = res.data;
        metaData = res.meta || res.pagination || null;
      } else if (res?.results && Array.isArray(res.results)) {
        // Response { results: [...] }
        mangaData = res.results;
        metaData = res.meta || res.pagination || null;
      } else {
        // Fallback: coba apapun yang bisa diiterasi
        mangaData = Array.isArray(res) ? res : [];
      }
      
      setData(mangaData);
      setMeta(metaData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, meta, loading, error, reload: load };
}

export function useMangaDetail(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    api
      .getMangaDetail(slug)
      .then((res) => {
        if (active) {
          // Handle response yang mungkin array atau object
          if (Array.isArray(res)) {
            setData(res[0] || null);
          } else {
            setData(res?.data || res || null);
          }
        }
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
  }, [slug]);

  return { data, loading, error };
}

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getGenres()
      .then((res) => {
        // Handle berbagai kemungkinan response
        if (Array.isArray(res)) {
          setGenres(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setGenres(res.data);
        } else if (res?.genres && Array.isArray(res.genres)) {
          setGenres(res.genres);
        } else {
          setGenres([]);
        }
      })
      .catch(() => setGenres([]))
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading };
}