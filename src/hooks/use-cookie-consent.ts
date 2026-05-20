"use client";

import { useCallback, useEffect, useState } from "react";

export type ConsentPrefs = {
  analytics: boolean;
  marketing: boolean;
};

type ConsentData = {
  prefs: ConsentPrefs;
  savedAt: string;
};

type Status = "pending" | "saved";

const STORAGE_KEY = "algarve_cookie_consent";
const COOKIE_NAME = "algarve_consent";

function persistConsent(prefs: ConsentPrefs) {
  const data: ConsentData = { prefs, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=1; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export function useCookieConsent() {
  const [status, setStatus] = useState<Status>("pending");
  const [prefs, setPrefs] = useState<ConsentPrefs>({ analytics: false, marketing: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: ConsentData = JSON.parse(raw);
        setPrefs(data.prefs);
        setStatus("saved");
      }
    } catch {}
  }, []);

  const acceptAll = useCallback(() => {
    const all: ConsentPrefs = { analytics: true, marketing: true };
    persistConsent(all);
    setPrefs(all);
    setStatus("saved");
  }, []);

  const acceptEssential = useCallback(() => {
    const essential: ConsentPrefs = { analytics: false, marketing: false };
    persistConsent(essential);
    setPrefs(essential);
    setStatus("saved");
  }, []);

  const saveCustom = useCallback((custom: ConsentPrefs) => {
    persistConsent(custom);
    setPrefs(custom);
    setStatus("saved");
  }, []);

  return { status, prefs, mounted, acceptAll, acceptEssential, saveCustom };
}
