export type TitleStatus = "clean" | "rebuilt" | "salvage";

export type VehicleRaw = {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  body_style: string;
  exterior_color: string;
  interior_color: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  odometer_km: number;
  fuel_type: string;
  condition_grade: number;
  condition_report: string;
  damage_notes: string[];
  title_status: TitleStatus;
  province: string;
  city: string;
  auction_start: string;
  starting_bid: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  images: string[];
  selling_dealership: string;
  lot: string;
  current_bid: number | null;
  bid_count: number;
};

export type PlacedBid = {
  amount: number;
  placedAt: string;
};

export type BrowserSession = {
  placedBids: Record<string, PlacedBid>;
  watchlist: Record<string, boolean>;
};

export type VehicleViewModel = {
  id: string;
  lot: string;
  vin: string;
  title: string;
  shortTitle: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  bodyStyle: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  odometerKm: number;
  conditionGrade: number;
  conditionReport: string;
  damageNotes: string[];
  titleStatus: TitleStatus;
  location: string;
  city: string;
  province: string;
  sellingDealership: string;
  auctionDate: Date;
  auctionLabel: string;
  countdown: string;
  timeLeft: string;
  startingBid: number;
  reservePrice: number | null;
  buyNowPrice: number | null;
  currentBid: number | null;
  topBid: number;
  bidCount: number;
  statusLabel: string;
  images: string[];
  searchText: string;
};
