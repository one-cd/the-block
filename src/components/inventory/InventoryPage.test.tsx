import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createVehicleViewModels, vehiclesRaw } from "../../data/vehicles";
import { InventoryPage } from "./InventoryPage";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");

describe("InventoryPage", () => {
  it("renders dataset vehicles and filters results from the search field", async () => {
    const user = userEvent.setup();
    const vehicles = createVehicleViewModels({ placedBids: {} }, fixedNow);
    const { container } = render(<InventoryPage vehicles={vehicles} onOpenVehicle={vi.fn()} hasBid={() => false} />);

    expect(container.querySelectorAll(".vcard")).toHaveLength(vehiclesRaw.length);

    await user.type(screen.getByLabelText("Search inventory"), "Tesla");

    await waitFor(() => {
      expect(container.querySelectorAll(".vcard")).toHaveLength(9);
    });
    expect(screen.getByText("1-9 of 9 results")).toBeInTheDocument();
  });

  it("opens the selected vehicle when a card is clicked", async () => {
    const user = userEvent.setup();
    const vehicles = createVehicleViewModels({ placedBids: {} }, fixedNow);
    const onOpenVehicle = vi.fn();
    const { container } = render(<InventoryPage vehicles={vehicles} onOpenVehicle={onOpenVehicle} hasBid={() => false} />);
    const firstCard = container.querySelector(".vcard");

    expect(firstCard).not.toBeNull();
    await user.click(firstCard as HTMLElement);

    expect(onOpenVehicle).toHaveBeenCalledWith(vehicles[0]);
  });
});
