import { useCallback, useEffect, useMemo, useState } from "react";
import type { BrowserSession } from "../types/vehicle";

export const SESSION_STORAGE_KEY = "openlane-session-v1";

const EMPTY_SESSION: BrowserSession = { placedBids: {}, watchlist: {} };

export function useBrowserSession() {
  const [session, setSession] = useState<BrowserSession>(() => readStoredSession());

  useEffect(() => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const placeBid = useCallback((vehicleId: string, amount: number) => {
    setSession((current) => ({
      ...current,
      placedBids: {
        ...current.placedBids,
        [vehicleId]: { amount, placedAt: new Date().toISOString() },
      },
    }));
  }, []);

  const hasBid = useCallback(
    (vehicleId: string) => session.placedBids[vehicleId] != null,
    [session],
  );

  const toggleWatchlist = useCallback((vehicleId: string) => {
    setSession((current) => {
      const nextWatchlist = { ...current.watchlist };

      if (nextWatchlist[vehicleId]) {
        delete nextWatchlist[vehicleId];
      } else {
        nextWatchlist[vehicleId] = true;
      }

      return { ...current, watchlist: nextWatchlist };
    });
  }, []);

  const isWatchlisted = useCallback(
    (vehicleId: string) => Boolean(session.watchlist[vehicleId]),
    [session],
  );

  return useMemo(
    () => ({ session, placeBid, hasBid, toggleWatchlist, isWatchlisted }),
    [session, placeBid, hasBid, toggleWatchlist, isWatchlisted],
  );
}

function readStoredSession(): BrowserSession {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      return EMPTY_SESSION;
    }

    const parsed = JSON.parse(stored) as Partial<BrowserSession>;
    if (!parsed || typeof parsed !== "object" || !parsed.placedBids) {
      return EMPTY_SESSION;
    }

    return {
      placedBids: parsed.placedBids,
      watchlist: normalizeWatchlist(parsed.watchlist),
    };
  } catch {
    return EMPTY_SESSION;
  }
}

function normalizeWatchlist(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, isWatched]) => Boolean(isWatched)),
  );
}
