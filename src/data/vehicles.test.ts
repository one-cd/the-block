import { describe, expect, it } from "vitest";
import { createVehicleViewModels, filterVehicles, vehiclesRaw } from "./vehicles";

const fixedNow = new Date("2026-05-14T20:00:00-04:00");

describe("vehicle data adapter", () => {
  it("creates OpenLane-shaped vehicle models from the raw dataset", () => {
    const vehicles = createVehicleViewModels({ placedBids: {}, watchlist: {} }, fixedNow);
    const raw = vehiclesRaw[0];
    const vehicle = vehicles[0];

    expect(vehicles).toHaveLength(vehiclesRaw.length);
    expect(vehicle).toMatchObject({
      id: raw.id,
      lot: raw.lot,
      vin: raw.vin,
      title: `${raw.year} ${raw.make} ${raw.model} ${raw.trim}`,
      shortTitle: `${raw.year} ${raw.make} ${raw.model}`,
      conditionGrade: raw.condition_grade,
      conditionReport: raw.condition_report,
      damageNotes: raw.damage_notes,
      titleStatus: raw.title_status,
      startingBid: raw.starting_bid,
      reservePrice: raw.reserve_price,
      buyNowPrice: raw.buy_now_price,
      currentBid: raw.current_bid,
      bidCount: raw.bid_count,
      topBid: raw.current_bid ?? raw.starting_bid,
      sellingDealership: raw.selling_dealership,
      location: `${raw.city}, ${raw.province}`,
    });
    expect(vehicle.auctionDate.getTime()).toBeGreaterThan(fixedNow.getTime());
    expect(vehicle.countdown).toMatch(/^(\d+d )?\d{2}:\d{2}:\d{2}$/);
    expect(vehicle.searchText).toContain(raw.vin.toLowerCase());
  });

  it("merges the buyer's placed bid into the displayed top bid and count", () => {
    const raw = vehiclesRaw[0];
    const buyerAmount = (raw.current_bid ?? raw.starting_bid) + 7_500;
    const session = {
      placedBids: {
        [raw.id]: { amount: buyerAmount, placedAt: "2026-05-14T20:00:00.000Z" },
      },
      watchlist: {},
    };

    const vehicle = createVehicleViewModels(session, fixedNow)[0];

    expect(vehicle.currentBid).toBe(buyerAmount);
    expect(vehicle.topBid).toBe(buyerAmount);
    expect(vehicle.bidCount).toBe(raw.bid_count + 1);
    expect(vehicle.statusLabel).toBe("Active bidding");
  });
});

describe("vehicle search", () => {
  it("searches across identifying, dealership, location, mechanical, title, and condition fields", () => {
    const vehicles = createVehicleViewModels({ placedBids: {}, watchlist: {} }, fixedNow);
    const vehicleWithDamage = vehicles.find((vehicle) => vehicle.damageNotes.length > 0);

    expect(vehicleWithDamage).toBeDefined();

    const queries = [
      vehicles[0].vin,
      vehicles[0].lot,
      vehicles[0].sellingDealership,
      vehicles[0].city,
      vehicles[0].province,
      vehicles[0].engine,
      vehicles[0].titleStatus,
      vehicleWithDamage?.damageNotes[0] ?? "",
    ];

    for (const query of queries) {
      expect(filterVehicles(vehicles, query).length).toBeGreaterThan(0);
    }
  });

  it("returns every vehicle when the search is blank", () => {
    const vehicles = createVehicleViewModels({ placedBids: {}, watchlist: {} }, fixedNow);

    expect(filterVehicles(vehicles, "   ")).toHaveLength(vehiclesRaw.length);
  });
});
