import { Icon } from "../icons/Icon";

type ResultsBarProps = {
  count: number;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
};

export function ResultsBar({ count, view, onViewChange }: ResultsBarProps) {
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
      <button className="sort-select" type="button">
        Most recently listed
        <Icon.Chevron size={14} color="#6b7280" />
      </button>
    </div>
  );
}
