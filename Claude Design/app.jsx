/* App root — view router + bid flow state */

const { useState: useAState } = React;

function App() {
  const [route, setRoute] = useAState("inventory"); // 'inventory' | 'detail'
  const [activeVehicle, setActiveVehicle] = useAState(null);
  const [showBid, setShowBid] = useAState(false);
  const [showConfetti, setShowConfetti] = useAState(false);
  const [showToast, setShowToast] = useAState(false);

  const openDetail = (v) => {
    // Always show the featured F150 detail (matches screenshots), but
    // honour the clicked vehicle's identity for the bid summary.
    const featured = window.FEATURED_VEHICLE;
    setActiveVehicle({ ...featured, _from: v });
    setRoute("detail");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const backToInventory = () => {
    setRoute("inventory");
    setActiveVehicle(null);
  };

  const handleConfirmBid = () => {
    setShowBid(false);
    setShowConfetti(true);
    setShowToast(true);
    // toast auto-dismiss
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <React.Fragment>
      {route === "inventory" && (
        <InventoryPage onOpenVehicle={openDetail} />
      )}
      {route === "detail" && activeVehicle && (
        <VehicleDetail
          v={activeVehicle}
          onBack={backToInventory}
          onBid={() => setShowBid(true)}
        />
      )}
      {showBid && activeVehicle && (
        <BidModal
          vehicle={activeVehicle}
          onClose={() => setShowBid(false)}
          onConfirm={handleConfirmBid}
        />
      )}
      {showConfetti && (
        <Confetti onDone={() => setShowConfetti(false)} />
      )}
      {showToast && (
        <div className="success-toast">
          <span className="ok-icon"><Icon.Check size={14} color="white" /></span>
          Your bid for $22,800 has been placed.
        </div>
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
