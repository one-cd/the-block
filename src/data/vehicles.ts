import rawVehicles from "../../data/vehicles.json";
import type { BrowserSession, VehicleRaw, VehicleViewModel } from "../types/vehicle";
import { formatAuctionDate, formatCountdown, formatTimeLeft, normalizeAuctionDates } from "../utils/auctionTime";
import { titleCase } from "../utils/format";

export const vehiclesRaw = rawVehicles as VehicleRaw[];

export function createVehicleViewModels(
  session: BrowserSession,
  now: Date,
  timelineBase = now,
): VehicleViewModel[] {
  const auctionDates = normalizeAuctionDates(
    vehiclesRaw.map((vehicle) => vehicle.auction_start),
    timelineBase,
  );

  return vehiclesRaw.map((vehicle) => {
    const placedBid = session.placedBids[vehicle.id];
    const currentBid = placedBid != null
      ? Math.max(placedBid.amount, vehicle.current_bid ?? 0)
      : vehicle.current_bid;
    const bidCount = vehicle.bid_count + (placedBid ? 1 : 0);
    const topBid = currentBid ?? vehicle.starting_bid;
    const isTopBidder = placedBid != null && placedBid.amount === topBid;
    const auctionDate = auctionDates.get(vehicle.auction_start) ?? new Date(vehicle.auction_start);
    const title = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(" ");
    const shortTitle = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ");
    const statusLabel = bidCount > 0 ? "Active bidding" : "Awaiting bids";
    const searchText = [
      title,
      vehicle.vin,
      vehicle.lot,
      vehicle.city,
      vehicle.province,
      vehicle.selling_dealership,
      vehicle.engine,
      vehicle.drivetrain,
      vehicle.transmission,
      vehicle.fuel_type,
      vehicle.title_status,
      vehicle.body_style,
      vehicle.exterior_color,
      vehicle.interior_color,
      vehicle.condition_report,
      ...vehicle.damage_notes,
    ]
      .join(" ")
      .toLowerCase();

    return {
      id: vehicle.id,
      lot: vehicle.lot,
      vin: vehicle.vin,
      title,
      shortTitle,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      bodyStyle: titleCase(vehicle.body_style),
      exteriorColor: vehicle.exterior_color,
      interiorColor: vehicle.interior_color,
      engine: vehicle.engine,
      transmission: titleCase(vehicle.transmission),
      drivetrain: vehicle.drivetrain,
      fuelType: titleCase(vehicle.fuel_type),
      odometerKm: vehicle.odometer_km,
      conditionGrade: vehicle.condition_grade,
      conditionReport: vehicle.condition_report,
      damageNotes: vehicle.damage_notes,
      titleStatus: vehicle.title_status,
      location: `${vehicle.city}, ${vehicle.province}`,
      city: vehicle.city,
      province: vehicle.province,
      sellingDealership: vehicle.selling_dealership,
      auctionDate,
      auctionLabel: formatAuctionDate(auctionDate),
      countdown: formatCountdown(auctionDate, now),
      timeLeft: formatTimeLeft(auctionDate, now),
      startingBid: vehicle.starting_bid,
      reservePrice: vehicle.reserve_price,
      buyNowPrice: vehicle.buy_now_price,
      currentBid,
      topBid,
      isTopBidder,
      bidCount,
      statusLabel,
      images: vehicle.images,
      searchText,
    };
  });
}

export function filterVehicles(vehicles: VehicleViewModel[], searchTerm: string): VehicleViewModel[] {
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return vehicles;
  }

  return vehicles.filter((vehicle) => vehicle.searchText.includes(query));
}
