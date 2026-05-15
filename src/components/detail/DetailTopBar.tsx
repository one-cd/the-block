import { Icon } from "../icons/Icon";

type DetailTopBarProps = {
  endsIn: string;
  onBack: () => void;
};

export function DetailTopBar({ endsIn, onBack }: DetailTopBarProps) {
  return (
    <div className="detail-top">
      <button className="back-btn" type="button" onClick={onBack}>
        <Icon.Chevron size={16} dir="left" /> Back to inventory
      </button>
      <div className="detail-separator" />
      <div className="ends-in">
        <span className="label">Ends in</span>
        <span className="time">{endsIn}</span>
      </div>
      <div className="detail-top-right">
        <button className="btn-outline" type="button"><Icon.Heart size={16} color="#1652F0" /> Watchlist</button>
        <button className="btn-outline" type="button"><Icon.Note size={16} /> Notes</button>
      </div>
    </div>
  );
}
