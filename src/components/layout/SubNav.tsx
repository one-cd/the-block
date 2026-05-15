type SubNavProps = {
  tab: string;
  onTabChange: (tab: string) => void;
};

const tabs = [
  { id: "all", label: "All inventory" },
  { id: "bids", label: "Bids" },
  { id: "watch", label: "Watchlist" },
];

export function SubNav({ tab, onTabChange }: SubNavProps) {
  return (
    <div className="subnav" aria-label="Auction sections">
      {tabs.map((item) => (
        <button
          key={item.id}
          className={`subnav-tab${tab === item.id ? " is-active" : ""}`}
          type="button"
          onClick={() => onTabChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
