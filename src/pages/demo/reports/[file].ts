import type { APIRoute } from "astro";
import { demoMode } from "../../../lib/site";
import { reportEvent, reportSales } from "../../../sample/partner";

export function getStaticPaths() {
  return demoMode ? [{ params: { file: "sales.csv" } }] : [];
}

const columns = ["OrderNumber", "OrderedOn", "Seller", "Items", "Sales", "ShareRate", "Share", "Status", "ShareStatus", "CollectedOn", "SharePaidOn"] as const;

function cell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export const GET: APIRoute = () => {
  const rows = [
    ["Event", ...columns].join(","),
    ...reportSales.map((sale) => [reportEvent.Name, ...columns.map((c) => sale[c])].map(cell).join(",")),
  ];
  return new Response(rows.join("\n") + "\n", { headers: { "Content-Type": "text/csv; charset=utf-8" } });
};
