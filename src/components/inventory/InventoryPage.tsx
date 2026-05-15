import { useEffect, useMemo, useState, useTransition } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { filterVehicles } from "../../data/vehicles";
import { titleCase } from "../../utils/format";
import { SubNav } from "../layout/SubNav";
import { TopNav } from "../layout/TopNav";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { FilterBar } from "./FilterBar";
import { ResultsBar } from "./ResultsBar";
import { VehicleCard } from "./VehicleCard";
import {
  createEmptyFilters,
  isRangeNarrowed,
  type DatasetBounds,
  type FilterOptions,
  type InventoryFilters,
  type Range,
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
  const bounds = useMemo(() => createDatasetBounds(vehicles), [vehicles]);
  const emptyFilters = useMemo(() => createEmptyFilters(bounds), [bounds]);
  const [filters, setFilters] = useState<InventoryFilters>(emptyFilters);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [sort, setSort] = useState<SortKey>("mileage");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [, startTransition] = useTransition();
  const filterOptions = useMemo(() => createFilterOptions(vehicles), [vehicles]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters, bounds), [filters, bounds]);

  useEffect(() => {
    document.body.classList.toggle("filters-drawer-open", isFiltersExpanded);
    return () => document.body.classList.remove("filters-drawer-open");
  }, [isFiltersExpanded]);

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

  const clearFilters = () => {
    setSearchTerm("");
    setFilters(emptyFilters);
  };

  const handleRemoveValue = <Key extends keyof InventoryFilters>(key: Key, value: string) => {
    setFilters((current) => {
      const currentValue = current[key];
      if (Array.isArray(currentValue)) {
        const next = (currentValue as readonly string[]).filter((entry) => entry !== value);
        return { ...current, [key]: next as InventoryFilters[Key] };
      }
      return current;
    });
  };

  const handleResetRange = (key: "mileageRange" | "yearRange" | "conditionRange") => {
    setFilters((current) => {
      if (key === "mileageRange") {
        return { ...current, mileageRange: { ...bounds.mileage } };
      }
      if (key === "yearRange") {
        return { ...current, yearRange: { ...bounds.year } };
      }
      return { ...current, conditionRange: { ...bounds.condition } };
    });
  };

  return (
    <div>
      <TopNav />
      <SubNav tab={tab} onTabChange={setTab} />
      <FilterBar
        searchTerm={searchTerm}
        filters={filters}
        options={filterOptions}
        bounds={bounds}
        activeFilterCount={activeFilterCount}
        isExpanded={isFiltersExpanded}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onExpandedChange={setIsFiltersExpanded}
      />
      <ActiveFilterChips
        filters={filters}
        bounds={bounds}
        searchTerm={searchTerm}
        onRemoveValue={handleRemoveValue}
        onResetRange={handleResetRange}
        onClearDamage={() => handleFilterChange("damage", "any")}
        onClearSearch={() => setSearchTerm("")}
        onClearAll={clearFilters}
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

  return "No vehicles match your filters. Try clearing or adjusting the filters above.";
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

function createDatasetBounds(vehicles: VehicleViewModel[]): DatasetBounds {
  if (vehicles.length === 0) {
    return {
      mileage: { min: 0, max: 250_000 },
      year: { min: 2016, max: new Date().getFullYear() },
      condition: { min: 1, max: 5 },
    };
  }

  const mileages = vehicles.map((vehicle) => vehicle.odometerKm);
  const years = vehicles.map((vehicle) => vehicle.year);
  const grades = vehicles.map((vehicle) => vehicle.conditionGrade);

  return {
    mileage: {
      min: Math.floor(Math.min(...mileages) / 1000) * 1000,
      max: Math.ceil(Math.max(...mileages) / 1000) * 1000,
    },
    year: {
      min: Math.min(...years),
      max: Math.max(...years),
    },
    condition: {
      min: roundCondition(Math.min(...grades), Math.floor),
      max: roundCondition(Math.max(...grades), Math.ceil),
    },
  };
}

function roundCondition(value: number, fn: (n: number) => number): number {
  return Math.max(0, Math.min(5, fn(value * 10) / 10));
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function matchesFilters(vehicle: VehicleViewModel, filters: InventoryFilters): boolean {
  if (filters.makeModels.length > 0 && !matchesMakeModel(vehicle, filters.makeModels)) {
    return false;
  }
  if (filters.bodyStyles.length > 0 && !filters.bodyStyles.includes(vehicle.bodyStyle)) {
    return false;
  }
  if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(vehicle.fuelType)) {
    return false;
  }
  if (filters.drivetrains.length > 0 && !filters.drivetrains.includes(vehicle.drivetrain)) {
    return false;
  }
  if (filters.transmissions.length > 0 && !filters.transmissions.includes(vehicle.transmission)) {
    return false;
  }
  if (filters.titleStatuses.length > 0 && !filters.titleStatuses.includes(titleCase(vehicle.titleStatus))) {
    return false;
  }
  if (filters.provinces.length > 0 && !filters.provinces.includes(vehicle.province)) {
    return false;
  }
  if (filters.auctionStates.length > 0 && !matchesAuctionStates(vehicle, filters.auctionStates)) {
    return false;
  }
  if (!matchesRange(vehicle.odometerKm, filters.mileageRange)) {
    return false;
  }
  if (!matchesRange(vehicle.year, filters.yearRange)) {
    return false;
  }
  if (!matchesRange(vehicle.conditionGrade, filters.conditionRange)) {
    return false;
  }
  if (!matchesDamage(vehicle, filters.damage)) {
    return false;
  }

  return true;
}

function matchesMakeModel(vehicle: VehicleViewModel, makeModels: readonly string[]): boolean {
  const candidates = new Set([vehicle.make, `${vehicle.make} ${vehicle.model}`]);
  return makeModels.some((entry) => candidates.has(entry));
}

function matchesRange(value: number, range: Range): boolean {
  return value >= range.min && value <= range.max;
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

function matchesAuctionStates(vehicle: VehicleViewModel, states: readonly InventoryFilters["auctionStates"][number][]): boolean {
  return states.some((state) => {
    switch (state) {
      case "buy-now":
        return vehicle.buyNowPrice != null;
      case "active-bidding":
        return vehicle.bidCount > 0;
      case "awaiting-bids":
        return vehicle.bidCount === 0;
      default:
        return false;
    }
  });
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

function countActiveFilters(filters: InventoryFilters, bounds: DatasetBounds): number {
  let count = 0;
  count += filters.makeModels.length;
  count += filters.bodyStyles.length;
  count += filters.fuelTypes.length;
  count += filters.drivetrains.length;
  count += filters.transmissions.length;
  count += filters.titleStatuses.length;
  count += filters.provinces.length;
  count += filters.auctionStates.length;
  if (isRangeNarrowed(filters.mileageRange, bounds.mileage)) {
    count += 1;
  }
  if (isRangeNarrowed(filters.yearRange, bounds.year)) {
    count += 1;
  }
  if (isRangeNarrowed(filters.conditionRange, bounds.condition)) {
    count += 1;
  }
  if (filters.damage !== "any") {
    count += 1;
  }
  return count;
}
