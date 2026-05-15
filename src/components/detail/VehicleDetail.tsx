import type { VehicleViewModel } from "../../types/vehicle";
import { formatOdometerKm, pluralize } from "../../utils/format";
import { Icon } from "../icons/Icon";
import { VehicleImage } from "../media/VehicleImage";
import { BidBar } from "./BidBar";
import { BlackBookCard, DealerCard, MarketDataCard, SpecChips, TransportCard, VehicleFacts } from "./DetailCards";
import { DetailTopBar } from "./DetailTopBar";
import { TopNav } from "../layout/TopNav";

type VehicleDetailProps = {
  vehicle: VehicleViewModel;
  onBack: () => void;
  onBid: () => void;
};

export function VehicleDetail({ vehicle, onBack, onBid }: VehicleDetailProps) {
  return (
    <div>
      <TopNav />
      <DetailTopBar endsIn={vehicle.countdown} onBack={onBack} />
      <div className="detail-wrap">
        <div>
          <div className="detail-image">
            <VehicleImage vehicle={vehicle} className="detail-image-inner" />
            <VisualBoostToggle />
            <ImageSlider />
          </div>
          <div className="thumbs-strip">
            {vehicle.images.slice(0, 3).map((image, index) => (
              <div key={`${image}-${index}`} className="thumb">
                <VehicleImage vehicle={vehicle} imageIndex={index} className="thumb-inner" />
                {index === 2 && vehicle.images.length > 3 ? (
                  <div className="more-overlay">
                    <span>+{vehicle.images.length - 2} more</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <aside className="detail-right">
          <h1 className="dr-title">
            {vehicle.title}
            <Icon.Ext size={18} color="#1652F0" />
          </h1>
          <div className="dr-row">
            <span className="strong">{formatOdometerKm(vehicle.odometerKm)}</span>
            <div className="divider" />
            <span className="vin-line">
              <span className="strong">VIN</span>
              <span className="dr-vin">{vehicle.vin}</span>
              <Icon.Barcode size={18} color="#6b7280" />
              <Icon.Copy size={14} color="#6b7280" />
            </span>
          </div>
          <div className="dr-line">
            <Icon.Cal size={16} color="#374151" />
            Auction on {vehicle.auctionLabel}
          </div>
          {vehicle.bidCount > 0 ? (
            <div className="dr-line">
              <Icon.Flame size={16} color="#ef4444" />
              <span className="red">{pluralize(vehicle.bidCount, "bid")} placed</span>
            </div>
          ) : null}
          <div className="dr-line">
            <Icon.Shield size={18} color="#1f2937" />
            As Described Guarantee {vehicle.titleStatus === "clean" ? "available" : "review recommended"}
          </div>

          <SpecChips vehicle={vehicle} />
          <VehicleFacts vehicle={vehicle} />
          <BlackBookCard vehicle={vehicle} />
          <MarketDataCard vehicle={vehicle} />
          <TransportCard vehicle={vehicle} />
          <DealerCard vehicle={vehicle} />
        </aside>
      </div>
      <BidBar vehicle={vehicle} onBidClick={onBid} />
    </div>
  );
}

function VisualBoostToggle() {
  return (
    <div className="visual-boost">
      <Icon.ArrowUp size={14} color="#1f2937" />
      Visual boost AI
      <span className="q">?</span>
      <button className="toggle" type="button" aria-label="Visual boost AI" />
    </div>
  );
}

function ImageSlider() {
  return (
    <div className="image-slider">
      <div className="slot">
        <div className="knob" />
      </div>
    </div>
  );
}
