import { useEffect } from "react";
import { Icon } from "../icons/Icon";
import { MultiSelectPill, type MultiSelectOption } from "./MultiSelectPill";
import { RangeSliderPill } from "./RangeSliderPill";
import { formatKm } from "./ActiveFilterChips";
import {
  AUCTION_STATE_OPTIONS,
  DAMAGE_OPTIONS,
  type DatasetBounds,
  type FilterOptions,
  type InventoryFilters,
  type Range,
} from "./inventoryControls";

type FilterBarProps = {
  searchTerm: string;
  filters: InventoryFilters;
  options: FilterOptions;
  bounds: DatasetBounds;
  activeFilterCount: number;
  isExpanded: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: <Key extends keyof InventoryFilters>(key: Key, value: InventoryFilters[Key]) => void;
  onClearFilters: () => void;
  onExpandedChange: (value: boolean) => void;
};

export function FilterBar({
  searchTerm,
  filters,
  options,
  bounds,
  activeFilterCount,
  isExpanded,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onExpandedChange,
}: FilterBarProps) {
  useEffect(() => {
    if (!isExpanded) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onExpandedChange(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isExpanded, onExpandedChange]);

  const hasAny = activeFilterCount > 0 || searchTerm.trim().length > 0;

  return (
    <div className="filterbar-wrap">
      <div className="filterbar">
        <label className="search-input">
          <Icon.Search size={16} color="#6b7280" />
          <input
            value={searchTerm}
            placeholder="Search"
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search inventory"
          />
        </label>

        <MultiSelectPill
          label="Make/model"
          options={toLabelOptions(options.makeModels)}
          selected={filters.makeModels}
          searchable
          searchPlaceholder="Search make or model"
          onChange={(next) => onFilterChange("makeModels", next)}
        />

        <RangeSliderPill
          label="Mileage"
          bounds={bounds.mileage}
          step={1000}
          value={filters.mileageRange}
          formatValue={formatKm}
          formatSummary={(value, bounds) => `Mileage ${formatMileageSummary(value, bounds)}`}
          onChange={(next) => onFilterChange("mileageRange", next)}
        />

        <RangeSliderPill
          label="Year"
          bounds={bounds.year}
          step={1}
          value={filters.yearRange}
          formatValue={(value) => `${value}`}
          formatSummary={(value, bounds) => `Year ${formatYearSummary(value, bounds)}`}
          onChange={(next) => onFilterChange("yearRange", next)}
        />

        <button
          className={`pill-select filter-with-icon${isExpanded ? " is-active" : ""}`}
          type="button"
          onClick={() => onExpandedChange(!isExpanded)}
          aria-expanded={isExpanded}
          aria-haspopup="dialog"
        >
          <Icon.Filter size={15} color={isExpanded ? "currentColor" : "#374151"} />
          All filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        {hasAny ? (
          <button className="clear-filters" type="button" onClick={onClearFilters}>
            Clear
          </button>
        ) : null}
      </div>

      {isExpanded ? (
        <>
          <div
            className="filters-drawer-backdrop"
            onClick={() => onExpandedChange(false)}
            aria-hidden="true"
          />
          <div className="advanced-filters" role="dialog" aria-label="All filters">
            <div className="advanced-filters-head">
              <strong>All filters</strong>
              <button
                type="button"
                className="advanced-filters-close"
                onClick={() => onExpandedChange(false)}
                aria-label="Close all filters"
              >
                <Icon.Cross size={18} color="currentColor" />
              </button>
            </div>

            <div className="advanced-filters-list">
              <MultiSelectPill
                label="Auction state"
                options={[...AUCTION_STATE_OPTIONS]}
                selected={filters.auctionStates}
                onChange={(next) => onFilterChange("auctionStates", next as InventoryFilters["auctionStates"])}
              />
              <MultiSelectPill
                label="Body style"
                options={toLabelOptions(options.bodyStyles)}
                selected={filters.bodyStyles}
                onChange={(next) => onFilterChange("bodyStyles", next)}
              />
              <MultiSelectPill
                label="Fuel type"
                options={toLabelOptions(options.fuelTypes)}
                selected={filters.fuelTypes}
                onChange={(next) => onFilterChange("fuelTypes", next)}
              />
              <MultiSelectPill
                label="Drivetrain"
                options={toLabelOptions(options.drivetrains)}
                selected={filters.drivetrains}
                onChange={(next) => onFilterChange("drivetrains", next)}
              />
              <MultiSelectPill
                label="Transmission"
                options={toLabelOptions(options.transmissions)}
                selected={filters.transmissions}
                onChange={(next) => onFilterChange("transmissions", next)}
              />
              <MultiSelectPill
                label="Title status"
                options={toLabelOptions(options.titleStatuses)}
                selected={filters.titleStatuses}
                onChange={(next) => onFilterChange("titleStatuses", next)}
              />
              <MultiSelectPill
                label="Province"
                options={toLabelOptions(options.provinces)}
                selected={filters.provinces}
                searchable
                searchPlaceholder="Search province"
                onChange={(next) => onFilterChange("provinces", next)}
              />
              <RangeSliderPill
                label="Condition grade"
                bounds={bounds.condition}
                step={0.1}
                value={filters.conditionRange}
                formatValue={(value) => value.toFixed(1)}
                formatSummary={(value, bounds) => `Grade ${formatConditionSummary(value, bounds)}`}
                onChange={(next) => onFilterChange("conditionRange", next)}
              />
              <DamageSelect value={filters.damage} onChange={(next) => onFilterChange("damage", next)} />
            </div>

            <div className="advanced-filters-foot">
              <button type="button" className="ms-pop-clear" onClick={onClearFilters}>
                Clear all
              </button>
              <button type="button" className="ms-pop-done" onClick={() => onExpandedChange(false)}>
                Done
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function toLabelOptions(values: readonly string[]): MultiSelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

function formatMileageSummary(value: Range, bounds: Range): string {
  const minAt = value.min === bounds.min;
  const maxAt = value.max === bounds.max;
  if (minAt && !maxAt) {
    return `under ${formatKm(value.max)}`;
  }
  if (!minAt && maxAt) {
    return `${formatKm(value.min)}+`;
  }
  return `${formatKm(value.min)}–${formatKm(value.max)}`;
}

function formatYearSummary(value: Range, bounds: Range): string {
  const minAt = value.min === bounds.min;
  const maxAt = value.max === bounds.max;
  if (value.min === value.max) {
    return `${value.min}`;
  }
  if (minAt && !maxAt) {
    return `${value.max} and older`;
  }
  if (!minAt && maxAt) {
    return `${value.min}+`;
  }
  return `${value.min}–${value.max}`;
}

function formatConditionSummary(value: Range, bounds: Range): string {
  const minAt = value.min === bounds.min;
  const maxAt = value.max === bounds.max;
  if (minAt && !maxAt) {
    return `≤ ${value.max.toFixed(1)}`;
  }
  if (!minAt && maxAt) {
    return `≥ ${value.min.toFixed(1)}`;
  }
  return `${value.min.toFixed(1)}–${value.max.toFixed(1)}`;
}

type DamageSelectProps = {
  value: InventoryFilters["damage"];
  onChange: (value: InventoryFilters["damage"]) => void;
};

function DamageSelect({ value, onChange }: DamageSelectProps) {
  return (
    <label className="select-pill">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as InventoryFilters["damage"])}
        aria-label="Damage"
      >
        {DAMAGE_OPTIONS.map((option) => (
          <option key={`damage-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon.Chevron size={14} color="#6b7280" />
    </label>
  );
}
