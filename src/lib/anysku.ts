import { anysku, sampleData, site } from "./site";
import { sampleResponse } from "../sample/data";

export interface Group {
  Name: string;
  Slug: string;
  Description: string | null;
  Website: string | null;
  LogoUrl: string | null;
  PageUrl: string;
  LiveEvents: number;
  UpcomingEvents: number;
  Organizations: number;
}

export interface GroupEvent {
  Id: string;
  Name: string;
  HostUsername: string;
  City: string | null;
  State: string | null;
  StartsOn: string | null;
  EndsOn: string | null;
  Status: "upcoming" | "live" | "ended";
  Url: string;
  FlyerUrl: string;
  QrUrl: string;
  BannerUrl: string | null;
  Sellers: number;
  ItemsForSale: number;
}

export interface GroupStats {
  LiveEvents: number;
  UpcomingEvents: number;
  Organizations: number;
  TotalsShown: boolean;
  EventsCounted: number | null;
  Sellers: number | null;
  Sales: number | null;
  OrganizationsShare: number | null;
}

export interface Seller {
  Username: string;
  DisplayName: string | null;
  Bio: string | null;
  AvatarUrl: string | null;
  BannerUrl: string | null;
  Location: string | null;
  Url: string | null;
}

const apiUrl = (import.meta.env.ANYSKU_API_URL ?? anysku.apiUrl).replace(/\/$/, "");
export const groupSlug: string = import.meta.env.GROUP_SLUG ?? site.groupSlug;

const cache = new Map<string, Promise<unknown>>();

async function get<T>(path: string, { allowMissing = false } = {}): Promise<T | null> {
  if (sampleData) return sampleResponse(path) as T | null;
  const url = `${apiUrl}${path}`;
  if (!cache.has(url)) {
    cache.set(url, fetch(url, { headers: { Accept: "application/json" } }).then(async (res) => {
      if (res.status === 404 && allowMissing) return null;
      if (!res.ok) throw new Error(`anySKU returned ${res.status} for ${url}`);
      return res.json();
    }));
  }
  return cache.get(url) as Promise<T | null>;
}

const groupPath = `/api/v1/collectives/${encodeURIComponent(groupSlug)}`;

async function getForGroup<T>(path: string): Promise<T> {
  const result = await get<T>(`${groupPath}${path}`, { allowMissing: true });
  if (result === null) {
    throw new Error(`No group "${groupSlug}" on anySKU. Set groupSlug in site.config.ts.`);
  }
  return result;
}

export function getGroup(): Promise<Group> {
  return getForGroup<Group>("");
}

export function getEvents(status: "current" | "live" | "upcoming" | "ended"): Promise<GroupEvent[]> {
  return getForGroup<GroupEvent[]>(`/events?status=${status}`);
}

export function getStats(): Promise<GroupStats> {
  return getForGroup<GroupStats>("/stats");
}

export async function getSeller(username: string): Promise<Seller | null> {
  return get<Seller>(`/api/v1/sellers/${encodeURIComponent(username)}`, { allowMissing: true });
}

// The hosts of the group's events, past and present, most recent first.
export async function getOrganizations(): Promise<{ username: string; events: GroupEvent[] }[]> {
  const [current, ended] = await Promise.all([getEvents("current"), getEvents("ended")]);
  const byHost = new Map<string, GroupEvent[]>();
  for (const event of [...current, ...ended]) {
    const list = byHost.get(event.HostUsername) ?? [];
    list.push(event);
    byHost.set(event.HostUsername, list);
  }
  return [...byHost].map(([username, events]) => ({ username, events }));
}
