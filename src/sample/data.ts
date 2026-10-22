import type { Group, GroupEvent, GroupStats, Seller } from "../lib/anysku";

// Sample responses for the demo site, in the same shape anySKU returns. Dates are relative to the build.

const day = 24 * 60 * 60 * 1000;

function utc(daysFromNow: number, hourUtc: number): string {
  const d = new Date(Date.now() + daysFromNow * day);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d.toISOString().slice(0, 19);
}

function event(id: string, name: string, host: string, city: string, daysFromNow: number,
  status: GroupEvent["Status"], sellers: number, items: number): GroupEvent {
  return {
    Id: id,
    Name: name,
    HostUsername: host,
    City: city,
    State: "GA",
    StartsOn: utc(daysFromNow, 13),
    EndsOn: utc(daysFromNow, 19),
    Status: status,
    Url: "https://www.anysku.com",
    FlyerUrl: "https://www.anysku.com",
    QrUrl: "https://www.anysku.com",
    BannerUrl: null,
    Sellers: sellers,
    ItemsForSale: items,
  };
}

const current = [
  event("d1", "Fall Rummage Sale", "hopechurchdemo", "Marietta", 9, "upcoming", 14, 86),
  event("d2", "Holiday Market", "gracefellowshipdemo", "Decatur", 23, "upcoming", 9, 41),
  event("d3", "Spring Clean-Out Sale", "hopechurchdemo", "Marietta", 58, "upcoming", 3, 12),
];

const ended = [
  event("d4", "Back to School Swap", "gracefellowshipdemo", "Decatur", -40, "ended", 11, 0),
  event("d5", "Summer Yard Sale", "hopechurchdemo", "Marietta", -75, "ended", 17, 0),
];

const group: Group = {
  Name: "Example Church Network",
  Slug: "example",
  Description: "An example network of churches running sales on anySKU.",
  Website: null,
  LogoUrl: null,
  PageUrl: "https://www.anysku.com",
  LiveEvents: 0,
  UpcomingEvents: current.length,
  Organizations: 2,
};

const stats: GroupStats = {
  LiveEvents: 0,
  UpcomingEvents: current.length,
  Organizations: 2,
  TotalsShown: true,
  EventsCounted: ended.length,
  Sellers: 24,
  Sales: 3860,
  OrganizationsShare: 386,
};

const sellers: Record<string, Seller> = {
  hopechurchdemo: {
    Username: "hopechurchdemo",
    DisplayName: "Hope Church (demo)",
    Bio: "A sample church. Members sell what they no longer need, and the church receives a share of each sale.",
    AvatarUrl: null,
    BannerUrl: null,
    Location: "Marietta, GA",
    Url: "https://www.anysku.com",
  },
  gracefellowshipdemo: {
    Username: "gracefellowshipdemo",
    DisplayName: "Grace Fellowship (demo)",
    Bio: "A sample church that holds a market each season.",
    AvatarUrl: null,
    BannerUrl: null,
    Location: "Decatur, GA",
    Url: "https://www.anysku.com",
  },
};

export function sampleResponse(path: string): unknown {
  const [route, query = ""] = path.split("?");
  const status = new URLSearchParams(query).get("status");
  if (/^\/api\/v1\/collectives\/[^/]+$/.test(route)) return group;
  if (route.endsWith("/stats")) return stats;
  if (route.endsWith("/events")) {
    if (status === "ended") return ended;
    if (status === "live") return [];
    return current;
  }
  const seller = route.match(/^\/api\/v1\/sellers\/([^/]+)$/);
  if (seller) return sellers[decodeURIComponent(seller[1])] ?? null;
  return null;
}
