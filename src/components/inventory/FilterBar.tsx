import { Icon } from "../icons/Icon";
import {
  AUCTION_STATE_OPTIONS,
  CONDITION_OPTIONS,
  DAMAGE_OPTIONS,
  MILEAGE_OPTIONS,
  SAVED_SEARCH_OPTIONS,
  YEAR_OPTIONS,
  type FilterOptions,
  type InventoryFilters,
  type SavedSearch,
} from "./inventoryControls";

type FilterBarProps = {
  searchTerm: string;
  filters: InventoryFilters;
  options: FilterOptions;
  activeFilterCount: number;
  isExpanded: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: <Key extends keyof InventoryFilters>(key: Key, value: InventoryFilters[Key]) => void;
  onSavedSearchChange: (value: SavedSearch) => void;
  onClearFilters: () => void;
  onExpandedChange: (value: boolean) => void;
};

export function FilterBar({
  searchTerm,
  filters,
  options,
  activeFilterCount,
  isExpanded,
  onSearchChange,
  onFilterChange,
  onSavedSearchChange,
  onClearFilters,
  onExpandedChange,
}: FilterBarProps) {
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
        <SelectPill
          ariaLabel="Saved searches"
          value=""
          options={SAVED_SEARCH_OPTIONS}
          onChange={(value) => onSavedSearchChange(value as SavedSearch)}
        />
        <div className="absolute-sale">
          <span>Absolute sale</span>
          <button
            className={`toggle${filters.absolute ? " is-on" : ""}`}
            type="button"
            onClick={() => onFilterChange("absolute", !filters.absolute)}
            aria-label="Absolute sale"
            aria-pressed={filters.absolute}
          />
        </div>
        <SelectPill
          ariaLabel="Mileage"
          value={filters.mileage}
          options={MILEAGE_OPTIONS}
          onChange={(value) => onFilterChange("mileage", value as InventoryFilters["mileage"])}
        />
        <SelectPill
          ariaLabel="Year"
          value={filters.year}
          options={YEAR_OPTIONS}
          onChange={(value) => onFilterChange("year", value as InventoryFilters["year"])}
        />
        <SelectPill
          ariaLabel="Make/model"
          value={filters.makeModel}
          options={[{ value: "", label: "Any make/model" }, ...options.makeModels.map((makeModel) => ({ value: makeModel, label: makeModel }))]}
          onChange={(value) => onFilterChange("makeModel", value)}
        />
        <button
          className={`pill-select filter-with-icon${isExpanded ? " is-active" : ""}`}
          type="button"
          onClick={() => onExpandedChange(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <Icon.Filter size={15} color="#374151" />
          All filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
        {(activeFilterCount > 0 || searchTerm.trim()) ? (
          <button className="clear-filters" type="button" onClick={onClearFilters}>
            Clear
          </button>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="advanced-filters" aria-label="All filters">
          <SelectPill
            ariaLabel="Auction state"
            value={filters.auctionState}
            options={AUCTION_STATE_OPTIONS}
            onChange={(value) => onFilterChange("auctionState", value as InventoryFilters["auctionState"])}
          />
          <SelectPill
            ariaLabel="Body style"
            value={filters.bodyStyle}
            options={[{ value: "", label: "Any body style" }, ...options.bodyStyles.map((bodyStyle) => ({ value: bodyStyle, label: bodyStyle }))]}
            onChange={(value) => onFilterChange("bodyStyle", value)}
          />
          <SelectPill
            ariaLabel="Fuel type"
            value={filters.fuelType}
            options={[{ value: "", label: "Any fuel type" }, ...options.fuelTypes.map((fuelType) => ({ value: fuelType, label: fuelType }))]}
            onChange={(value) => onFilterChange("fuelType", value)}
          />
          <SelectPill
            ariaLabel="Drivetrain"
            value={filters.drivetrain}
            options={[{ value: "", label: "Any drivetrain" }, ...options.drivetrains.map((drivetrain) => ({ value: drivetrain, label: drivetrain }))]}
            onChange={(value) => onFilterChange("drivetrain", value)}
          />
          <SelectPill
            ariaLabel="Transmission"
            value={filters.transmission}
            options={[{ value: "", label: "Any transmission" }, ...options.transmissions.map((transmission) => ({ value: transmission, label: transmission }))]}
            onChange={(value) => onFilterChange("transmission", value)}
          />
          <SelectPill
            ariaLabel="Title status"
            value={filters.titleStatus}
            options={[{ value: "", label: "Any title status" }, ...options.titleStatuses.map((titleStatus) => ({ value: titleStatus, label: titleStatus }))]}
            onChange={(value) => onFilterChange("titleStatus", value)}
          />
          <SelectPill
            ariaLabel="Condition grade"
            value={filters.condition}
            options={CONDITION_OPTIONS}
            onChange={(value) => onFilterChange("condition", value as InventoryFilters["condition"])}
          />
          <SelectPill
            ariaLabel="Damage"
            value={filters.damage}
            options={DAMAGE_OPTIONS}
            onChange={(value) => onFilterChange("damage", value as InventoryFilters["damage"])}
          />
          <SelectPill
            ariaLabel="Province"
            value={filters.province}
            options={[{ value: "", label: "Any province" }, ...options.provinces.map((province) => ({ value: province, label: province }))]}
            onChange={(value) => onFilterChange("province", value)}
          />
        </div>
      ) : null}
    </div>
  );
}

type SelectOption = {
  value: string;
  label: string;
};

type SelectPillProps = {
  ariaLabel: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
};

function SelectPill({ ariaLabel, value, options, onChange }: SelectPillProps) {
  return (
    <label className="select-pill">
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
        {options.map((option) => (
          <option key={`${ariaLabel}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon.Chevron size={14} color="#6b7280" />
    </label>
  );
}
