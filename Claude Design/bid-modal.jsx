/* Bid modal — multi-state form with services, payment, confirm */

const { useState: useBState, useRef: useBRef, useEffect: useBEffect } = React;

function MoneyInput({ value, onChange, focused, onFocus, onBlur }) {
  return (
    <div className={"money-input" + (focused ? " is-focus" : "")}>
      <span className="prefix">$</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode="numeric"
      />
    </div>
  );
}

function Checkbox({ checked, onChange, focused, onFocus, onBlur }) {
  return (
    <button
      type="button"
      className={"checkbox" + (checked ? " is-checked" : "") + (focused ? " is-focus" : "")}
      onClick={() => onChange(!checked)}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-checked={checked}
    >
    </button>
  );
}

function ServiceRow({ name, price, checked, onToggle, indent, focused, onFocus, onBlur }) {
  return (
    <div className="service-row">
      <span className={"name" + (indent ? " indent" : "")} style={indent ? { paddingLeft: "20px", position: "relative" } : null}>
        {indent && <span style={{ position: "absolute", left: 0, color: "#6b7280" }}>↳</span>}
        {name}
        <Icon.Info size={14} color="white" bg="#9ca3af" />
      </span>
      <span className="dots"></span>
      <span className="price">${price}</span>
      <Checkbox checked={checked} onChange={onToggle} focused={focused} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}

function BidModal({ vehicle, onClose, onConfirm }) {
  const [bid, setBid] = useBState("22,800");
  const [maxBid, setMaxBid] = useBState("250");
  const [notes, setNotes] = useBState("");
  const [asDesc, setAsDesc] = useBState(true);
  const [extGuar, setExtGuar] = useBState(true);
  const [transport, setTransport] = useBState(true);
  const [focus, setFocus] = useBState("maxbid"); // which field shows focus ring
  const [submitting, setSubmitting] = useBState(false);

  // ESC closes the modal
  useBEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => onConfirm(), 50);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div className="modal" role="dialog" aria-label="Place bid">
        <div className="modal-head">
          <h2 className="modal-title">Place bid</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <Icon.Cross size={20} />
          </button>
        </div>
        <div className="modal-vehicle">
          <div className="pic">
            <CarPlaceholder kind="truck" seed={3} />
          </div>
          <div className="meta">
            <div className="t">{vehicle.year} {vehicle.make} {vehicle.model}</div>
            <div className="s">{vehicle.miles.toLocaleString()} miles · Top bid ${vehicle.topBid.toLocaleString()}</div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <label className="field-label">Bid amount</label>
            <MoneyInput
              value={bid}
              onChange={setBid}
              focused={focus === "bid"}
              onFocus={() => setFocus("bid")}
              onBlur={() => setFocus(null)}
            />
          </div>

          <div>
            <label className="field-label">Max Bid amount</label>
            <MoneyInput
              value={maxBid}
              onChange={setMaxBid}
              focused={focus === "maxbid"}
              onFocus={() => setFocus("maxbid")}
              onBlur={() => setFocus(null)}
            />
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea
              className="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="services-panel">
            <div className="services-title">Services</div>
            <ServiceRow
              name="As Described Guarantee"
              price={135}
              checked={asDesc}
              onToggle={setAsDesc}
            />
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
            <ServiceRow
              name="Transportation"
              price={1395}
              checked={transport}
              onToggle={setTransport}
            />
            <div className="services-note">Selections will apply to future bids on this vehicle.</div>
          </div>

          <div className="payment-section">
            <a href="#" className="add-pm-link" onClick={(e) => e.preventDefault()}>
              Add new payment method
            </a>
            <label className="field-label">Payment method <span className="req">*</span></label>
            <select defaultValue="afc">
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
          <button className="btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm bid"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.BidModal = BidModal;
