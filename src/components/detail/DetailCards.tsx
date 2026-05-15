import type { VehicleViewModel } from "../../types/vehicle";
import { formatCurrency, titleCase } from "../../utils/format";
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

export function TransportCard({ vehicle }: { vehicle: VehicleViewModel }) {
  return (
    <div className="transport-card">
      <div>
        <div className="transport-head">
          <Icon.Truck size={22} color="#1f2937" />
          Pickup destination
        </div>
        <div className="transport-addr">{vehicle.city}, {vehicle.province}</div>
        <div className="transport-delivery">Auction <b>{vehicle.auctionLabel}</b></div>
      </div>
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
