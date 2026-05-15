import { useState } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { CarPlaceholder } from "./CarPlaceholder";

type VehicleImageProps = {
  vehicle: Pick<VehicleViewModel, "title" | "bodyStyle" | "id" | "images">;
  className?: string;
  imageIndex?: number;
};

export function VehicleImage({ vehicle, className, imageIndex = 0 }: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const image = vehicle.images[imageIndex] ?? vehicle.images[0];
  const seed = vehicle.id.charCodeAt(vehicle.id.length - 1) + imageIndex;
  const kind = getVehicleKind(vehicle.bodyStyle);

  return (
    <div className={className}>
      {!failed && image ? (
        <img src={image} alt={vehicle.title} onError={() => setFailed(true)} />
      ) : (
        <CarPlaceholder kind={kind} seed={seed} />
      )}
    </div>
  );
}

function getVehicleKind(bodyStyle: string): "sedan" | "suv" | "truck" {
  const normalized = bodyStyle.toLowerCase();

  if (normalized.includes("truck")) {
    return "truck";
  }

  if (normalized.includes("suv")) {
    return "suv";
  }

  return "sedan";
}
