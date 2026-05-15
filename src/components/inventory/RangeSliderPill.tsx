import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "../icons/Icon";
import { isRangeNarrowed, type Range } from "./inventoryControls";

type RangeSliderPillProps = {
  label: string;
  bounds: Range;
  step?: number;
  value: Range;
  formatValue: (value: number) => string;
  formatSummary: (value: Range, bounds: Range) => string;
  onChange: (next: Range) => void;
};

export function RangeSliderPill({
  label,
  bounds,
  step = 1,
  value,
  formatValue,
  formatSummary,
  onChange,
}: RangeSliderPillProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const narrowed = isRangeNarrowed(value, bounds);
  const summary = narrowed ? formatSummary(value, bounds) : label;

  const setMin = (raw: number) => {
    const clampedToMax = Math.min(raw, value.max - step);
    const clamped = Math.max(bounds.min, clampedToMax);
    if (clamped !== value.min) {
      onChange({ min: clamped, max: value.max });
    }
  };
  const setMax = (raw: number) => {
    const clampedToMin = Math.max(raw, value.min + step);
    const clamped = Math.min(bounds.max, clampedToMin);
    if (clamped !== value.max) {
      onChange({ min: value.min, max: clamped });
    }
  };

  const reset = () => onChange({ ...bounds });

  return (
    <div className="ms-pill-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`pill-select ms-pill-trigger${narrowed ? " is-active" : ""}${open ? " is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ms-pill-label">{summary}</span>
        <Icon.Chevron size={14} color={narrowed || open ? "currentColor" : "#6b7280"} dir={open ? "up" : "down"} />
      </button>

      {open ? (
        <div className="ms-pop range-pop" role="dialog" id={dialogId} aria-label={`${label} range`}>
          <div className="range-pop-head">
            <span className="range-pop-title">{label}</span>
          </div>

          <div className="range-pop-inputs">
            <label className="range-num">
              <span>Min</span>
              <input
                type="number"
                inputMode="decimal"
                min={bounds.min}
                max={value.max - step}
                step={step}
                value={value.min}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isNaN(next)) {
                    setMin(next);
                  }
                }}
              />
            </label>
            <span className="range-num-sep">–</span>
            <label className="range-num">
              <span>Max</span>
              <input
                type="number"
                inputMode="decimal"
                min={value.min + step}
                max={bounds.max}
                step={step}
                value={value.max}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isNaN(next)) {
                    setMax(next);
                  }
                }}
              />
            </label>
          </div>

          <DualSlider bounds={bounds} step={step} value={value} onMinChange={setMin} onMaxChange={setMax} ariaLabel={label} />

          <div className="range-pop-readout">
            <span>{formatValue(value.min)}</span>
            <span>{formatValue(value.max)}</span>
          </div>

          <div className="ms-pop-foot">
            <button type="button" className="ms-pop-clear" onClick={reset} disabled={!narrowed}>
              Reset
            </button>
            <button type="button" className="ms-pop-done" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type DualSliderProps = {
  bounds: Range;
  step: number;
  value: Range;
  onMinChange: (next: number) => void;
  onMaxChange: (next: number) => void;
  ariaLabel: string;
};

function DualSlider({ bounds, step, value, onMinChange, onMaxChange, ariaLabel }: DualSliderProps) {
  const span = bounds.max - bounds.min || 1;
  const minPct = ((value.min - bounds.min) / span) * 100;
  const maxPct = ((value.max - bounds.min) / span) * 100;
  const minThumbHigh = minPct > 90;

  return (
    <div className="dual-slider">
      <div className="dual-slider-track" />
      <div
        className="dual-slider-fill"
        style={{ left: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
      />
      <input
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={step}
        value={value.min}
        onChange={(event) => onMinChange(Number(event.target.value))}
        aria-label={`${ariaLabel} minimum`}
        style={{ zIndex: minThumbHigh ? 4 : 3 }}
      />
      <input
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={step}
        value={value.max}
        onChange={(event) => onMaxChange(Number(event.target.value))}
        aria-label={`${ariaLabel} maximum`}
      />
    </div>
  );
}
