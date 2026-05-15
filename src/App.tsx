import { useCallback, useMemo, useState } from "react";
import { BidModal } from "./components/bidding/BidModal";
import { VehicleDetail } from "./components/detail/VehicleDetail";
import { Confetti } from "./components/feedback/Confetti";
import { SuccessToast } from "./components/feedback/SuccessToast";
import { InventoryPage } from "./components/inventory/InventoryPage";
import { createVehicleViewModels } from "./data/vehicles";
import { useNow } from "./hooks/useNow";
import { useBrowserSession } from "./state/useBrowserSession";
import type { VehicleViewModel } from "./types/vehicle";
import { formatCurrency } from "./utils/format";

type Route =
  | { name: "inventory" }
  | { name: "detail"; vehicleId: string };

export default function App() {
  const now = useNow();
  const [timelineBase] = useState(() => new Date());
  const { session, placeBid, hasBid, toggleWatchlist, isWatchlisted } = useBrowserSession();
  const [route, setRoute] = useState<Route>({ name: "inventory" });
  const [activeBidVehicle, setActiveBidVehicle] = useState<VehicleViewModel | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toastAmount, setToastAmount] = useState<string | null>(null);
  const vehicles = useMemo(() => createVehicleViewModels(session, now, timelineBase), [session, now, timelineBase]);
  const activeVehicle = route.name === "detail" ? vehicles.find((vehicle) => vehicle.id === route.vehicleId) ?? null : null;

  const openDetail = useCallback((vehicle: VehicleViewModel) => {
    setRoute({ name: "detail", vehicleId: vehicle.id });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const backToInventory = useCallback(() => {
    setRoute({ name: "inventory" });
    setActiveBidVehicle(null);
  }, []);

  const handleConfirmBid = useCallback((amount: number) => {
    if (!activeBidVehicle) {
      return;
    }

    placeBid(activeBidVehicle.id, amount);
    setActiveBidVehicle(null);
    setShowConfetti(true);
    setToastAmount(formatCurrency(amount));
    window.setTimeout(() => setToastAmount(null), 3000);
  }, [activeBidVehicle, placeBid]);

  return (
    <>
      {route.name === "inventory" ? (
        <InventoryPage vehicles={vehicles} onOpenVehicle={openDetail} hasBid={hasBid} isWatchlisted={isWatchlisted} />
      ) : activeVehicle ? (
        <VehicleDetail
          vehicle={activeVehicle}
          onBack={backToInventory}
          onBid={() => setActiveBidVehicle(activeVehicle)}
          onToggleWatchlist={() => toggleWatchlist(activeVehicle.id)}
          isWatchlisted={isWatchlisted(activeVehicle.id)}
        />
      ) : (
        <InventoryPage vehicles={vehicles} onOpenVehicle={openDetail} hasBid={hasBid} isWatchlisted={isWatchlisted} />
      )}

      {activeBidVehicle ? (
        <BidModal
          vehicle={activeBidVehicle}
          onClose={() => setActiveBidVehicle(null)}
          onConfirm={handleConfirmBid}
        />
      ) : null}
      {showConfetti ? <Confetti onDone={() => setShowConfetti(false)} /> : null}
      {toastAmount ? <SuccessToast amount={toastAmount} /> : null}
    </>
  );
}
