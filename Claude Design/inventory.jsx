/* Inventory page: top nav, sub-nav, filters, results bar, vehicle grid */

const { useState } = React;

function OpenLaneLogo() {
  return (
    <a className="topnav-logo" href="#">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13.5" stroke="#1652F0" strokeWidth="3.5" />
        <path d="M11 16 L21 11 L21 21 Z" fill="#1652F0" />
      </svg>
      <span style={{ color: "#0a1b3d", fontSize: "20px", fontWeight: 800, letterSpacing: "0.02em" }}>
        OPEN<b style={{ color: "#1652F0" }}>LANE</b>
      </span>
    </a>
  );
}

function TopNav({ onClickAuction }) {
  return (
    <header className="topnav">
      <OpenLaneLogo />
      <div className="topnav-tabs">
        <button className="topnav-tab">Marketplace</button>
        <button className="topnav-tab is-active" onClick={onClickAuction}>Auction</button>
        <button className="topnav-tab">
          Transport
          <Icon.Ext size={12} color="currentColor" />
        </button>
      </div>
      <div className="topnav-right">
        <div className="dealer-pill">
          <div className="dealer-logo">
            <div>
              <div className="bow"></div>
              <div style={{ color: "#c92a2a", fontWeight: 800, fontSize: "8px", letterSpacing: "0.05em" }}>PELTIER</div>
              <div style={{ color: "#666", fontSize: "5.5px", fontWeight: 700, marginTop: "1px", letterSpacing: "0.05em" }}>CHEVROLET</div>
            </div>
          </div>
          <div className="dealer-name">
            Casey's Cars
            <Icon.Chevron size={14} color="#6b7280" />
          </div>
          <div className="dealer-warn">!</div>
        </div>
        <button className="bell">
          <Icon.Bell size={22} color="#1f2937" />
          <span className="bell-badge">8</span>
        </button>
      </div>
    </header>
  );
}

function SubNav({ tab, setTab }) {
  const tabs = [
    { id: "all", label: "All inventory", chev: true },
    { id: "bids", label: "Bids" },
    { id: "watch", label: "Watchlist" },
    { id: "hidden", label: "Hidden" },
  ];
  return (
    <div className="subnav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={"subnav-tab" + (tab === t.id ? " is-active" : "")}
          onClick={() => setTab(t.id)}
        >
          {t.label}
          {t.chev && <Icon.Chevron size={14} color="currentColor" />}
        </button>
      ))}
    </div>
  );
}

function FilterBar({ absolute, setAbsolute }) {
  return (
    <div className="filterbar">
      <div className="search-input">
        <Icon.Search size={16} color="#6b7280" />
        <input placeholder="Search" />
      </div>
      <button className="pill-select">
        Saved searches
        <Icon.Chevron size={14} color="#6b7280" />
      </button>
      <div className="absolute-sale">
        <span>Absolute sale</span>
        <button
          className={"toggle" + (absolute ? " is-on" : "")}
          onClick={() => setAbsolute(!absolute)}
          aria-label="Absolute sale"
        ></button>
      </div>
      <button className="pill-select">Distance <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select">Mileage <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select">Year <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select">Make/model <Icon.Chevron size={14} color="#6b7280" /></button>
      <button className="pill-select filter-with-icon">
        <Icon.Filter size={15} color="#374151" />
        All filters
      </button>
    </div>
  );
}

function ResultsBar({ view, setView }) {
  return (
    <div className="results-bar">
      <div className="results-count" style={{ marginLeft: "auto" }}>1-30 of 4369 results</div>
      <div className="view-toggle">
        <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}>
          <Icon.ListView size={18} />
        </button>
        <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")}>
          <Icon.GridView size={18} />
        </button>
      </div>
      <button className="sort-select">
        Most recently listed
        <Icon.Chevron size={14} color="#6b7280" />
      </button>
    </div>
  );
}

function fmtPrice(n) {
  return "$" + n.toLocaleString("en-US");
}
function fmtMiles(n) {
  return n.toLocaleString("en-US") + " mi";
}

// Stylized SVG vehicle placeholder. Looks like a parked car in a lot.
function CarPlaceholder({ kind = "sedan", seed = 0 }) {
  // Vary the silhouette slightly with seed
  const bodyColors = ["#2d3748", "#4a5568", "#1a202c", "#3a4555", "#5a6878", "#222a35", "#3b4252", "#4a5060"];
  const c = bodyColors[seed % bodyColors.length];
  const shadow = "rgba(0,0,0,0.25)";

  const Truck = (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="100" cy="82" rx="80" ry="4" fill={shadow} />
      <path d="M20,60 L20,50 L40,30 L80,28 L100,40 L180,40 L180,60 Z" fill={c} />
      <rect x="40" y="35" width="40" height="15" rx="2" fill="#cfd8e3" opacity="0.6" />
      <rect x="85" y="42" width="60" height="14" rx="1" fill={c} stroke="#000" strokeWidth="0.5" opacity="0.9" />
      <circle cx="50" cy="65" r="10" fill="#1a1a1a" />
      <circle cx="50" cy="65" r="5" fill="#3a3a3a" />
      <circle cx="155" cy="65" r="10" fill="#1a1a1a" />
      <circle cx="155" cy="65" r="5" fill="#3a3a3a" />
    </svg>
  );

  const Sedan = (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="100" cy="80" rx="78" ry="4" fill={shadow} />
      <path d="M15,62 Q15,52 30,48 L55,42 Q70,28 100,28 Q130,28 145,42 L175,48 Q185,52 185,62 L185,68 L15,68 Z" fill={c} />
      <path d="M55,42 Q70,30 100,30 Q130,30 145,42 L135,46 L65,46 Z" fill="#a8b8c8" opacity="0.7" />
      <path d="M98,32 L98,46 M102,32 L102,46" stroke={c} strokeWidth="1.5" />
      <circle cx="50" cy="68" r="11" fill="#1a1a1a" />
      <circle cx="50" cy="68" r="6" fill="#3a3a3a" />
      <circle cx="150" cy="68" r="11" fill="#1a1a1a" />
      <circle cx="150" cy="68" r="6" fill="#3a3a3a" />
      <rect x="22" y="58" width="6" height="3" rx="1" fill="#ffeb88" />
      <rect x="172" y="58" width="6" height="3" rx="1" fill="#dd3333" />
    </svg>
  );

  const Suv = (
    <svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="100" cy="80" rx="78" ry="4" fill={shadow} />
      <path d="M18,62 L18,48 Q18,40 28,38 L50,32 Q60,26 100,26 Q140,26 150,32 L172,38 Q182,40 182,48 L182,68 L18,68 Z" fill={c} />
      <rect x="40" y="34" width="40" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <rect x="85" y="34" width="35" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <rect x="125" y="34" width="30" height="20" rx="2" fill="#a8b8c8" opacity="0.7" />
      <circle cx="52" cy="68" r="12" fill="#1a1a1a" />
      <circle cx="52" cy="68" r="6" fill="#3a3a3a" />
      <circle cx="148" cy="68" r="12" fill="#1a1a1a" />
      <circle cx="148" cy="68" r="6" fill="#3a3a3a" />
    </svg>
  );

  const variant = kind === "truck" ? Truck : kind === "suv" ? Suv : Sedan;

  return (
    <React.Fragment>
      <div className="placeholder-tarmac"></div>
      <div className="placeholder-car">{variant}</div>
    </React.Fragment>
  );
}

function vehicleKind(v) {
  const m = (v.model + " " + (v.make || "")).toLowerCase();
  if (/(f150|silverado|truck|wrangler|tundra)/.test(m)) return "truck";
  if (/(rav4|envoy|tiguan|q5|cx-5|sportage|outback|rubicon)/.test(m)) return "suv";
  return "sedan";
}

function VehicleCard({ v, onClick }) {
  const kind = vehicleKind(v);
  const seed = v.id.charCodeAt(v.id.length - 1);
  return (
    <div className="vcard" onClick={onClick}>
      <div className="vcard-image">
        <CarPlaceholder kind={kind} seed={seed} />
        {v.rating != null && <div className="badge-rating">{v.rating}</div>}
        <div className="badge-timer">
          <Icon.Clock size={13} color="#1a1a1a" />
          {v.timer}
        </div>
      </div>
      <div className="vcard-body">
        <div className="vcard-title">
          <Icon.Megaphone size={14} color="#1a1a1a" />
          <span className="name">{v.year} {v.make} {v.model}</span>
          <Icon.Ext size={12} color="#1652F0" />
        </div>
        <div className="vcard-specs">
          <span>{v.engine}</span>
          <span className="sep">|</span>
          <span>{fmtMiles(v.miles)}</span>
        </div>
        <div className="vcard-stats">
          <div><Icon.Clock size={13} color="#6b7280" /> {v.timeLeft}</div>
          <div><Icon.Doc size={13} color="#6b7280" /> {v.sellDays}</div>
          <div><Icon.Pie size={13} color="#6b7280" /> {v.salesPct}</div>
        </div>
        <div className="vcard-meta">
          <span className="loc"><Icon.Pin size={13} color="#1a1a1a" /> {v.city}</span>
          <span className="status">{v.status}</span>
        </div>
      </div>
      <div className="vcard-footer">
        <span className="label">Starts</span>
        <span className="price">{fmtPrice(v.startsAt)}</span>
      </div>
    </div>
  );
}

function InventoryPage({ onOpenVehicle }) {
  const [tab, setTab] = useState("all");
  const [absolute, setAbsolute] = useState(false);
  const [view, setView] = useState("grid");

  return (
    <div>
      <TopNav />
      <SubNav tab={tab} setTab={setTab} />
      <FilterBar absolute={absolute} setAbsolute={setAbsolute} />
      <ResultsBar view={view} setView={setView} />
      <div className="grid">
        {window.VEHICLES.map(v => (
          <VehicleCard key={v.id} v={v} onClick={() => onOpenVehicle(v)} />
        ))}
      </div>
    </div>
  );
}

window.InventoryPage = InventoryPage;
window.TopNav = TopNav;
window.CarPlaceholder = CarPlaceholder;
window.vehicleKind = vehicleKind;
