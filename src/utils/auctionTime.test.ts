import { describe, expect, it } from "vitest";
import { formatCountdown, formatTimeLeft, normalizeAuctionDates } from "./auctionTime";

describe("auction time helpers", () => {
  it("normalizes synthetic auction dates into a useful future window", () => {
    const now = new Date("2026-05-14T20:15:00-04:00");
    const normalized = normalizeAuctionDates(
      ["2026-04-01T10:00:00", "2026-04-04T12:30:00"],
      now,
    );

    expect(normalized.size).toBe(2);
    for (const value of normalized.values()) {
      expect(value.getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("formats countdown and relative time labels", () => {
    const now = new Date("2026-05-14T20:00:00Z");

    expect(formatCountdown(new Date("2026-05-14T22:03:04Z"), now)).toBe("02:03:04");
    expect(formatCountdown(new Date("2026-05-20T07:03:04Z"), now)).toBe("5d 11:03:04");
    expect(formatTimeLeft(new Date("2026-05-15T21:00:00Z"), now)).toBe("1 day");
    expect(formatTimeLeft(new Date("2026-05-14T20:15:00Z"), now)).toBe("Closing soon");
  });
});
