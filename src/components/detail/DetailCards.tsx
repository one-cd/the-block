import { useEffect, useState } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { formatCurrency, formatNumber, formatOdometerKm, titleCase } from "../../utils/format";
import { Icon } from "../icons/Icon";

export function SpecChips({ vehicle }: { vehicle: VehicleViewModel }) {
  return (
    <div className="spec-chips">
      <div className="spec-chip">{vehicle.drivetrain}</div>
      <div className="spec-chip">{vehicle.transmission}</div>
      <div className="spec-chip">{vehicle.fuelType}</div>
      <div className="spec-chip">{vehicle.engine}</div>
    </div>
  );
}

export function VehicleFacts({ vehicle }: { vehicle: VehicleViewModel }) {
  const facts = [
    `${vehicle.bodyStyle} body`,
    `${vehicle.exteriorColor} exterior`,
    `${vehicle.interiorColor} interior`,
    `${titleCase(vehicle.titleStatus)} title`,
    vehicle.reservePrice == null ? "No reserve listed" : `Reserve ${formatCurrency(vehicle.reservePrice)}`,
    vehicle.buyNowPrice == null ? "No buy now price" : `Buy now ${formatCurrency(vehicle.buyNowPrice)}`,
  ];

  return (
    <ul className="feature-list">
      {facts.map((fact) => <li key={fact}>{fact}</li>)}
      <li>{vehicle.conditionReport}</li>
      {vehicle.damageNotes.length > 0 ? vehicle.damageNotes.map((note) => <li key={note}>{note}</li>) : <li>No damage notes reported</li>}
    </ul>
  );
}

export function MarketDataCard({ vehicle }: { vehicle: VehicleViewModel }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="market-card">
        <div className="market-head">
          <div className="left">
            <span className="new-badge">NEW!</span>
            OPENLANE Market Data
            <Icon.Help size={16} bg="#9ca3af" />
          </div>
          <button className="view-btn" type="button" onClick={() => setIsOpen(true)}>
            <Icon.TrendUp size={14} color="#1f2937" /> View
          </button>
        </div>
        <div className="market-stats">
          <div className="market-stat">
            <div className="label">Lowest</div>
            <div className="val">{formatCurrency(vehicle.market.lowest)}</div>
          </div>
          <div className="market-stat">
            <div className="label">Average</div>
            <div className="val">{formatCurrency(vehicle.market.average)}</div>
          </div>
          <div className="market-stat">
            <div className="label">High</div>
            <div className="val">{formatCurrency(vehicle.market.high)}</div>
          </div>
        </div>
        <div className="market-foot">
          <Icon.Car size={16} color="#6b7280" />
          {formatNumber(vehicle.market.similarCount)} Similar vehicles in this dataset
        </div>
      </div>
      {isOpen ? <MarketDataModal vehicle={vehicle} onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}

function MarketDataModal({ vehicle, onClose }: { vehicle: VehicleViewModel; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }}>
      <div className="modal market-modal" role="dialog" aria-label="Market data" aria-modal="true">
        <div className="modal-head">
          <div>
            <h2 className="modal-title">Market data</h2>
            <div className="market-modal-subtitle">{vehicle.title}</div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close market data">
            <Icon.Cross size={20} />
          </button>
        </div>
        <div className="market-modal-summary">
          <div>
            <span>Lowest</span>
            <strong>{formatCurrency(vehicle.market.lowest)}</strong>
          </div>
          <div>
            <span>Average</span>
            <strong>{formatCurrency(vehicle.market.average)}</strong>
          </div>
          <div>
            <span>High</span>
            <strong>{formatCurrency(vehicle.market.high)}</strong>
          </div>
        </div>
        <div className="market-modal-list">
          {vehicle.market.comparables.length > 0 ? vehicle.market.comparables.map((comparable) => (
            <div className="market-row" key={comparable.id}>
              <div>
                <div className="market-row-title">{comparable.title}</div>
                <div className="market-row-meta">
                  {comparable.bodyStyle} · {formatOdometerKm(comparable.odometerKm)} · {titleCase(comparable.titleStatus)} title
                </div>
                <div className="market-row-meta">{comparable.location}</div>
              </div>
              <div className="market-row-price">
                <strong>{formatCurrency(comparable.buyNowPrice ?? comparable.topPrice)}</strong>
                <span>{comparable.buyNowPrice == null ? "Top listed price" : "Buy now"}</span>
                <span>Grade {comparable.conditionGrade.toFixed(1)}</span>
              </div>
            </div>
          )) : (
            <div className="market-empty">No comparable vehicles are available in this dataset.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TransportCard({ vehicle }: { vehicle: VehicleViewModel }) {
  const estimate = Math.max(250, Math.round((vehicle.odometerKm / 125) + 350));

  return (
    <div className="transport-card">
      <div>
        <div className="transport-head">
          <Icon.Truck size={22} color="#1f2937" />
          Transport destination
        </div>
        <div className="transport-addr">{vehicle.city}, {vehicle.province}</div>
        <div className="transport-meta">Vehicle location from listing</div>
        <div className="transport-delivery">Auction <b>{vehicle.auctionLabel}</b></div>
      </div>
      <div className="transport-price">{formatCurrency(estimate)}</div>
    </div>
  );
}

export function DealerCard({ vehicle }: { vehicle: VehicleViewModel }) {
  return (
    <div>
      <div className="dealer-card">
        <div className="logo">
          <div className="route66">
            <div className="route66-top">LOT</div>
            <div className="route66-main">{vehicle.lot.slice(0, 1)}</div>
          </div>
        </div>
        <div>
          <div className="name">{vehicle.sellingDealership}</div>
          <div className="loc">
            <Icon.Pin size={13} color="#1a1a1a" />
            {vehicle.location}
          </div>
        </div>
      </div>
      <div className="dealer-actions">
        <button className="btn-primary" type="button">
          Follow <Icon.Plus size={14} color="white" />
        </button>
        <div className="dealer-stats">
          <div><Icon.Pie size={16} color="#374151" /> {vehicle.conditionGrade.toFixed(1)}</div>
          <div className="sep" />
          <div><Icon.Doc size={16} color="#374151" /> {titleCase(vehicle.titleStatus)}</div>
          <div className="sep" />
          <div><Icon.Clock size={16} color="#374151" /> {vehicle.timeLeft}</div>
        </div>
      </div>
    </div>
  );
}
