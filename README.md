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
cp .env.example .env.local
# fill in AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET (see OAuth setup below)
npm run dev
# → http://localhost:3000
```

Without env vars the page renders with sample data (the "Continue with Google" button will return a 400 until OAuth is wired).

Routes:
- `/` — landing + stalled threads table (live when signed in, sample otherwise)
- `/api/auth/[...nextauth]` — NextAuth v5 handlers (Google provider)
- `/api/threads.csv` — CSV download endpoint (uses the same source as `/`)

## OAuth setup (one-time, project owner)

1. Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins: `https://yourdomain.com` (or the Vercel preview URL)
   - Authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
2. Enable Gmail API on the same project (APIs & Services → Library → Gmail API → Enable)
3. OAuth consent screen → scopes → add `https://www.googleapis.com/auth/gmail.readonly`
4. Copy client ID + client secret into Vercel project env vars:
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_SECRET` (generate: `openssl rand -base64 32`)
5. Until OAuth consent is verified for sensitive scopes, the app is in "Testing" mode; add specific Gmail addresses under Test users to let them sign in.

## Roadmap

- [x] Sample data UI, sort by days silent
- [x] CSV download (UTF-8 BOM for Excel)
- [x] NextAuth v5 + Google provider wired (gmail.readonly scope, refresh_token in JWT only, never on disk)
- [x] `app/lib/gmail.ts` — real Gmail API call with `metadata` format, 5-concurrent pool
- [x] `app/lib/threads.ts` — `getThreadsForCurrentUser()` returns live or mock based on session
- [ ] OAuth consent verification (required to publish app for non-test users with sensitive scope)
- [ ] Plausible analytics (privacy-first, no cookie banner)
- [ ] Custom domain

See [SPEC at upstream repo](https://github.com/foxck016077/apify-gmail-inbox-intel#roadmap) for full design.

Have an opinion before this ships? [Discussion #16](https://github.com/foxck016077/apify-gmail-inbox-intel/discussions/16) is open.

## License

MIT
