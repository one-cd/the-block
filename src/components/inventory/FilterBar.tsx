import { Icon } from "../icons/Icon";

type FilterBarProps = {
  searchTerm: string;
  absolute: boolean;
  onSearchChange: (value: string) => void;
  onAbsoluteChange: (value: boolean) => void;
};

export function FilterBar({ searchTerm, absolute, onSearchChange, onAbsoluteChange }: FilterBarProps) {
  return (
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
      <button className="pill-select" type="button">
        Saved searches
        <Icon.Chevron size={14} color="#6b7280" />
      </button>
      <div className="absolute-sale">
        <span>Absolute sale</span>
        <button
          className={`toggle${absolute ? " is-on" : ""}`}
          type="button"
          onClick={() => onAbsoluteChange(!absolute)}
          aria-label="Absolute sale"
          aria-pressed={absolute}
        />
      </div>
      <button className="pill-select" type="button">Distance <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select" type="button">Mileage <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select" type="button">Year <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select" type="button">Make/model <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select filter-with-icon" type="button">
        <Icon.Filter size={15} color="#374151" />
        All filters
      </button>
    </div>
  );
}
