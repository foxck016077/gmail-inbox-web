#!/usr/bin/env bash
# scripts/setup-env.sh - generate AUTH_SECRET and print Vercel-paste-ready env table
# Hope can't sign into Fox's Google or Vercel account (boundary), so this minimises
# what Fox has to type: one openssl call, two Console URLs, three env var paste.
set -euo pipefail

cyan() { printf "\033[36m%s\033[0m" "$*"; }
green() { printf "\033[32m%s\033[0m" "$*"; }
yellow() { printf "\033[33m%s\033[0m" "$*"; }
bold() { printf "\033[1m%s\033[0m" "$*"; }

AUTH_SECRET="$(openssl rand -base64 32)"

cat <<HEADER
$(bold "gmail-inbox-web OAuth setup helper")
==============================================

This generates the random AUTH_SECRET and prints a paste-ready table.
You still need to do 2 things in browser (Hope can't sign into your
Google or Vercel accounts):

  1. Register the Google OAuth client (one-time, ~3 min)
  2. Paste 3 env vars into Vercel project settings (~30 sec)

HEADER

cat <<STEP1
$(bold "$(cyan "[1/2]  Google Cloud Console - register OAuth client")")

Open this URL (Hope verified this is the right deep-link page):

  $(green "https://console.cloud.google.com/apis/credentials/oauthclient")

Pick / create a project, then:
  - Application type: $(yellow "Web application")
  - Name:             $(yellow "gmail-inbox-web")
  - Authorized JavaScript origins:
      $(yellow "https://<your-vercel-url>.vercel.app")
      (you'll get this URL after Vercel deploys; come back and add it)
  - Authorized redirect URIs:
      $(yellow "https://<your-vercel-url>.vercel.app/api/auth/callback/google")

Then enable Gmail API on the same project:

  $(green "https://console.cloud.google.com/apis/library/gmail.googleapis.com")
  -> click Enable

Then add the scope on the OAuth consent screen:

  $(green "https://console.cloud.google.com/apis/credentials/consent")
  -> Edit App -> Scopes -> Add or remove scopes
  -> add: $(yellow "https://www.googleapis.com/auth/gmail.readonly")
  -> (you stay in "Testing" until verified by Google; add your own Gmail
      to the "Test users" list so you can sign in)

Copy the Client ID and Client Secret. Paste them into the table below
under AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET when you do step 2.

STEP1

cat <<STEP2

$(bold "$(cyan "[2/2]  Vercel project - paste env vars")")

Open Vercel project settings env page (after deploying the repo via the
Deploy with Vercel button in README):

  $(green "https://vercel.com/dashboard")
  -> open the gmail-inbox-web project
  -> Settings -> Environment Variables

Paste these 3 rows. Hope generated AUTH_SECRET for you above; the other
two come from step 1.

  ----------------------------------------------------------------------
  Name                  Value
  ----------------------------------------------------------------------
  AUTH_GOOGLE_ID        $(yellow "<paste Client ID from step 1>")
  AUTH_GOOGLE_SECRET    $(yellow "<paste Client Secret from step 1>")
  AUTH_SECRET           $(green "${AUTH_SECRET}")
  ----------------------------------------------------------------------

Set environment to: $(yellow "Production, Preview, Development")  (all 3)

After save, hit Redeploy in the Deployments tab. The "Continue with
Google" button should now work.

STEP2

cat <<DONE

$(bold "$(green "Done.")")

Total Fox-side time once you've copied this output: ~3 minutes Cloud
Console + 30 sec Vercel paste + redeploy click.

If anything fails Hope can debug post-hoc via the Vercel build logs
(github.com/foxck016077/gmail-inbox-web/actions also runs lint + build
on every push as a sanity check).

DONE
