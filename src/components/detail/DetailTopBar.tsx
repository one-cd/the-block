import { Icon } from "../icons/Icon";

type DetailTopBarProps = {
  endsIn: string;
  isWatchlisted: boolean;
  onBack: () => void;
  onToggleWatchlist: () => void;
};

export function DetailTopBar({ endsIn, isWatchlisted, onBack, onToggleWatchlist }: DetailTopBarProps) {
  return (
    <div className="detail-top">
      <button className="back-btn" type="button" onClick={onBack}>
        <Icon.Chevron size={16} dir="left" /> Back to inventory
      </button>
      <div className="detail-separator" />
      <div className="ends-in">
        <span className="label">Ends in</span>
        <span className="time">{endsIn}</span>
      </div>
      <div className="detail-top-right">
        <button className={`btn-outline${isWatchlisted ? " is-active" : ""}`} type="button" onClick={onToggleWatchlist} aria-pressed={isWatchlisted}>
          <Icon.Heart size={16} color="#1652F0" fill={isWatchlisted ? "#1652F0" : "none"} />
          {isWatchlisted ? "Watching" : "Watchlist"}
        </button>
      </div>
    </div>
  );
}
