/* Vehicle detail page */

const { useState: useDState, useEffect: useDEffect } = React;

function VisualBoostToggle() {
  const [on, setOn] = useDState(false);
  return (
    <div className="visual-boost">
      <Icon.ArrowUp size={14} color="#1f2937" />
      Visual boost AI
      <span className="q">?</span>
      <button className={"toggle" + (on ? " is-on" : "")} onClick={() => setOn(!on)}></button>
    </div>
  );
}

function ImageSlider() {
  return (
    <div className="image-slider">
      <div className="slot">
        <div className="knob"></div>
      </div>
    </div>
  );
}

function DetailTopBar({ endsIn, onBack }) {
  return (
    <div className="detail-top">
      <button className="back-btn" onClick={onBack}>
        <Icon.Chevron size={16} dir="left" /> Back to inventory
      </button>
      <div style={{ borderLeft: "1px solid var(--ol-border)", height: "32px", margin: "0 8px" }}></div>
      <div className="ends-in">
        <span className="label">Ends in</span>
        <span className="time">{endsIn}</span>
      </div>
      <div className="detail-top-right">
        <button className="btn-outline"><Icon.Heart size={16} color="#1652F0" /> Watchlist</button>
        <button className="btn-outline"><Icon.Note size={16} /> Notes</button>
      </div>
    </div>
  );
}

function SpecChips({ v }) {
  return (
    <div className="spec-chips">
      <div className="spec-chip">{v.drivetrain}</div>
      <div className="spec-chip">{v.transmission}</div>
      <div className="spec-chip">{v.fuel}</div>
      <div className="spec-chip">{v.engineFull}</div>
    </div>
  );
}

function BlackBookCard({ low, high }) {
  return (
    <div className="blackbook">
      <div className="blackbook-logo">BLACK<br />BOOK</div>
      <div className="blackbook-range">${low.toLocaleString()} - ${high.toLocaleString()}</div>
    </div>
  );
}

function MarketDataCard({ market }) {
  return (
    <div className="market-card">
      <div className="market-head">
        <div className="left">
          <span className="new-badge">NEW!</span>
          OPENLANE Market Data
          <Icon.Help size={16} bg="#9ca3af" />
        </div>
        <button className="view-btn">
          <Icon.TrendUp size={14} color="#1f2937" /> View
        </button>
      </div>
      <div className="market-stats">
        <div className="market-stat">
          <div className="label">Lowest</div>
          <div className="val">${market.lowest.toLocaleString()}</div>
        </div>
        <div className="market-stat">
          <div className="label">Average</div>
          <div className="val">${market.average.toLocaleString()}</div>
        </div>
        <div className="market-stat">
          <div className="label">High</div>
          <div className="val">${market.high.toLocaleString()}</div>
        </div>
      </div>
      <div className="market-foot">
        <Icon.Car size={16} color="#6b7280" />
        {market.similarCount.toLocaleString()} Similar vehicles in the last 3 months
      </div>
    </div>
  );
}

function TransportCard({ transport }) {
  return (
    <div className="transport-card">
      <div>
        <div className="transport-head">
          <Icon.Truck size={22} color="#1f2937" />
          Transport destination
        </div>
        <div className="transport-addr">{transport.address}</div>
        <div className="transport-meta">{transport.miles.toLocaleString()} miles away</div>
        <div className="transport-delivery">Estimated Delivery <b>{transport.delivery}</b></div>
      </div>
      <div className="transport-price">${transport.price.toLocaleString()}</div>
    </div>
  );
}

function DealerCard({ dealer }) {
  return (
    <div>
      <div className="dealer-card">
        <div className="logo">
          <div className="route66">
            <div style={{ fontSize: "5px", color: "#000" }}>ROUTE</div>
            <div style={{ fontSize: "10px", color: "#000", fontWeight: 900 }}>66</div>
          </div>
        </div>
        <div>
          <div className="name">{dealer.name}</div>
          <div className="loc">
            <Icon.Pin size={13} color="#1a1a1a" />
            {dealer.city}
          </div>
        </div>
      </div>
      <div className="dealer-actions">
        <button className="btn-primary">
          Follow <Icon.Plus size={14} color="white" />
        </button>
        <div className="dealer-stats">
          <div><Icon.Pie size={16} color="#374151" /> {dealer.sellPct}</div>
          <div className="sep"></div>
          <div><Icon.Doc size={16} color="#374151" /> {dealer.sellDays}</div>
          <div className="sep"></div>
          <div><Icon.Clock size={16} color="#374151" /> {dealer.timeLeft}</div>
        </div>
      </div>
    </div>
  );
}

function BidBar({ v, onBidClick }) {
  return (
    <div className="bid-bar">
      {v.isAbsolute && <div className="absolute-pill">Absolute sale</div>}
      <div className="top-bid">
        <div className="dealer-mini">
          <svg width="32" height="20" viewBox="0 0 32 20">
            <path d="M2 10 L8 4 L24 4 L30 10 L30 16 L2 16 Z" fill="#c92a2a" />
            <path d="M4 11 L9 7 L23 7 L28 11" stroke="white" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
        <span>Top bid <b style={{ fontWeight: 700 }}>${v.topBid.toLocaleString()}</b></span>
      </div>
      <div className="bids-count">{v.bids} Bids</div>
      <button className="btn-bid" onClick={onBidClick}>Bid</button>
    </div>
  );
}

function VehicleDetail({ v, onBack, onBid }) {
  return (
    <div>
      <TopNav />
      <DetailTopBar endsIn={v.endsIn} onBack={onBack} />
      <div className="detail-wrap">
        <div>
          <div className="detail-image">
            <CarPlaceholder kind="truck" seed={3} />
            <VisualBoostToggle />
            <ImageSlider />
          </div>
          <div className="thumbs-strip">
            {v.thumbs.map((t, i) => (
              <div key={i} className="thumb">
                <CarPlaceholder kind="truck" seed={i + 5} />
                {i === 2 && (
                  <div className="more-overlay">
                    <span>+2 more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="detail-right">
          <h1 className="dr-title">
            {v.year} {v.make} {v.model}
            <Icon.Ext size={18} color="#1652F0" />
          </h1>
          <div className="dr-row">
            <span className="strong">{v.miles.toLocaleString()} miles</span>
            <div className="divider"></div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <span className="strong">VIN</span>
              <span className="dr-vin">xxxxxxxxxxxxxxxxx</span>
              <Icon.Barcode size={18} color="#6b7280" />
              <Icon.Copy size={14} color="#6b7280" />
            </span>
          </div>
          <div className="dr-line">
            <Icon.Cal size={16} color="#374151" />
            Auction on {v.auctionDate}
          </div>
          <div className="dr-line">
            <Icon.Flame size={16} color="#ef4444" />
            <span className="red">{v.interested} interested</span>
          </div>
          <div className="dr-line">
            <Icon.Shield size={18} color="#1f2937" />
            As Described Guarantee available
          </div>

          <SpecChips v={v} />

          <ul className="feature-list">
            {v.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <BlackBookCard low={v.blackBook.low} high={v.blackBook.high} />

          <MarketDataCard market={v.market} />

          <TransportCard transport={v.transport} />

          <DealerCard dealer={v.dealer} />
        </div>
      </div>
      <BidBar v={v} onBidClick={onBid} />
    </div>
  );
}

window.VehicleDetail = VehicleDetail;
