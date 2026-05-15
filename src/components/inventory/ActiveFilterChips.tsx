import { Icon } from "../icons/Icon";
import {
  AUCTION_STATE_OPTIONS,
  DAMAGE_OPTIONS,
  isRangeNarrowed,
  type DatasetBounds,
  type InventoryFilters,
} from "./inventoryControls";

type ActiveFilterChipsProps = {
  filters: InventoryFilters;
  bounds: DatasetBounds;
  searchTerm: string;
  onRemoveValue: <Key extends keyof InventoryFilters>(key: Key, value: string) => void;
  onResetRange: (key: "mileageRange" | "yearRange" | "conditionRange") => void;
  onClearDamage: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
};

type Chip = {
  id: string;
  label: string;
  onRemove: () => void;
};

export function ActiveFilterChips({
  filters,
  bounds,
  searchTerm,
  onRemoveValue,
  onResetRange,
  onClearDamage,
  onClearSearch,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips = buildChips({
    filters,
    bounds,
    searchTerm,
    onRemoveValue,
    onResetRange,
    onClearDamage,
    onClearSearch,
  });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="active-chips" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className="active-chip"
          onClick={chip.onRemove}
          aria-label={`Remove ${chip.label}`}
        >
          <span className="active-chip-label">{chip.label}</span>
          <Icon.Cross size={12} color="currentColor" />
        </button>
      ))}
      <button type="button" className="active-chips-clear" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}

type BuildChipsArgs = Omit<ActiveFilterChipsProps, "onClearAll">;

function buildChips({
  filters,
  bounds,
  searchTerm,
  onRemoveValue,
  onResetRange,
  onClearDamage,
  onClearSearch,
}: BuildChipsArgs): Chip[] {
  const chips: Chip[] = [];
  const trimmedSearch = searchTerm.trim();

  if (trimmedSearch) {
    chips.push({
      id: "search",
      label: `Search: ${truncate(trimmedSearch, 24)}`,
      onRemove: onClearSearch,
    });
  }

  for (const value of filters.makeModels) {
    chips.push({
      id: `makeModels:${value}`,
      label: value,
      onRemove: () => onRemoveValue("makeModels", value),
    });
  }
  for (const value of filters.bodyStyles) {
    chips.push({
      id: `bodyStyles:${value}`,
      label: value,
      onRemove: () => onRemoveValue("bodyStyles", value),
    });
  }
  for (const value of filters.fuelTypes) {
    chips.push({
      id: `fuelTypes:${value}`,
      label: value,
      onRemove: () => onRemoveValue("fuelTypes", value),
    });
  }
  for (const value of filters.drivetrains) {
    chips.push({
      id: `drivetrains:${value}`,
      label: value,
      onRemove: () => onRemoveValue("drivetrains", value),
    });
  }
  for (const value of filters.transmissions) {
    chips.push({
      id: `transmissions:${value}`,
      label: value,
      onRemove: () => onRemoveValue("transmissions", value),
    });
  }
  for (const value of filters.titleStatuses) {
    chips.push({
      id: `titleStatuses:${value}`,
      label: `Title: ${value}`,
      onRemove: () => onRemoveValue("titleStatuses", value),
    });
  }
  for (const value of filters.provinces) {
    chips.push({
      id: `provinces:${value}`,
      label: value,
      onRemove: () => onRemoveValue("provinces", value),
    });
  }
  for (const value of filters.auctionStates) {
    const option = AUCTION_STATE_OPTIONS.find((entry) => entry.value === value);
    chips.push({
      id: `auctionStates:${value}`,
      label: option?.label ?? value,
      onRemove: () => onRemoveValue("auctionStates", value),
    });
  }

  if (isRangeNarrowed(filters.mileageRange, bounds.mileage)) {
    chips.push({
      id: "mileageRange",
      label: `Mileage ${formatMileageRange(filters.mileageRange, bounds.mileage)}`,
      onRemove: () => onResetRange("mileageRange"),
    });
  }
  if (isRangeNarrowed(filters.yearRange, bounds.year)) {
    chips.push({
      id: "yearRange",
      label: `Year ${formatYearRange(filters.yearRange, bounds.year)}`,
      onRemove: () => onResetRange("yearRange"),
    });
  }
  if (isRangeNarrowed(filters.conditionRange, bounds.condition)) {
    chips.push({
      id: "conditionRange",
      label: `Grade ${formatConditionRange(filters.conditionRange, bounds.condition)}`,
      onRemove: () => onResetRange("conditionRange"),
    });
  }

  if (filters.damage !== "any") {
    const option = DAMAGE_OPTIONS.find((entry) => entry.value === filters.damage);
    if (option) {
      chips.push({
        id: `damage:${filters.damage}`,
        label: option.label,
        onRemove: onClearDamage,
      });
    }
  }

  return chips;
}

function formatMileageRange(value: { min: number; max: number }, bounds: { min: number; max: number }): string {
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

function formatYearRange(value: { min: number; max: number }, bounds: { min: number; max: number }): string {
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

function formatConditionRange(value: { min: number; max: number }, bounds: { min: number; max: number }): string {
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

export function formatKm(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k km`;
  }
  return `${value.toLocaleString("en-US")} km`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
