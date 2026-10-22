import { getCollection, type CollectionEntry } from "astro:content";
import { getOrganizations, getSeller, type GroupEvent, type Seller } from "./anysku";

export interface Organization {
  username: string;
  name: string;
  seller: Seller | null;
  page: CollectionEntry<"organizations"> | null;
  events: GroupEvent[];
}

// Organizations come from the group's events on anySKU, plus any with a page here that haven't held one yet.
export async function loadOrganizations(): Promise<Organization[]> {
  const [hosts, pages] = await Promise.all([getOrganizations(), getCollection("organizations")]);
  const pageById = new Map(pages.map((p) => [p.id.toLowerCase(), p]));
  const usernames = new Set([...hosts.map((h) => h.username.toLowerCase()), ...pageById.keys()]);

  const list = await Promise.all([...usernames].map(async (username) => {
    const page = pageById.get(username) ?? null;
    const seller = await getSeller(username);
    const events = hosts.find((h) => h.username.toLowerCase() === username)?.events ?? [];
    return {
      username,
      name: page?.data.name ?? seller?.DisplayName ?? `@${username}`,
      seller,
      page,
      events,
    };
  }));

  return list
    .filter((o) => !o.page?.data.hidden)
    .sort((a, b) => a.name.localeCompare(b.name));
}
