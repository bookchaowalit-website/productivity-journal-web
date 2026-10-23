# Journal Field Notes

A read-only field-notes site over five authored sample journal entries (MDX files in `content/journal`): a home page
with the latest note and a mood register, an archive with a mood filter, and one page per entry rendered from
markdown.

Live: https://journal.bookchaowalit.com (deployed by Vercel CLI; it lags `main`, see `PRODUCT.md`).

## What it does not do

- No editor, prompts, accounts, calendar or mood input. Entries change only by editing the files. Nothing is saved.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: entry parsing and filters, markdown renderer, pages, MCP route, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (lint, typecheck, tests with a line-coverage gate,
build) and the shared security scan on every push and PR to `main`.

## Code map

- `content/journal/*.mdx`: the five entries (front matter: title, date, mood, tags).
- `lib/journal.ts`: entry parsing (dates kept as YYYY-MM-DD), slug check, filters, excerpt, date formatting.
- `lib/markdown.tsx`: small markdown-to-React renderer (headings, paragraphs, lists, bold, italic; no raw HTML).
- `lib/mdx.ts`: reads the files.
- `app/page.tsx`, `app/journal/page.tsx`, `app/journal/[slug]/page.tsx`: home, archive (with `?mood=`), entry pages.
- `app/api/mcp/route.ts`: read-only JSON-RPC endpoint over the same entries.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
