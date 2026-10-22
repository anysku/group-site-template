import { site } from "./site";
import type { GroupEvent } from "./anysku";

// anySKU sends event times in UTC without a zone marker.
function parseUtc(value: string): Date {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
}

const dayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone, weekday: "short", month: "short", day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone, hour: "numeric", minute: "2-digit",
});
const monthFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone, month: "long", year: "numeric",
});

export function eventWhen(event: GroupEvent): string {
  if (!event.StartsOn) return "Date to be announced";
  const start = parseUtc(event.StartsOn);
  const end = event.EndsOn ? parseUtc(event.EndsOn) : null;
  const startDay = dayFormat.format(start);
  if (!end) return `${startDay}, ${timeFormat.format(start)}`;
  const endDay = dayFormat.format(end);
  return startDay === endDay
    ? `${startDay}, ${timeFormat.format(start)} to ${timeFormat.format(end)}`
    : `${startDay}, ${timeFormat.format(start)} to ${endDay}, ${timeFormat.format(end)}`;
}

export function eventMonth(event: GroupEvent): string {
  return event.StartsOn ? monthFormat.format(parseUtc(event.StartsOn)) : "Date to be announced";
}

export function eventPlace(event: GroupEvent): string {
  return [event.City, event.State].filter(Boolean).join(", ");
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone, month: "short", day: "numeric", year: "numeric",
});

export function shortDate(value: string | null): string {
  return value ? dateFormat.format(parseUtc(value)) : "";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function money(amount: number, cents = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0,
  }).format(amount);
}
