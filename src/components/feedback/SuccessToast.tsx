import { Icon } from "../icons/Icon";

type SuccessToastProps = {
  amount: string;
};

export function SuccessToast({ amount }: SuccessToastProps) {
  return (
    <div className="success-toast">
      <span className="ok-icon">
        <Icon.Check size={14} color="white" />
      </span>
      Your bid for {amount} has been placed.
    </div>
  );
}
