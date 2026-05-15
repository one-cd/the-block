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
  const [maxBid, setMaxBid] = useState("");
  const [notes, setNotes] = useState("");
  const [asDesc, setAsDesc] = useState(vehicle.titleStatus === "clean");
  const [extGuar, setExtGuar] = useState(vehicle.conditionGrade >= 3);
  const [transport, setTransport] = useState(false);
  const [focus, setFocus] = useState<string | null>("bid");
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
            <div className="s">{formatOdometerKm(vehicle.odometerKm)} · Top bid {formatCurrency(vehicle.topBid)}</div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <label className="field-label" htmlFor="bid-amount">Bid amount</label>
            <MoneyInput
              id="bid-amount"
              value={bid}
              onChange={setBid}
              focused={focus === "bid"}
              onFocus={() => setFocus("bid")}
              onBlur={() => setFocus(null)}
            />
            {error ? <div className="field-error">{error}</div> : null}
          </div>

          <div>
            <label className="field-label" htmlFor="max-bid-amount">Max Bid amount</label>
            <MoneyInput
              id="max-bid-amount"
              value={maxBid}
              onChange={setMaxBid}
              focused={focus === "maxbid"}
              onFocus={() => setFocus("maxbid")}
              onBlur={() => setFocus(null)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="bid-notes">Notes</label>
            <textarea
              id="bid-notes"
              className="notes-input"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="services-panel">
            <div className="services-title">Services</div>
            <ServiceRow name="As Described Guarantee" price={135} checked={asDesc} onToggle={setAsDesc} />
            <ServiceRow
              name="Extended Guarantee"
              price={75}
              checked={extGuar}
              onToggle={setExtGuar}
              indent
              focused={focus === "ext"}
              onFocus={() => setFocus("ext")}
              onBlur={() => setFocus(null)}
            />
            <ServiceRow name="Transportation" price={1395} checked={transport} onToggle={setTransport} />
            <div className="services-note">Selections will apply to future bids on this vehicle.</div>
          </div>

          <div className="payment-section">
            <a href="#" className="add-pm-link" onClick={(event) => event.preventDefault()}>
              Add new payment method
            </a>
            <label className="field-label" htmlFor="payment-method">Payment method <span className="req">*</span></label>
            <select id="payment-method" defaultValue="afc">
              <option value="afc">AFC - Automotive Finance Corporation #123-456-789</option>
              <option value="other">Other payment method</option>
            </select>
          </div>

          <div className="estimate-link">
            Estimate your buy fee
            <Icon.Info size={16} bg="#9ca3af" />
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

type MoneyInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
};

function MoneyInput({ id, value, onChange, focused, onFocus, onBlur, placeholder }: MoneyInputProps) {
  return (
    <div className={`money-input${focused ? " is-focus" : ""}`}>
      <span className="prefix">$</span>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode="numeric"
      />
    </div>
  );
}

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

function Checkbox({ checked, onChange, focused, onFocus, onBlur }: CheckboxProps) {
  return (
    <button
      type="button"
      className={`checkbox${checked ? " is-checked" : ""}${focused ? " is-focus" : ""}`}
      onClick={() => onChange(!checked)}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-checked={checked}
      role="checkbox"
    />
  );
}

type ServiceRowProps = {
  name: string;
  price: number;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  indent?: boolean;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

function ServiceRow({ name, price, checked, onToggle, indent, focused, onFocus, onBlur }: ServiceRowProps) {
  return (
    <div className="service-row">
      <span className={`name${indent ? " indent" : ""}`}>
        {indent ? <span className="service-indent-arrow">↳</span> : null}
        {name}
        <Icon.Info size={14} color="white" bg="#9ca3af" />
      </span>
      <span className="dots" />
      <span className="price">{formatCurrency(price)}</span>
      <Checkbox checked={checked} onChange={onToggle} focused={focused} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}
