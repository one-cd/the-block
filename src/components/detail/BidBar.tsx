import type { VehicleViewModel } from "../../types/vehicle";
import { formatCurrency, pluralize } from "../../utils/format";

type BidBarProps = {
  vehicle: VehicleViewModel;
  onBidClick: () => void;
};

export function BidBar({ vehicle, onBidClick }: BidBarProps) {
  return (
    <div className="bid-bar">
      <div className="auction-state-pills">
        {vehicle.buyNowPrice != null ? <span className="auction-state-pill buy-now">Buy now {formatCurrency(vehicle.buyNowPrice)}</span> : null}
        <span className={`auction-state-pill${vehicle.bidCount > 0 ? " active" : ""}`}>{vehicle.statusLabel}</span>
      </div>
      <div className="top-bid">
        <div className="dealer-mini">
          <svg width="32" height="20" viewBox="0 0 32 20" aria-hidden="true">
            <path d="M2 10 L8 4 L24 4 L30 10 L30 16 L2 16 Z" fill="#c92a2a" />
            <path d="M4 11 L9 7 L23 7 L28 11" stroke="white" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
        <span>
          {vehicle.bidCount === 0 ? "Starting bid" : "Top bid"} <b>{formatCurrency(vehicle.topBid)}</b>
        </span>
      </div>
      <div className="bids-count">{pluralize(vehicle.bidCount, "bid")}</div>
      <button className="btn-bid" type="button" onClick={onBidClick}>Bid</button>
    </div>
  );
}
