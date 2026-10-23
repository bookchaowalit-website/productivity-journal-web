# Journal Field Notes — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `journal`, evidence Live→Prototype) on 2026-10-23.

## What it is

A read-only "field notes" site over five authored sample entries, one MDX file each in `content/journal`
(front matter: title, date, mood, tags; body: markdown). Nothing is written from the browser.

## Who it is for

A portfolio visitor who wants to see a calm, editorial reading surface for dated personal notes.

## What works today

1. `/`: the newest entry with an excerpt, a mood register (count of entries per mood) and the five most recent
   entries.
2. `/journal`: every entry, newest first, with a working mood filter (`/journal?mood=happy`; an unknown mood shows
   all entries). The topic chips are labels only.
3. `/journal/<slug>`: the entry rendered from markdown (headings, paragraphs, bullet and numbered lists, bold and
   italic) by a small renderer in `lib/markdown.tsx`; text is escaped, never injected as HTML. The five entry pages
   are prerendered. An unknown or unsafe slug answers a real HTTP 404.
4. `/api/mcp` answers JSON-RPC, read-only, over the same files: `get_entries` (mood, tag, limit), `get_entry_by_slug`,
   `get_entries_by_date`, `get_moods`, `search_entries`. It echoes the request id; an unknown tool, slug or bad
   argument is -32602, an unknown method -32601, malformed JSON -32700.
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No editor, daily prompts, mood-tracking input, accounts, privacy controls, calendar view or habit tracking (claims
  removed from the portfolio card in the 2026-10 review). Entries change only by editing files in the repository.
- The five entries are sample content, not a real diary.
- No storage or sync. No product analytics beyond Vercel Analytics.

## Live URL and deploy state

- Live: https://journal.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-journal-frontend` is deployed only by CLI. The last production deploy is the CVE
  patch (2026-10-23 05:12 UTC, CLI, commit e2180ac). Its Git link names the old repository
  (`bookchaowalit/bookchaowalit-journal-frontend`), so a push to `main` does not deploy. The L2 commits stay
  undeployed until the owner reconnects Vercel Git to `bookchaowalit-website/productivity-journal-web` (owner action
  D9). Until then the live site still shows raw markdown on entry pages (list markers as text, bold marks dropped),
  answers 200 "Entry not found" for unknown slugs, has a mood filter that does nothing, and serves the template MCP
  route (id 0, `result: null` for an unknown slug).
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `productivity-journal-web`, org
  `personal-yu0`); it takes effect with the next deploy.

## Boundaries

- Read-only. The pages and `/api/mcp` read `content/journal` on the server; nothing is stored.
