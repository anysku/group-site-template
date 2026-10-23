// Sample partner API responses for the demo's members' area, reports and live updates pages.
// Shapes match https://app-api.anysku.com/api/partner/v1 (see AGENTS.md).

const day = 24 * 60 * 60 * 1000;

function utc(daysFromNow: number, hourUtc = 15): string {
  const d = new Date(Date.now() + daysFromNow * day);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d.toISOString().slice(0, 19);
}

export interface PartnerSale {
  OrderNumber: string;
  OrderedOn: string;
  Seller: string;
  Items: number;
  Sales: number;
  ShareRate: number | null;
  Share: number;
  Status: "to_collect" | "awaiting_buyer" | "collected" | "refunded" | "cancelled";
  ShareStatus: "none" | "pending" | "earned" | "paid" | "void";
  CollectedOn: string | null;
  CollectedAt: "table" | "seller" | null;
  SharePaidOn: string | null;
  UpdatedOn: string | null;
}

export interface PartnerMemberSale extends PartnerSale {
  EventId: string;
  EventName: string;
  EventStartsOn: string | null;
}

export interface PartnerSeller {
  Username: string;
  ExternalRef: string | null;
  Spot: string | null;
  IsHost: boolean;
  IsActive: boolean;
  ItemsAtEvent: number;
  Orders: number;
  ToCollect: number;
  Sales: number;
  Share: number;
}

export interface PartnerSummary {
  SellersActive: number;
  ItemsAtEvent: number;
  Orders: number;
  Collected: number;
  ToCollect: number;
  Cancelled: number;
  Sales: number;
  CollectedSales: number;
  SharePending: number;
  ShareEarned: number;
  SharePaid: number;
}

function sale(n: string, seller: string, items: number, amount: number, daysAgo: number,
  status: PartnerSale["Status"], shareStatus: PartnerSale["ShareStatus"]): PartnerSale {
  const collected = status === "collected";
  return {
    OrderNumber: n,
    OrderedOn: utc(-daysAgo - 6),
    Seller: seller,
    Items: items,
    Sales: amount,
    ShareRate: 0.5,
    Share: Math.round(amount * 50) / 100,
    Status: status,
    ShareStatus: shareStatus,
    CollectedOn: collected ? utc(-daysAgo) : null,
    CollectedAt: collected ? "table" : null,
    SharePaidOn: shareStatus === "paid" ? utc(-daysAgo + 3) : null,
    UpdatedOn: utc(-daysAgo + 3),
  };
}

export const memberLink = {
  Username: "samdemo",
  ExternalRef: "HC-0142",
  ConnectedOn: utc(-60),
};

export const reportEvent = {
  Id: "d5",
  Name: "Summer Yard Sale",
  HostUsername: "hopechurchdemo",
  StartsOn: utc(-75, 13),
  EndsOn: utc(-75, 19),
};

export const reportSales: PartnerSale[] = [
  sale("2608-A1K3P9", "samdemo", 2, 45, 75, "collected", "paid"),
  sale("2608-B7Q2M4", "jordandemo", 1, 120, 75, "collected", "paid"),
  sale("2608-C4H8T1", "samdemo", 1, 18, 75, "collected", "paid"),
  sale("2608-D9W5R6", "rileydemo", 3, 64, 75, "collected", "paid"),
  sale("2608-E2N6V8", "jordandemo", 1, 35, 75, "refunded", "void"),
  sale("2608-F5J1L3", "caseydemo", 2, 88, 75, "collected", "paid"),
  sale("2608-G8X4B2", "rileydemo", 1, 22, 75, "cancelled", "void"),
];

export const reportSellers: PartnerSeller[] = [
  { Username: "hopechurchdemo", ExternalRef: null, Spot: "Main table", IsHost: true, IsActive: true, ItemsAtEvent: 6, Orders: 0, ToCollect: 0, Sales: 0, Share: 0 },
  { Username: "samdemo", ExternalRef: "HC-0142", Spot: "Table 3", IsHost: false, IsActive: true, ItemsAtEvent: 9, Orders: 2, ToCollect: 0, Sales: 63, Share: 31.5 },
  { Username: "jordandemo", ExternalRef: "HC-0087", Spot: "Table 5", IsHost: false, IsActive: true, ItemsAtEvent: 4, Orders: 2, ToCollect: 0, Sales: 120, Share: 60 },
  { Username: "rileydemo", ExternalRef: "HC-0213", Spot: "Table 1", IsHost: false, IsActive: true, ItemsAtEvent: 12, Orders: 2, ToCollect: 0, Sales: 64, Share: 32 },
  { Username: "caseydemo", ExternalRef: null, Spot: "Table 2", IsHost: false, IsActive: true, ItemsAtEvent: 7, Orders: 1, ToCollect: 0, Sales: 88, Share: 44 },
];

export const reportSummary: PartnerSummary = {
  SellersActive: 5,
  ItemsAtEvent: 38,
  Orders: 7,
  Collected: 5,
  ToCollect: 0,
  Cancelled: 1,
  Sales: 335,
  CollectedSales: 335,
  SharePending: 0,
  ShareEarned: 0,
  SharePaid: 167.5,
};

export const memberSales: PartnerMemberSale[] = [
  { ...sale("2608-A1K3P9", "samdemo", 2, 45, 75, "collected", "paid"), EventId: "d5", EventName: "Summer Yard Sale", EventStartsOn: utc(-75, 13) },
  { ...sale("2608-C4H8T1", "samdemo", 1, 18, 75, "collected", "paid"), EventId: "d5", EventName: "Summer Yard Sale", EventStartsOn: utc(-75, 13) },
  { ...sale("2609-K3D7S5", "samdemo", 1, 30, 40, "collected", "paid"), EventId: "d4", EventName: "Back to School Swap", EventStartsOn: utc(-40, 13) },
];

export interface PartnerTransfer {
  TransferId: string;
  EventId: string;
  EventName: string;
  EventStartsOn: string | null;
  Member: string;
  ExternalRef: string | null;
  Organization: string;
  Item: string;
  Status: "accepted" | "returned";
  HeldBy: "member" | "organization";
  RequestedOn: string;
  AcceptedOn: string | null;
  ReturnedOn: string | null;
  QuantitySold: number;
  AmountSold: number;
  Sales: { OrderNumber: string; OrderedOn: string; Quantity: number; Amount: number; Status: PartnerSale["Status"]; CollectedOn: string | null }[];
}

function transfer(id: string, member: string, ref: string | null, item: string, daysAgo: number,
  sold: { order: string; amount: number } | null): PartnerTransfer {
  return {
    TransferId: id,
    EventId: "d5",
    EventName: "Summer Yard Sale",
    EventStartsOn: utc(-75, 13),
    Member: member,
    ExternalRef: ref,
    Organization: "hopechurchdemo",
    Item: item,
    Status: "accepted",
    HeldBy: "member",
    RequestedOn: utc(-daysAgo - 2),
    AcceptedOn: utc(-daysAgo),
    ReturnedOn: null,
    QuantitySold: sold ? 1 : 0,
    AmountSold: sold?.amount ?? 0,
    Sales: sold
      ? [{ OrderNumber: sold.order, OrderedOn: utc(-daysAgo + 4), Quantity: 1, Amount: sold.amount, Status: "collected", CollectedOn: utc(-75) }]
      : [],
  };
}

export const reportTransfers: PartnerTransfer[] = [
  transfer("t1", "samdemo", "HC-0142", "Oak bookshelf", 85, { order: "2608-J2T9W4", amount: 60 }),
  transfer("t2", "samdemo", "HC-0142", "Box of children's books", 84, null),
  transfer("t3", "rileydemo", "HC-0213", "Sewing machine", 82, { order: "2608-K8M3Q7", amount: 75 }),
];

export const memberTransfers = reportTransfers
  .filter((t) => t.Member === "samdemo")
  .map((t) => ({ ...t, ExternalRef: null }));

// GET /api/partner/v1/events/{id}/links with invites:read. JoinUrl and SellerPosterUrl appear only for a key
// with that permission, and only while the sale is open to sellers. These are the live demo sale's real
// invite: a sample host's sale can't be joined, so it is safe to show.
export const sampleLinks = {
  EventId: "d1",
  EventUrl: "https://www.anysku.com/@hopechurchdemo/event/fall-rummage-sale-demo",
  FlyerUrl: "https://www.anysku.com/@hopechurchdemo/event/fall-rummage-sale-demo/print",
  AcceptingSellers: true,
  JoinUrl: "https://www.anysku.com/@hopechurchdemo/event/fall-rummage-sale-demo/sell-at/9WSABADC",
  SellerPosterUrl: "https://www.anysku.com/@hopechurchdemo/event/fall-rummage-sale-demo/sell-at/9WSABADC/print",
  QrUrl: "https://app-api.anysku.com/api/partner/v1/events/d1/qr?target=join",
};

// Members of the church's own records that the reports match against by ExternalRef.
export const churchRecords: Record<string, string> = {
  "HC-0142": "Sam Demo",
  "HC-0087": "Jordan Demo",
  "HC-0213": "Riley Demo",
};

export const webhookTypes = [
  { type: "seller.joined", when: "Someone joins one of your sales", idea: "Add them to the volunteer rota, or send a welcome with drop-off times." },
  { type: "order.placed", when: "A buyer orders ahead", idea: "Update a live count on your home page." },
  { type: "order.collected", when: "A buyer collects their order", idea: "Mark it done in your own records." },
  { type: "share.paid", when: "The organization's share of an order is paid out", idea: "Record the payment in your accounts." },
  { type: "event.started / event.ended", when: "A sale opens or finishes", idea: "Send the end-of-day summary to your leaders." },
  { type: "order.cancelled / order.refunded", when: "An order is canceled or refunded", idea: "Take it out of your totals." },
];

export const sampleNotice = {
  id: "8f3c2a10-4b6e-4d1a-9e2f-6a7b8c9d0e1f",
  type: "order.collected",
  createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString().slice(0, 19) + "Z",
  collective: "example",
  data: { eventId: "d1", orderNumber: "2610-H6P2C9", seller: "samdemo" },
};
