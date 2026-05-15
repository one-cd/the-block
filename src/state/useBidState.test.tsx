import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { createVehicleViewModels } from "../data/vehicles";
import { BID_STORAGE_KEY, useBidState } from "./useBidState";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");
const testVehicle = createVehicleViewModels({}, fixedNow)[0];
const bidAmount = testVehicle.topBid + 2_000;

function BidStateHarness() {
  const { bids, placeBid } = useBidState();
  const bid = bids[testVehicle.id];

  return (
    <div>
      <output data-testid="current-bid">{bid?.currentBid ?? "none"}</output>
      <output data-testid="bid-count">{bid?.bidCount ?? "none"}</output>
      <button type="button" onClick={() => placeBid(testVehicle, bidAmount)}>
        Place test bid
      </button>
    </div>
  );
}

describe("useBidState persistence", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("stores placed bids in localStorage and reloads them into fresh hook state", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<BidStateHarness />);

    await user.click(screen.getByRole("button", { name: "Place test bid" }));

    await waitFor(() => {
      expect(screen.getByTestId("current-bid")).toHaveTextContent(String(bidAmount));
    });

    const stored = localStorage.getItem(BID_STORAGE_KEY);
    expect(stored).toContain(testVehicle.id);
    expect(stored).toContain(String(bidAmount));

    unmount();
    render(<BidStateHarness />);

    expect(screen.getByTestId("current-bid")).toHaveTextContent(String(bidAmount));
    expect(screen.getByTestId("bid-count")).toHaveTextContent(String(testVehicle.bidCount + 1));
  });

  it("falls back to empty bid state when stored JSON is corrupt", () => {
    localStorage.setItem(BID_STORAGE_KEY, "not-json");

    render(<BidStateHarness />);

    expect(screen.getByTestId("current-bid")).toHaveTextContent("none");
    expect(screen.getByTestId("bid-count")).toHaveTextContent("none");
  });
});
