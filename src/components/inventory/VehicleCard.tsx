import type { VehicleViewModel } from "../../types/vehicle";
import { formatCurrency, formatOdometerKm, pluralize, titleCase } from "../../utils/format";
import { Icon } from "../icons/Icon";
import { VehicleImage } from "../media/VehicleImage";

type VehicleCardProps = {
  vehicle: VehicleViewModel;
  onClick: (vehicle: VehicleViewModel) => void;
};

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  return (
    <button className="vcard" type="button" onClick={() => onClick(vehicle)}>
      <VehicleImage vehicle={vehicle} className="vcard-image" />
      <div className="vcard-image-overlay">
        <div className="badge-rating">{vehicle.conditionGrade.toFixed(1)}</div>
        <div className="badge-timer">
          <Icon.Clock size={13} color="#1a1a1a" />
          {vehicle.countdown}
        </div>
      </div>
      <div className="vcard-body">
        <div className="vcard-title">
          <Icon.Megaphone size={14} color="#1a1a1a" />
          <span className="name">{vehicle.shortTitle}</span>
          <Icon.Ext size={12} color="#1652F0" />
        </div>
        <div className="vcard-specs">
          <span>{vehicle.engine}</span>
          <span className="sep">|</span>
          <span>{formatOdometerKm(vehicle.odometerKm)}</span>
        </div>
        <div className="vcard-stats">
          <div><Icon.Clock size={13} color="#6b7280" /> {vehicle.timeLeft}</div>
          <div><Icon.Doc size={13} color="#6b7280" /> {titleCase(vehicle.titleStatus)} title</div>
          <div><Icon.Pie size={13} color="#6b7280" /> {pluralize(vehicle.bidCount, "bid")}</div>
        </div>
        <div className="vcard-meta">
          <span className="loc"><Icon.Pin size={13} color="#1a1a1a" /> {vehicle.location}</span>
          <span className="status">{vehicle.statusLabel}</span>
        </div>
      </div>
      <div className="vcard-footer">
        <span className="label">{vehicle.currentBid == null ? "Starts" : "Top bid"}</span>
        <span className="price">{formatCurrency(vehicle.topBid)}</span>
      </div>
    </button>
  );
}
