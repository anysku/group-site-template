# Notes for coding assistants

This is a group's own website. The group's member organizations (churches, schools, clubs) run sales on anySKU, a local marketplace. anySKU already provides accounts, listings, checkout, payments, pickup codes, payouts and sales reports. This site tells the group's story and links to anySKU for each of those.

Read this before changing anything. It applies in any language or framework: if the group moves the site to WordPress, Next.js or anything else, the same rules and endpoints apply.

## Don't build these

They exist on anySKU. Link to them instead.

- Sign-up or login for buying and selling: link to `https://www.anysku.com/auth`.
- Listings, carts, checkout or payment forms.
- Seller tools: creating sales, inviting sellers, handing over orders.
- A sales dashboard for the group: group administrators use `https://www.anysku.com/g/{groupSlug}/manage`. Build custom reports only from the partner API below.
- Copies of anySKU's screens or branding. The site should look like the group, not like anySKU.

## Wording

How the group describes money with its members (gifts, donations, receipts, tax letters) is the group's own decision, under its own advice. The one rule comes from anySKU's Partner Agreement, section 4.2: never say or imply that anySKU issues receipts, takes a tax position, is a charity or collects money for a cause, and don't put anySKU's name or logo on receipts, tax letters or fundraising material. Saying sales take place "on anySKU" with a link is fine; other uses of the name or logo need anySKU's written permission.

The template's own text is neutral. Leave it to the group to add its own statements.

## Data from anySKU

API host: `https://app-api.anysku.com`. Responses are JSON with **PascalCase** property names (`StartsOn`, `HostUsername`). Errors are JSON with camelCase (`{"error":"invalid_status"}`).

### Public (no key, any website may call these, including from the browser)

| Request | Returns |
|---|---|
| `GET /api/v1/collectives/{groupSlug}` | Name, description, logo, page URL, counts of live and upcoming sales and organizations |
| `GET /api/v1/collectives/{groupSlug}/events?status=current` | Live and upcoming sales. Also `live`, `upcoming`, `ended` (most recent 50) |
| `GET /api/v1/collectives/{groupSlug}/stats` | Counts; money totals only if the group switched public totals on (`TotalsShown`) |
| `GET /api/v1/collectives/{groupSlug}/events/{id}/qr?target=event\|flyer&format=svg\|png` | A QR code for a sale's page or flyer |
| `GET /api/v1/sellers/{username}` | An organization's public profile: display name, bio, avatar, location, URL |

Each event has `Id`, `Name`, `HostUsername`, `City`, `State`, `StartsOn`, `EndsOn`, `Status` (`upcoming`, `live`, `ended`), `Url`, `FlyerUrl`, `QrUrl`, `BannerUrl`, `Sellers` and `ItemsForSale`. Only events the organizer listed publicly appear, and never a street address.

**Times are UTC without a zone marker** (`2026-10-31T13:00:00`). Treat them as UTC and show them in the group's time zone (`site.config.ts`, `timeZone`).

Public responses are cached by anySKU for about five minutes. The limit is 120 requests a minute per IP address. Building the site at deploy time, as this template does, stays far below that.

### Partner API (needs a key, server side only)

For the group's own reports: every sale's orders, each seller's totals and the organizations' share, including unlisted sales.

- Base: `https://app-api.anysku.com/api/partner/v1/`. Header: `Authorization: Bearer ask_live_...`.
- Keys are created by a group administrator on the group's manage page, after accepting the Partner Agreement there.
- **Never put a key in browser code, in this repository or in a public build.** Store it as a secret in the host and call the API from a server function.
- Endpoints, permissions and paging: https://www.anysku.com/developers/groups and the OpenAPI reference at https://app-api.anysku.com/scalar/v1.

### Signing members in ("Sign in with anySKU")

For a members' area where people see their own activity at the group's sales next to anything the group adds itself. The site never stores anySKU passwords.

- Standard OAuth 2 authorization code flow with PKCE (S256), confidential client. Authorize at `https://www.anysku.com/oauth/authorize`, exchange the code at `https://www.anysku.com/oauth/token` from the server. Discovery: `https://www.anysku.com/.well-known/openid-configuration`.
- Scope `reports:read offline_access`. Access tokens last one hour, refresh tokens 30 days and renew on use. A refresh that fails with `invalid_grant` means the person disconnected: delete what you hold for them.
- Optional `external_ref` on the authorize request (up to 100 characters): the group's own ID for the person. It comes back with their data and on the group's seller reports.
- With the token: `GET /api/partner/v1/member` (username, external ref, connected on) and `GET /api/partner/v1/member/sales` (their sales at the group's events).
- The group registers its app on the group's manage page (Apps). Until anySKU approves it, only the group's own administrators and member organizations can connect, which is enough to build and test.

A members' area needs a server: an Astro server endpoint with an adapter for the host, or a separate function. Keep the client secret and tokens on the server, in an encrypted, http-only session cookie or a database.

## This project

- Astro 7, static output. `npm run dev` to work locally, `npm run build` to build into `dist/`.
- `site.config.ts`: the group's settings. `GROUP_SLUG` and `ANYSKU_API_URL` environment variables override them for local testing.
- `SAMPLE_DATA=1` builds with the sample responses in `src/sample/data.ts` (same shapes as the API) and shows a banner. The public demo uses it; `.github/workflows/demo.yml` only runs in `anysku/group-site-template`.
- `src/lib/anysku.ts`: the API calls and response types. Add new endpoints here.
- `src/pages/`: one file per page. Markdown pages use `layouts/Page.astro`.
- `src/content/organizations/{username}.md`: optional extra text and photo for an organization.
- `src/styles/global.css`: colours and layout. Change the variables at the top for the group's colours.
- If anySKU can't be reached the build fails, and the host keeps serving the last good version. Don't swallow those errors.
- Keep pages readable on a phone, keep text plain, and check new pages work with the sales list empty.
