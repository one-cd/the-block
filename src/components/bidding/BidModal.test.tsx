import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createVehicleViewModels } from "../../data/vehicles";
import { formatCurrency } from "../../utils/format";
import { BidModal } from "./BidModal";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");

describe("BidModal", () => {
  it("blocks bids below the minimum next bid and confirms valid bids", async () => {
    const user = userEvent.setup();
    const vehicle = createVehicleViewModels({ placedBids: {}, watchlist: {} }, fixedNow).find((candidate) => candidate.currentBid != null);
    const onConfirm = vi.fn();

    expect(vehicle).toBeDefined();
    render(<BidModal vehicle={vehicle!} onClose={vi.fn()} onConfirm={onConfirm} />);

    const bidInput = screen.getByLabelText("Bid amount");
    const confirmButton = screen.getByRole("button", { name: "Confirm bid" });

    await user.clear(bidInput);
    await user.type(bidInput, String(vehicle!.topBid));

    expect(confirmButton).toBeDisabled();
    expect(screen.getByText(`Bid must be at least ${formatCurrency(vehicle!.topBid + 100)}.`)).toBeInTheDocument();

    const validBid = vehicle!.topBid + 1_000;
    await user.clear(bidInput);
    await user.type(bidInput, String(validBid));
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(validBid);
    });
  });
});
