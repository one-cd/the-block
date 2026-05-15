export const AUCTION_STATE_OPTIONS = [
  { value: "buy-now", label: "Buy Now listed" },
  { value: "awaiting-bids", label: "Awaiting bids" },
  { value: "active-bidding", label: "Active bidding" },
] as const;

export const DAMAGE_OPTIONS = [
  { value: "any", label: "Any damage status" },
  { value: "none", label: "No damage notes" },
  { value: "reported", label: "Damage reported" },
] as const;

export const SORT_OPTIONS = [
  { value: "mileage", label: "Mileage" },
  { value: "year", label: "Year" },
  { value: "condition", label: "Condition grade" },
  { value: "buyNow", label: "Buy Now price" },
] as const;

export type AuctionState = (typeof AUCTION_STATE_OPTIONS)[number]["value"];
export type DamageFilter = (typeof DAMAGE_OPTIONS)[number]["value"];
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type Range = { min: number; max: number };

export type InventoryFilters = {
  makeModels: string[];
  bodyStyles: string[];
  fuelTypes: string[];
  drivetrains: string[];
  transmissions: string[];
  titleStatuses: string[];
  provinces: string[];
  auctionStates: AuctionState[];
  mileageRange: Range;
  yearRange: Range;
  conditionRange: Range;
  damage: DamageFilter;
};

export type FilterOptions = {
  makeModels: string[];
  bodyStyles: string[];
  fuelTypes: string[];
  drivetrains: string[];
  transmissions: string[];
  titleStatuses: string[];
  provinces: string[];
};

export type DatasetBounds = {
  mileage: Range;
  year: Range;
  condition: Range;
};

export function createEmptyFilters(bounds: DatasetBounds): InventoryFilters {
  return {
    makeModels: [],
    bodyStyles: [],
    fuelTypes: [],
    drivetrains: [],
    transmissions: [],
    titleStatuses: [],
    provinces: [],
    auctionStates: [],
    mileageRange: { ...bounds.mileage },
    yearRange: { ...bounds.year },
    conditionRange: { ...bounds.condition },
    damage: "any",
  };
}

export function isRangeNarrowed(range: Range, bounds: Range): boolean {
  return range.min > bounds.min || range.max < bounds.max;
}

export function rangesEqual(left: Range, right: Range): boolean {
  return left.min === right.min && left.max === right.max;
}
