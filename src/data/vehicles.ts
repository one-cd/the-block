import rawVehicles from "../../data/vehicles.json";
import type { BidState, MarketSummary, VehicleRaw, VehicleViewModel } from "../types/vehicle";
import { formatAuctionDate, formatCountdown, formatTimeLeft, normalizeAuctionDates } from "../utils/auctionTime";
import { titleCase } from "../utils/format";

export const vehiclesRaw = rawVehicles as VehicleRaw[];

export function createVehicleViewModels(
  bids: Record<string, BidState>,
  now: Date,
): VehicleViewModel[] {
  const auctionDates = normalizeAuctionDates(
    vehiclesRaw.map((vehicle) => vehicle.auction_start),
    now,
  );

  return vehiclesRaw.map((vehicle) => {
    const bid = bids[vehicle.id];
    const currentBid = bid?.currentBid ?? vehicle.current_bid;
    const bidCount = bid?.bidCount ?? vehicle.bid_count;
    const topBid = currentBid ?? vehicle.starting_bid;
    const auctionDate = auctionDates.get(vehicle.auction_start) ?? new Date(vehicle.auction_start);
    const market = createMarketSummary(vehicle);
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
      bidCount,
      userBid: bid?.latestBid ?? null,
      isAbsolute: vehicle.reserve_price == null,
      statusLabel,
      images: vehicle.images,
      market,
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

function createMarketSummary(vehicle: VehicleRaw): MarketSummary {
  const comparable = findComparableVehicles(vehicle);
  const pricePoints = comparable
    .flatMap((candidate) => [
      candidate.current_bid,
      candidate.starting_bid,
      candidate.reserve_price,
      candidate.buy_now_price,
    ])
    .filter((value): value is number => typeof value === "number" && value > 0);

  const fallback = [vehicle.starting_bid, vehicle.current_bid, vehicle.reserve_price, vehicle.buy_now_price].filter(
    (value): value is number => typeof value === "number" && value > 0,
  );
  const values = pricePoints.length > 0 ? pricePoints : fallback;
  const lowest = Math.min(...values);
  const high = Math.max(...values);
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length / 100) * 100;

  return {
    lowest,
    average,
    high,
    similarCount: comparable.length,
  };
}

function findComparableVehicles(vehicle: VehicleRaw): VehicleRaw[] {
  const sameModel = vehiclesRaw.filter(
    (candidate) =>
      candidate.id !== vehicle.id &&
      candidate.make === vehicle.make &&
      candidate.model === vehicle.model,
  );
  if (sameModel.length >= 3) {
    return sameModel;
  }

  const sameMakeAndBody = vehiclesRaw.filter(
    (candidate) =>
      candidate.id !== vehicle.id &&
      candidate.make === vehicle.make &&
      candidate.body_style === vehicle.body_style &&
      Math.abs(candidate.year - vehicle.year) <= 3,
  );
  if (sameMakeAndBody.length >= 3) {
    return sameMakeAndBody;
  }

  const sameBody = vehiclesRaw.filter(
    (candidate) =>
      candidate.id !== vehicle.id &&
      candidate.body_style === vehicle.body_style &&
      Math.abs(candidate.year - vehicle.year) <= 3,
  );
  return sameBody.length > 0 ? sameBody : sameModel;
}
