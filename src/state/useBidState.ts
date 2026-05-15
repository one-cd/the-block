import { useCallback, useEffect, useMemo, useState } from "react";
import type { BidState, VehicleViewModel } from "../types/vehicle";

const BID_STORAGE_KEY = "openlane-bid-state-v1";

type BidStateMap = Record<string, BidState>;

export function useBidState() {
  const [bids, setBids] = useState<BidStateMap>(() => readStoredBids());

  useEffect(() => {
    localStorage.setItem(BID_STORAGE_KEY, JSON.stringify(bids));
  }, [bids]);

  const placeBid = useCallback((vehicle: VehicleViewModel, amount: number) => {
    setBids((current) => {
      const existing = current[vehicle.id];
      const previousBid = existing?.currentBid ?? vehicle.currentBid;
      const previousCount = existing?.bidCount ?? vehicle.bidCount;

      return {
        ...current,
        [vehicle.id]: {
          currentBid: amount,
          latestBid: amount,
          bidCount: previousBid === amount ? previousCount : previousCount + 1,
        },
      };
    });
  }, []);

  return useMemo(
    () => ({
      bids,
      placeBid,
    }),
    [bids, placeBid],
  );
}

function readStoredBids(): BidStateMap {
  try {
    const stored = localStorage.getItem(BID_STORAGE_KEY);
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored) as BidStateMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
