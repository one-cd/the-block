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
};

export function InventoryPage({ vehicles, onOpenVehicle }: InventoryPageProps) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [absolute, setAbsolute] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [, startTransition] = useTransition();

  const filteredVehicles = useMemo(() => {
    const searched = filterVehicles(vehicles, searchTerm);
    return absolute ? searched.filter((vehicle) => vehicle.isAbsolute) : searched;
  }, [vehicles, searchTerm, absolute]);

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
      <div className={`grid${view === "list" ? " is-list" : ""}`}>
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onOpenVehicle} />
        ))}
      </div>
      {filteredVehicles.length === 0 ? (
        <div className="empty-results">
          No vehicles match "{searchTerm}". Try a make, model, VIN, lot, dealer, city, or title status.
        </div>
      ) : null}
    </div>
  );
}
