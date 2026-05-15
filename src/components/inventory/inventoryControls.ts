export const MILEAGE_OPTIONS = [
  { value: "any", label: "Any mileage" },
  { value: "under-50k", label: "Under 50,000 km" },
  { value: "50k-100k", label: "50,000-100,000 km" },
  { value: "100k-150k", label: "100,000-150,000 km" },
  { value: "150k-plus", label: "150,000+ km" },
] as const;

export const YEAR_OPTIONS = [
  { value: "any", label: "Any year" },
  { value: "2024-plus", label: "2024+" },
  { value: "2020-2023", label: "2020-2023" },
  { value: "2016-2019", label: "2016-2019" },
] as const;

export const CONDITION_OPTIONS = [
  { value: "any", label: "Any grade" },
  { value: "4-plus", label: "4.0+" },
  { value: "3-4", label: "3.0-3.9" },
  { value: "under-3", label: "Under 3.0" },
] as const;

export const AUCTION_STATE_OPTIONS = [
  { value: "any", label: "Any auction state" },
  { value: "buy-now", label: "Buy now" },
  { value: "awaiting-bids", label: "Awaiting bids" },
  { value: "active-bidding", label: "Active bidding" },
] as const;

export const DAMAGE_OPTIONS = [
  { value: "any", label: "Any damage status" },
  { value: "none", label: "No damage notes" },
  { value: "reported", label: "Damage reported" },
] as const;

export const SAVED_SEARCH_OPTIONS = [
  { value: "", label: "Saved searches" },
  { value: "buy-now", label: "Buy now vehicles" },
  { value: "awaiting-bids", label: "Awaiting bids" },
  { value: "active-bidding", label: "Active bidding" },
  { value: "clean-no-damage", label: "Clean title, no damage" },
  { value: "low-mileage", label: "Low mileage" },
  { value: "newer", label: "2024 and newer" },
] as const;

export const SORT_OPTIONS = [
  { value: "mileage", label: "Mileage" },
  { value: "year", label: "Year" },
  { value: "condition", label: "Condition grade" },
  { value: "buyNow", label: "Buy-now price" },
] as const;

export type MileageFilter = (typeof MILEAGE_OPTIONS)[number]["value"];
export type YearFilter = (typeof YEAR_OPTIONS)[number]["value"];
export type ConditionFilter = (typeof CONDITION_OPTIONS)[number]["value"];
export type AuctionStateFilter = (typeof AUCTION_STATE_OPTIONS)[number]["value"];
export type DamageFilter = (typeof DAMAGE_OPTIONS)[number]["value"];
export type SavedSearch = (typeof SAVED_SEARCH_OPTIONS)[number]["value"];
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type InventoryFilters = {
  absolute: boolean;
  mileage: MileageFilter;
  year: YearFilter;
  makeModel: string;
  bodyStyle: string;
  fuelType: string;
  drivetrain: string;
  transmission: string;
  titleStatus: string;
  condition: ConditionFilter;
  damage: DamageFilter;
  province: string;
  auctionState: AuctionStateFilter;
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

export const EMPTY_FILTERS: InventoryFilters = {
  absolute: false,
  mileage: "any",
  year: "any",
  makeModel: "",
  bodyStyle: "",
  fuelType: "",
  drivetrain: "",
  transmission: "",
  titleStatus: "",
  condition: "any",
  damage: "any",
  province: "",
  auctionState: "any",
};
