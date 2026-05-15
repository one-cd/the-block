import { useCallback, useEffect, useMemo, useState } from "react";
import type { BrowserSession } from "../types/vehicle";

export const SESSION_STORAGE_KEY = "openlane-session-v1";

const EMPTY_SESSION: BrowserSession = { placedBids: {} };

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

  return useMemo(
    () => ({ session, placeBid, hasBid }),
    [session, placeBid, hasBid],
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

    return { placedBids: parsed.placedBids };
  } catch {
    return EMPTY_SESSION;
  }
}
