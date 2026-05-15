export function formatCurrency(value: number | null | undefined): string {
  if (value == null) {
    return "--";
  }

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatOdometerKm(value: number): string {
  return `${formatNumber(value)} km`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

export function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => (/^[A-Z0-9]+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join(" ");
}

export function parseCurrencyInput(value: string): number | null {
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

export function formatCurrencyInput(value: number): string {
  return formatNumber(value);
}
