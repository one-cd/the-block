import { useEffect, useState } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { formatOdometerKm, pluralize } from "../../utils/format";
import { Icon } from "../icons/Icon";
import { VehicleImage } from "../media/VehicleImage";
import { BidBar } from "./BidBar";
import { DealerCard, SpecChips, TransportCard, VehicleFacts } from "./DetailCards";
import { DetailTopBar } from "./DetailTopBar";
import { TopNav } from "../layout/TopNav";

type VehicleDetailProps = {
  vehicle: VehicleViewModel;
  onBack: () => void;
  onBid: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
};

export function VehicleDetail({ vehicle, onBack, onBid, isWatchlisted, onToggleWatchlist }: VehicleDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVinCopied, setIsVinCopied] = useState(false);

  const handleCopyVin = async () => {
    try {
      await navigator.clipboard.writeText(vehicle.vin);
      setIsVinCopied(true);
      window.setTimeout(() => setIsVinCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. non-secure context); fail silently.
    }
  };

  return (
    <div>
      <TopNav />
      <DetailTopBar
        endsIn={vehicle.countdown}
        isWatchlisted={isWatchlisted}
        onBack={onBack}
        onToggleWatchlist={onToggleWatchlist}
      />
      <div className="detail-wrap">
        <div>
          <div className="detail-image">
            <VehicleImage vehicle={vehicle} className="detail-image-inner" imageIndex={selectedImage} />
          </div>
          <div className="thumbs-strip">
            {vehicle.images.slice(0, 3).map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={`thumb${selectedImage === index ? " is-active" : ""}`}
                type="button"
                onClick={() => {
                  if (index === 2 && vehicle.images.length > 3) {
                    setSelectedImage(index);
                    setIsGalleryOpen(true);
                  } else {
                    setSelectedImage(index);
                  }
                }}
                aria-label={index === 2 && vehicle.images.length > 3 ? "Open image gallery" : `Show image ${index + 1}`}
              >
                <VehicleImage vehicle={vehicle} imageIndex={index} className="thumb-inner" />
                {index === 2 && vehicle.images.length > 3 ? (
                  <div className="more-overlay">
                    <span>+{vehicle.images.length - 2} more</span>
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <aside className="detail-right">
          <h1 className="dr-title">
            {vehicle.title}
          </h1>
          <div className="dr-row">
            <span className="strong">{formatOdometerKm(vehicle.odometerKm)}</span>
            <div className="divider" />
            <span className="vin-line">
              <span className="strong">VIN</span>
              <span className="dr-vin">{vehicle.vin}</span>
              <button
                className="vin-copy"
                type="button"
                onClick={handleCopyVin}
                aria-label={isVinCopied ? "VIN copied" : "Copy VIN to clipboard"}
              >
                {isVinCopied ? <Icon.Check size={14} color="#16a34a" /> : <Icon.Copy size={14} color="#6b7280" />}
              </button>
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

          <SpecChips vehicle={vehicle} />
          <VehicleFacts vehicle={vehicle} />
          <TransportCard vehicle={vehicle} />
          <DealerCard vehicle={vehicle} />
        </aside>
      </div>
      <BidBar vehicle={vehicle} onBidClick={onBid} />
      {isGalleryOpen ? (
        <ImageGalleryModal
          vehicle={vehicle}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          onClose={() => setIsGalleryOpen(false)}
        />
      ) : null}
    </div>
  );
}

function ImageGalleryModal({
  vehicle,
  selectedImage,
  onSelectImage,
  onClose,
}: {
  vehicle: VehicleViewModel;
  selectedImage: number;
  onSelectImage: (index: number) => void;
  onClose: () => void;
}) {
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
      <div className="modal gallery-modal" role="dialog" aria-label="Vehicle image gallery" aria-modal="true">
        <div className="modal-head">
          <div>
            <h2 className="modal-title">Vehicle images</h2>
            <div className="gallery-count">{selectedImage + 1} of {vehicle.images.length}</div>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close image gallery">
            <Icon.Cross size={20} />
          </button>
        </div>
        <VehicleImage vehicle={vehicle} imageIndex={selectedImage} className="gallery-main" />
        <div className="gallery-grid">
          {vehicle.images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={`gallery-thumb${selectedImage === index ? " is-active" : ""}`}
              type="button"
              onClick={() => onSelectImage(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <VehicleImage vehicle={vehicle} imageIndex={index} className="gallery-thumb-inner" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
