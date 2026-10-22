# Group site template

A starter website for a group whose member organizations run sales on [anySKU](https://www.anysku.com): a church network, a school district, a club association. It gives your group its own site for your story, a page for each organization, and a calendar of every sale, all kept up to date from anySKU.

anySKU handles the selling: accounts, listings, payments, pickup and sales reports. This site doesn't repeat any of that. It tells people who you are and sends them to the right place on anySKU.

See it running with sample sales: https://groups-demo.anysku.com

## What's included

| Page | What it shows | Where it comes from |
|---|---|---|
| Home | Your name, a three-step guide, an optional video, the next sales | `src/pages/index.astro`, sales from anySKU |
| Sales | Every upcoming sale by month, plus recent ones | anySKU |
| Organizations | Each organization that has held a sale with your group | anySKU, plus optional pages you write |
| About, Questions, Branding | Your mission, answers, promotion material | Markdown files in `src/pages` |
| Contact | Your email and a link to anySKU support | `site.config.ts` |

## Set it up

1. Create your copy: use the **Use this template** button on GitHub.
2. Open `site.config.ts` and set your group's name, your `groupSlug` (the end of your group's address, `anysku.com/g/your-slug`), what you call your organizations and sellers (for example "school" and "family", or "market" and "vendor"), your time zone and your contact email.
3. Rewrite the pages in `src/pages` for your group: `about.md`, `faq.md` and `branding.md` are plain text with a few symbols for headings and links. Their example text assumes a community sale where people sell their own things; change it to describe how your sales work.
4. Optionally, add a page for an organization in `src/content/organizations/`, named after its anySKU username. See `example-organization.md`.

## Put it online

The site builds to plain files, so any static host works. Cloudflare Pages and Netlify are free for a site like this:

1. Sign in to the host with GitHub and pick your copy of this repository.
2. Build command `npm run build`, output folder `dist`.
3. Add your own domain in the host's settings.

New sales appear when the site rebuilds. To rebuild every six hours, create a deploy hook in your host's build settings and save its address as a repository secret named `DEPLOY_HOOK_URL` (Settings, Secrets and variables, Actions). The `Rebuild` workflow uses it.

## Work on it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
npm install
npm run dev
```

Then open http://localhost:4321. Changes show as you save.

To try it with the sample sales used by the demo, run `SAMPLE_DATA=1 npm run dev` (in PowerShell: `$env:SAMPLE_DATA=1; npm run dev`).

## Working with an AI assistant

`AGENTS.md` explains this project to coding assistants such as Claude, ChatGPT or Codex: what the site is for, which anySKU data to use, and what not to build. Point your assistant at it before asking for changes. It applies even if you move to another website builder.

## Help

- Connecting to anySKU: [anySKU for groups](https://www.anysku.com/developers/groups)
- Problems with this template: open an issue on this repository

## License

MIT. See `LICENSE`.
