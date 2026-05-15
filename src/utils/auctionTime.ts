const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function normalizeAuctionDates(rawDates: string[], now: Date): Map<string, Date> {
  const parsed = rawDates.map((date) => new Date(date).getTime()).filter(Number.isFinite);
  const min = Math.min(...parsed);
  const maxWindow = 7 * DAY;
  const anchor = startOfNextHour(now).getTime() + HOUR;

  return rawDates.reduce((map, rawDate) => {
    const sourceTime = new Date(rawDate).getTime();
    const offset = Number.isFinite(sourceTime) ? Math.abs(sourceTime - min) % maxWindow : 0;
    map.set(rawDate, new Date(anchor + offset));
    return map;
  }, new Map<string, Date>());
}

export function formatAuctionDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCountdown(target: Date, now: Date): string {
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(remaining / HOUR);
  const minutes = Math.floor((remaining % HOUR) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function formatTimeLeft(target: Date, now: Date): string {
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);

  if (days > 1) {
    return `${days} days`;
  }

  if (days === 1) {
    return "1 day";
  }

  if (hours > 0) {
    return `${hours} hours`;
  }

  return "Closing soon";
}

function startOfNextHour(date: Date): Date {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}
