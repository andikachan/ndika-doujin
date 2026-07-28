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
      setData(res?.data || res?.results || []);
      setMeta(res?.meta || res?.pagination || null);
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
        if (active) setData(res?.data || res);
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
      .then((res) => setGenres(res?.data || res?.genres || []))
      .catch(() => setGenres([]))
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading };
}
