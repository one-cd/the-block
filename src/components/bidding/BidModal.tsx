import { useEffect, useMemo, useState } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { formatCurrency, formatCurrencyInput, formatOdometerKm, parseCurrencyInput } from "../../utils/format";
import { Icon } from "../icons/Icon";
import { VehicleImage } from "../media/VehicleImage";

type BidModalProps = {
  vehicle: VehicleViewModel;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function BidModal({ vehicle, onClose, onConfirm }: BidModalProps) {
  const minimumBid = vehicle.topBid + 100;
  const [bid, setBid] = useState(() => formatCurrencyInput(minimumBid));
  const [isFocused, setIsFocused] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const amount = useMemo(() => parseCurrencyInput(bid), [bid]);
  const error = amount == null || amount <= vehicle.topBid ? `Bid must be above ${formatCurrency(vehicle.topBid)}.` : null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleConfirm = () => {
    if (amount == null || error) {
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => onConfirm(amount), 120);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !submitting) {
        onClose();
      }
    }}>
      <div className="modal" role="dialog" aria-label="Place bid" aria-modal="true">
        <div className="modal-head">
          <h2 className="modal-title">Place bid</h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <Icon.Cross size={20} />
          </button>
        </div>
        <div className="modal-vehicle">
          <VehicleImage vehicle={vehicle} className="pic" />
          <div className="meta">
            <div className="t">{vehicle.title}</div>
            <div className="s">
              {formatOdometerKm(vehicle.odometerKm)} ·{" "}
              {vehicle.bidCount === 0 ? "Starting bid" : "Top bid"} {formatCurrency(vehicle.topBid)}
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <label className="field-label" htmlFor="bid-amount">Bid amount</label>
            <div className={`money-input${isFocused ? " is-focus" : ""}`}>
              <span className="prefix">$</span>
              <input
                id="bid-amount"
                type="text"
                value={bid}
                onChange={(event) => setBid(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                inputMode="numeric"
              />
            </div>
            {error ? <div className="field-error">{error}</div> : null}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" type="button" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn-confirm" type="button" onClick={handleConfirm} disabled={submitting || Boolean(error)}>
            {submitting ? "Confirming..." : "Confirm bid"}
          </button>
        </div>
      </div>
    </div>
  );
}
