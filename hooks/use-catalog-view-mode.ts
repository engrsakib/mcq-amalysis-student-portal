"use client";

import { useEffect, useState } from "react";

export type CatalogViewMode = "card" | "list";

function parseStoredView(value: string | null): CatalogViewMode {
  return value === "list" ? "list" : "card";
}

export function useCatalogViewMode(storageKey: string) {
  const [viewMode, setViewMode] = useState<CatalogViewMode>("card");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setViewMode(parseStoredView(localStorage.getItem(storageKey)));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, viewMode);
    } catch {
      /* ignore */
    }
  }, [viewMode, hydrated, storageKey]);

  return {
    viewMode: hydrated ? viewMode : "card",
    setViewMode,
  };
}
