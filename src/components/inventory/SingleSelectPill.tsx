import { useEffect, useId, useRef } from "react";
import { Icon } from "../icons/Icon";

export type SingleSelectOption<T extends string> = {
  value: T;
  label: string;
};

type SingleSelectPillProps<T extends string> = {
  id: string;
  label: string;
  options: readonly SingleSelectOption<T>[];
  value: T;
  defaultValue: T;
  openId: string | null;
  onOpenChange: (next: string | null) => void;
  onChange: (next: T) => void;
};

export function SingleSelectPill<T extends string>({
  id,
  label,
  options,
  value,
  defaultValue,
  openId,
  onOpenChange,
  onChange,
}: SingleSelectPillProps<T>) {
  const open = openId === id;
  const wrapRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        onOpenChange(null);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(null);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onOpenChange]);

  const isActive = value !== defaultValue;
  const currentLabel = options.find((option) => option.value === value)?.label ?? "";
  const displayLabel = isActive ? `${label} · ${currentLabel}` : label;

  const handleSelect = (next: T) => {
    onChange(next);
    onOpenChange(null);
  };

  return (
    <div className="ms-pill-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`pill-select ms-pill-trigger${isActive ? " is-active" : ""}${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => onOpenChange(open ? null : id)}
      >
        <span className="ms-pill-label">{displayLabel}</span>
        <Icon.Chevron size={14} color={isActive || open ? "currentColor" : "#6b7280"} dir={open ? "up" : "down"} />
      </button>

      {open ? (
        <div className="ms-pop" role="dialog" aria-label={`${label} filter`}>
          <div className="ms-pop-list" role="listbox" id={listboxId}>
            {options.map((option) => {
              const checked = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`ms-pop-row${checked ? " is-checked" : ""}`}
                  role="option"
                  aria-selected={checked}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className={`ms-pop-check${checked ? " is-checked" : ""}`} aria-hidden="true">
                    {checked ? <Icon.Check size={12} color="white" /> : null}
                  </span>
                  <span className="ms-pop-row-label">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="ms-pop-foot">
            <button
              type="button"
              className="ms-pop-clear"
              onClick={() => handleSelect(defaultValue)}
              disabled={!isActive}
            >
              Reset
            </button>
            <button type="button" className="ms-pop-done" onClick={() => onOpenChange(null)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
