import { Icon } from "../icons/Icon";
import { OpenLaneLogo } from "./OpenLaneLogo";

export function TopNav() {
  return (
    <header className="topnav">
      <OpenLaneLogo />
      <div className="topnav-tabs" aria-label="Primary navigation">
        <button className="topnav-tab" type="button">Marketplace</button>
        <button className="topnav-tab is-active" type="button">Auction</button>
        <button className="topnav-tab" type="button">
          Transport
          <Icon.Ext size={12} color="currentColor" />
        </button>
      </div>
      <div className="topnav-right">
        <div className="dealer-pill">
          <div className="dealer-logo">
            <div>
              <div className="bow" />
              <div className="dealer-logo-brand">PELTIER</div>
              <div className="dealer-logo-sub">CHEVROLET</div>
            </div>
          </div>
          <div className="dealer-name">
            Casey's Cars
            <Icon.Chevron size={14} color="#6b7280" />
          </div>
          <div className="dealer-warn">!</div>
        </div>
        <button className="bell" type="button" aria-label="Notifications">
          <Icon.Bell size={22} color="#1f2937" />
          <span className="bell-badge">8</span>
        </button>
      </div>
    </header>
  );
}
