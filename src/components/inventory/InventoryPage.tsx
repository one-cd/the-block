import { useMemo, useState, useTransition } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { filterVehicles } from "../../data/vehicles";
import { titleCase } from "../../utils/format";
import { SubNav } from "../layout/SubNav";
import { TopNav } from "../layout/TopNav";
import { FilterBar } from "./FilterBar";
import { ResultsBar } from "./ResultsBar";
import { VehicleCard } from "./VehicleCard";
import {
  EMPTY_FILTERS,
  type FilterOptions,
  type InventoryFilters,
  type SavedSearch,
  type SortKey,
} from "./inventoryControls";

type InventoryPageProps = {
  vehicles: VehicleViewModel[];
  onOpenVehicle: (vehicle: VehicleViewModel) => void;
  hasBid: (vehicleId: string) => boolean;
  isWatchlisted: (vehicleId: string) => boolean;
};

export function InventoryPage({ vehicles, onOpenVehicle, hasBid, isWatchlisted }: InventoryPageProps) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<InventoryFilters>(EMPTY_FILTERS);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [sort, setSort] = useState<SortKey>("mileage");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [, startTransition] = useTransition();
  const filterOptions = useMemo(() => createFilterOptions(vehicles), [vehicles]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const filteredVehicles = useMemo(() => {
    let result = filterVehicles(vehicles, searchTerm).filter((vehicle) => matchesFilters(vehicle, filters));

    if (tab === "bids") {
      result = result.filter((vehicle) => hasBid(vehicle.id));
    }
    if (tab === "watch") {
      result = result.filter((vehicle) => isWatchlisted(vehicle.id));
    }

    return sortVehicles(result, sort);
  }, [vehicles, searchTerm, filters, tab, hasBid, isWatchlisted, sort]);

  const handleSearchChange = (value: string) => {
    startTransition(() => setSearchTerm(value));
  };

  const handleFilterChange = <Key extends keyof InventoryFilters>(key: Key, value: InventoryFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSavedSearchChange = (savedSearch: SavedSearch) => {
    if (!savedSearch) {
      return;
    }

    setSearchTerm("");
    setFilters(createSavedSearchFilters(savedSearch));
    setIsFiltersExpanded(savedSearch !== "buy-now" && savedSearch !== "active-bidding" && savedSearch !== "awaiting-bids");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div>
      <TopNav />
      <SubNav tab={tab} onTabChange={setTab} />
      <FilterBar
        searchTerm={searchTerm}
        filters={filters}
        options={filterOptions}
        activeFilterCount={activeFilterCount}
        isExpanded={isFiltersExpanded}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSavedSearchChange={handleSavedSearchChange}
        onClearFilters={clearFilters}
        onExpandedChange={setIsFiltersExpanded}
      />
      <ResultsBar count={filteredVehicles.length} view={view} sort={sort} onViewChange={setView} onSortChange={setSort} />
      {filteredVehicles.length === 0 ? (
        <div className="empty-results">{emptyMessage(searchTerm, tab)}</div>
      ) : (
        <div className={`grid${view === "list" ? " is-list" : ""}`}>
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onOpenVehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

function emptyMessage(searchTerm: string, tab: string): string {
  if (tab === "bids") {
    return "You haven't placed any bids yet. Open a vehicle and place a bid to see it here.";
  }

  if (searchTerm.trim()) {
    return `No vehicles match "${searchTerm}". Try a make, model, VIN, lot, dealer, city, or title status.`;
  }

  if (tab === "watch") {
    return "Your watchlist is empty. Open a vehicle and add it to your watchlist to see it here.";
  }

  return "No vehicles match your filters. Try clearing filters or choosing a different saved search.";
}

function createFilterOptions(vehicles: VehicleViewModel[]): FilterOptions {
  return {
    makeModels: uniqueSorted([
      ...vehicles.map((vehicle) => vehicle.make),
      ...vehicles.map((vehicle) => `${vehicle.make} ${vehicle.model}`),
    ]),
    bodyStyles: uniqueSorted(vehicles.map((vehicle) => vehicle.bodyStyle)),
    fuelTypes: uniqueSorted(vehicles.map((vehicle) => vehicle.fuelType)),
    drivetrains: uniqueSorted(vehicles.map((vehicle) => vehicle.drivetrain)),
    transmissions: uniqueSorted(vehicles.map((vehicle) => vehicle.transmission)),
    titleStatuses: uniqueSorted(vehicles.map((vehicle) => titleCase(vehicle.titleStatus))),
    provinces: uniqueSorted(vehicles.map((vehicle) => vehicle.province)),
  };
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function matchesFilters(vehicle: VehicleViewModel, filters: InventoryFilters): boolean {
  if (filters.absolute && !vehicle.isAbsolute) {
    return false;
  }
  if (filters.makeModel && vehicle.make !== filters.makeModel && `${vehicle.make} ${vehicle.model}` !== filters.makeModel) {
    return false;
  }
  if (filters.bodyStyle && vehicle.bodyStyle !== filters.bodyStyle) {
    return false;
  }
  if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
    return false;
  }
  if (filters.drivetrain && vehicle.drivetrain !== filters.drivetrain) {
    return false;
  }
  if (filters.transmission && vehicle.transmission !== filters.transmission) {
    return false;
  }
  if (filters.titleStatus && titleCase(vehicle.titleStatus) !== filters.titleStatus) {
    return false;
  }
  if (filters.province && vehicle.province !== filters.province) {
    return false;
  }
  if (!matchesMileage(vehicle, filters.mileage)) {
    return false;
  }
  if (!matchesYear(vehicle, filters.year)) {
    return false;
  }
  if (!matchesCondition(vehicle, filters.condition)) {
    return false;
  }
  if (!matchesDamage(vehicle, filters.damage)) {
    return false;
  }
  if (!matchesAuctionState(vehicle, filters.auctionState)) {
    return false;
  }

  return true;
}

function matchesMileage(vehicle: VehicleViewModel, mileage: InventoryFilters["mileage"]): boolean {
  switch (mileage) {
    case "under-50k":
      return vehicle.odometerKm < 50_000;
    case "50k-100k":
      return vehicle.odometerKm >= 50_000 && vehicle.odometerKm < 100_000;
    case "100k-150k":
      return vehicle.odometerKm >= 100_000 && vehicle.odometerKm < 150_000;
    case "150k-plus":
      return vehicle.odometerKm >= 150_000;
    default:
      return true;
  }
}

function matchesYear(vehicle: VehicleViewModel, year: InventoryFilters["year"]): boolean {
  switch (year) {
    case "2024-plus":
      return vehicle.year >= 2024;
    case "2020-2023":
      return vehicle.year >= 2020 && vehicle.year <= 2023;
    case "2016-2019":
      return vehicle.year >= 2016 && vehicle.year <= 2019;
    default:
      return true;
  }
}

function matchesCondition(vehicle: VehicleViewModel, condition: InventoryFilters["condition"]): boolean {
  switch (condition) {
    case "4-plus":
      return vehicle.conditionGrade >= 4;
    case "3-4":
      return vehicle.conditionGrade >= 3 && vehicle.conditionGrade < 4;
    case "under-3":
      return vehicle.conditionGrade < 3;
    default:
      return true;
  }
}

function matchesDamage(vehicle: VehicleViewModel, damage: InventoryFilters["damage"]): boolean {
  switch (damage) {
    case "none":
      return vehicle.damageNotes.length === 0;
    case "reported":
      return vehicle.damageNotes.length > 0;
    default:
      return true;
  }
}

function matchesAuctionState(vehicle: VehicleViewModel, auctionState: InventoryFilters["auctionState"]): boolean {
  switch (auctionState) {
    case "buy-now":
      return vehicle.buyNowPrice != null;
    case "active-bidding":
      return vehicle.bidCount > 0;
    case "awaiting-bids":
      return vehicle.bidCount === 0;
    default:
      return true;
  }
}

function sortVehicles(vehicles: VehicleViewModel[], sort: SortKey): VehicleViewModel[] {
  return [...vehicles].sort((left, right) => {
    switch (sort) {
      case "year":
        return right.year - left.year || left.odometerKm - right.odometerKm;
      case "condition":
        return right.conditionGrade - left.conditionGrade || left.odometerKm - right.odometerKm;
      case "buyNow":
        return priceOrLast(left.buyNowPrice) - priceOrLast(right.buyNowPrice) || left.topBid - right.topBid;
      case "mileage":
      default:
        return left.odometerKm - right.odometerKm || right.year - left.year;
    }
  });
}

function priceOrLast(value: number | null): number {
  return value ?? Number.MAX_SAFE_INTEGER;
}

function countActiveFilters(filters: InventoryFilters): number {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === "absolute") {
      return Boolean(value);
    }

    return value !== "" && value !== "any";
  }).length;
}

function createSavedSearchFilters(savedSearch: SavedSearch): InventoryFilters {
  switch (savedSearch) {
    case "buy-now":
      return { ...EMPTY_FILTERS, auctionState: "buy-now" };
    case "awaiting-bids":
      return { ...EMPTY_FILTERS, auctionState: "awaiting-bids" };
    case "active-bidding":
      return { ...EMPTY_FILTERS, auctionState: "active-bidding" };
    case "clean-no-damage":
      return { ...EMPTY_FILTERS, titleStatus: "Clean", damage: "none" };
    case "low-mileage":
      return { ...EMPTY_FILTERS, mileage: "under-50k" };
    case "newer":
      return { ...EMPTY_FILTERS, year: "2024-plus" };
    default:
      return EMPTY_FILTERS;
  }
}
