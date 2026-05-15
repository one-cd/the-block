import { OpenLaneLogo } from "./OpenLaneLogo";

export function TopNav() {
  return (
    <header className="topnav">
      <OpenLaneLogo />
      <div className="topnav-tabs" aria-label="Primary navigation">
        <button className="topnav-tab is-active" type="button">Auction</button>
      </div>
    </header>
  );
}
