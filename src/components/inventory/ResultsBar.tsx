import { Icon } from "../icons/Icon";
import { SORT_OPTIONS, type SortKey } from "./inventoryControls";

type ResultsBarProps = {
  count: number;
  view: "grid" | "list";
  sort: SortKey;
  onViewChange: (view: "grid" | "list") => void;
  onSortChange: (sort: SortKey) => void;
};

export function ResultsBar({ count, view, sort, onViewChange, onSortChange }: ResultsBarProps) {
  return (
    <div className="results-bar">
      <div className="results-count">{count === 0 ? "0 results" : `1-${count} of ${count} results`}</div>
      <div className="view-toggle">
        <button className={view === "list" ? "is-active" : ""} type="button" onClick={() => onViewChange("list")} aria-label="List view">
          <Icon.ListView size={18} />
        </button>
        <button className={view === "grid" ? "is-active" : ""} type="button" onClick={() => onViewChange("grid")} aria-label="Grid view">
          <Icon.GridView size={18} />
        </button>
      </div>
      <label className="sort-select">
        <span>Sort</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as SortKey)} aria-label="Sort results">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <Icon.Chevron size={14} color="#6b7280" />
      </label>
    </div>
  );
}
