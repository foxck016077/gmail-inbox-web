# gmail-inbox-web

Web wrapper for [`foxck/gmail-inbox-intel`](https://github.com/foxck016077/apify-gmail-inbox-intel) — read-only Friday triage of stalled Gmail threads ranked by silent days. v0.2 of the Gmail Inbox Intelligence project (Apify Actor was v0.1, developer-facing).

This preview ships with sample data. Google one-click sign-in (gmail.readonly scope) lands in the next milestone.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffoxck016077%2Fgmail-inbox-web&project-name=gmail-inbox-web&repository-name=gmail-inbox-web)

No env vars required for the preview build. OAuth env vars get added on the next milestone (see [issue #1](https://github.com/foxck016077/gmail-inbox-web/issues/1) once it exists).

## Stack

- Next.js 16.2.6 App Router (Turbopack)
- React 19.2
- Tailwind v4
- TypeScript strict

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

Routes:
- `/` — landing + stalled threads table (sample data)
- `/api/threads.csv` — CSV download endpoint

## Roadmap

- [x] Sample data UI, sort by days silent
- [x] CSV download (UTF-8 BOM for Excel)
- [ ] Google OAuth (gmail.readonly only, refresh_token in-memory)
- [ ] Server action `getStalledThreads()` calling Gmail API
- [ ] Plausible analytics (privacy-first, no cookie banner)
- [ ] Custom domain

See [SPEC at upstream repo](https://github.com/foxck016077/apify-gmail-inbox-intel#roadmap) for full design.

Have an opinion before this ships? [Discussion #16](https://github.com/foxck016077/apify-gmail-inbox-intel/discussions/16) is open.

## License

MIT
