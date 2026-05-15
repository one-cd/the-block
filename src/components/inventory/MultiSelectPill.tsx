import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "../icons/Icon";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectPillProps = {
  label: string;
  options: readonly MultiSelectOption[];
  selected: readonly string[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onChange: (next: string[]) => void;
};

export function MultiSelectPill({
  label,
  options,
  selected,
  searchable = false,
  searchPlaceholder,
  onChange,
}: MultiSelectPillProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) {
      return options;
    }
    const needle = query.trim().toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(needle));
  }, [options, query, searchable]);

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

  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
    if (!open) {
      setQuery("");
    }
  }, [open, searchable]);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((entry) => entry !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => onChange([]);

  const count = selected.length;
  const isActive = count > 0 || open;
  const displayLabel = count > 0 ? `${label} · ${count}` : label;

  return (
    <div className="ms-pill-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`pill-select ms-pill-trigger${count > 0 ? " is-active" : ""}${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ms-pill-label">{displayLabel}</span>
        <Icon.Chevron size={14} color={isActive ? "currentColor" : "#6b7280"} dir={open ? "up" : "down"} />
      </button>

      {open ? (
        <div className="ms-pop" role="dialog" aria-label={`${label} filter`}>
          {searchable ? (
            <div className="ms-pop-search">
              <Icon.Search size={14} color="#6b7280" />
              <input
                ref={searchRef}
                value={query}
                placeholder={searchPlaceholder ?? `Search ${label.toLowerCase()}`}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={`Filter ${label.toLowerCase()} list`}
              />
            </div>
          ) : null}

          <div className="ms-pop-list" role="listbox" id={listboxId} aria-multiselectable="true">
            {filteredOptions.length === 0 ? (
              <div className="ms-pop-empty">No matches</div>
            ) : (
              filteredOptions.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`ms-pop-row${checked ? " is-checked" : ""}`}
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggleValue(option.value)}
                  >
                    <span className={`ms-pop-check${checked ? " is-checked" : ""}`} aria-hidden="true">
                      {checked ? <Icon.Check size={12} color="white" /> : null}
                    </span>
                    <span className="ms-pop-row-label">{option.label}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="ms-pop-foot">
            <button
              type="button"
              className="ms-pop-clear"
              onClick={clearAll}
              disabled={count === 0}
            >
              Clear
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
