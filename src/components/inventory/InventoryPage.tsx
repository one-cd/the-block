import { useMemo, useState, useTransition } from "react";
import type { VehicleViewModel } from "../../types/vehicle";
import { filterVehicles } from "../../data/vehicles";
import { SubNav } from "../layout/SubNav";
import { TopNav } from "../layout/TopNav";
import { FilterBar } from "./FilterBar";
import { ResultsBar } from "./ResultsBar";
import { VehicleCard } from "./VehicleCard";

type InventoryPageProps = {
  vehicles: VehicleViewModel[];
  onOpenVehicle: (vehicle: VehicleViewModel) => void;
  hasBid: (vehicleId: string) => boolean;
};

export function InventoryPage({ vehicles, onOpenVehicle, hasBid }: InventoryPageProps) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [absolute, setAbsolute] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [, startTransition] = useTransition();

  const filteredVehicles = useMemo(() => {
    let result = filterVehicles(vehicles, searchTerm);
    if (absolute) {
      result = result.filter((vehicle) => vehicle.isAbsolute);
    }
    if (tab === "bids") {
      result = result.filter((vehicle) => hasBid(vehicle.id));
    }
    return result;
  }, [vehicles, searchTerm, absolute, tab, hasBid]);

  const handleSearchChange = (value: string) => {
    startTransition(() => setSearchTerm(value));
  };

  return (
    <div>
      <TopNav />
      <SubNav tab={tab} onTabChange={setTab} />
      <FilterBar
        searchTerm={searchTerm}
        absolute={absolute}
        onSearchChange={handleSearchChange}
        onAbsoluteChange={setAbsolute}
      />
      <ResultsBar count={filteredVehicles.length} view={view} onViewChange={setView} />
      {filteredVehicles.length === 0 ? (
        <div className="empty-results">{emptyMessage(searchTerm, tab)}</div>
      ) : (
        <div className={`grid${view === "list" ? " is-list" : ""}`}>
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onOpenVehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

function emptyMessage(searchTerm: string, tab: string): string {
  if (tab === "bids") {
    return "You haven't placed any bids yet. Open a vehicle and place a bid to see it here.";
  }

  if (searchTerm.trim()) {
    return `No vehicles match "${searchTerm}". Try a make, model, VIN, lot, dealer, city, or title status.`;
  }

  return "No vehicles match your filters. Try clearing Absolute sale or other filters.";
}
