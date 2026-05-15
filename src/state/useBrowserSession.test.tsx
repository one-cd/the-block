import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { createVehicleViewModels } from "../data/vehicles";
import { SESSION_STORAGE_KEY, useBrowserSession } from "./useBrowserSession";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");
const testVehicle = createVehicleViewModels({ placedBids: {} }, fixedNow)[0];
const bidAmount = testVehicle.topBid + 2_000;

function SessionHarness() {
  const { session, placeBid, hasBid } = useBrowserSession();
  const placed = session.placedBids[testVehicle.id];

  return (
    <div>
      <output data-testid="placed-amount">{placed?.amount ?? "none"}</output>
      <output data-testid="has-bid">{String(hasBid(testVehicle.id))}</output>
      <button type="button" onClick={() => placeBid(testVehicle.id, bidAmount)}>
        Place test bid
      </button>
    </div>
  );
}

describe("useBrowserSession persistence", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("records placed bids and reloads them into fresh hook state", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<SessionHarness />);

    await user.click(screen.getByRole("button", { name: "Place test bid" }));

    await waitFor(() => {
      expect(screen.getByTestId("placed-amount")).toHaveTextContent(String(bidAmount));
    });
    expect(screen.getByTestId("has-bid")).toHaveTextContent("true");

    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    expect(stored).toContain(testVehicle.id);
    expect(stored).toContain(String(bidAmount));

    unmount();
    render(<SessionHarness />);

    expect(screen.getByTestId("placed-amount")).toHaveTextContent(String(bidAmount));
    expect(screen.getByTestId("has-bid")).toHaveTextContent("true");
  });

  it("falls back to an empty session when stored JSON is corrupt", () => {
    localStorage.setItem(SESSION_STORAGE_KEY, "not-json");

    render(<SessionHarness />);

    expect(screen.getByTestId("placed-amount")).toHaveTextContent("none");
    expect(screen.getByTestId("has-bid")).toHaveTextContent("false");
  });
});
