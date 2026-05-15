import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createVehicleViewModels, vehiclesRaw } from "../../data/vehicles";
import { InventoryPage } from "./InventoryPage";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");

function renderInventory() {
  const vehicles = createVehicleViewModels({ placedBids: {}, watchlist: {} }, fixedNow);
  const onOpenVehicle = vi.fn();
  const utils = render(
    <InventoryPage
      vehicles={vehicles}
      onOpenVehicle={onOpenVehicle}
      hasBid={() => false}
      isWatchlisted={() => false}
    />,
  );
  return { ...utils, vehicles, onOpenVehicle };
}

describe("InventoryPage", () => {
  it("renders dataset vehicles and filters results from the search field", async () => {
    const user = userEvent.setup();
    const { container } = renderInventory();

    expect(container.querySelectorAll(".vcard")).toHaveLength(vehiclesRaw.length);

    await user.type(screen.getByLabelText("Search inventory"), "Tesla");

    await waitFor(() => {
      expect(container.querySelectorAll(".vcard")).toHaveLength(9);
    });
    expect(screen.getByText("1-9 of 9 results")).toBeInTheDocument();
  });

  it("opens the selected vehicle when a card is clicked", async () => {
    const user = userEvent.setup();
    const { container, vehicles, onOpenVehicle } = renderInventory();
    const firstCard = container.querySelector(".vcard");

    expect(firstCard).not.toBeNull();
    await user.click(firstCard as HTMLElement);

    const lowestMileageVehicle = [...vehicles].sort((left, right) => left.odometerKm - right.odometerKm || right.year - left.year)[0];
    expect(onOpenVehicle).toHaveBeenCalledWith(lowestMileageVehicle);
  });

  it("combines selections with OR semantics through the make/model multi-select", async () => {
    const user = userEvent.setup();
    const { container } = renderInventory();

    await user.click(screen.getByRole("button", { name: /Make\/model/ }));
    const dialog = await screen.findByRole("dialog", { name: /Make\/model filter/ });

    await user.click(within(dialog).getByRole("option", { name: "Tesla" }));
    await user.click(within(dialog).getByRole("option", { name: "Honda" }));

    expect(container.querySelectorAll(".vcard")).toHaveLength(22);
    expect(screen.getByRole("button", { name: /Make\/model · 2/ })).toBeInTheDocument();
  });

  it("removes a selected value via the active filter chip", async () => {
    const user = userEvent.setup();
    const { container } = renderInventory();

    await user.click(screen.getByRole("button", { name: /Make\/model/ }));
    const dialog = await screen.findByRole("dialog", { name: /Make\/model filter/ });
    await user.click(within(dialog).getByRole("option", { name: "Tesla" }));
    await user.keyboard("{Escape}");

    expect(container.querySelectorAll(".vcard")).toHaveLength(9);
    const chipsRow = screen.getByLabelText("Active filters");
    const teslaChip = within(chipsRow).getByRole("button", { name: "Remove Tesla" });

    await user.click(teslaChip);

    expect(container.querySelectorAll(".vcard")).toHaveLength(vehiclesRaw.length);
    expect(screen.queryByLabelText("Active filters")).not.toBeInTheDocument();
  });

  it("filters by a mileage range entered in the range slider pill", async () => {
    const user = userEvent.setup();
    const { container } = renderInventory();
    const initialCount = container.querySelectorAll(".vcard").length;

    await user.click(screen.getByRole("button", { name: /^Mileage/ }));
    const dialog = await screen.findByRole("dialog", { name: /Mileage range/ });
    const maxInput = within(dialog).getByLabelText("Max") as HTMLInputElement;

    fireEvent.change(maxInput, { target: { value: "30000" } });

    await waitFor(() => {
      expect(container.querySelectorAll(".vcard").length).toBeLessThan(initialCount);
    });

    const chipsRow = screen.getByLabelText("Active filters");
    expect(within(chipsRow).getByText(/Mileage under 30k km/)).toBeInTheDocument();
  });

  it("clears every active filter at once via Clear all", async () => {
    const user = userEvent.setup();
    const { container } = renderInventory();

    await user.type(screen.getByLabelText("Search inventory"), "Tesla");
    await waitFor(() => {
      expect(container.querySelectorAll(".vcard")).toHaveLength(9);
    });

    await user.click(screen.getByRole("button", { name: /Make\/model/ }));
    const dialog = await screen.findByRole("dialog", { name: /Make\/model filter/ });
    await user.click(within(dialog).getByRole("option", { name: "Toyota" }));
    await user.keyboard("{Escape}");

    const chipsRow = screen.getByLabelText("Active filters");
    await user.click(within(chipsRow).getByRole("button", { name: "Clear all" }));

    await waitFor(() => {
      expect(container.querySelectorAll(".vcard")).toHaveLength(vehiclesRaw.length);
    });
    expect(screen.queryByLabelText("Active filters")).not.toBeInTheDocument();
    expect((screen.getByLabelText("Search inventory") as HTMLInputElement).value).toBe("");
  });
});
