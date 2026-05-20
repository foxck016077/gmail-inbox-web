import type { Thread } from "./types";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
const COLD_AGE_DAYS = 30;
const MAX_THREADS = 100;
const CONCURRENCY = 5;

interface GmailListResponse {
  threads?: Array<{ id: string }>;
  nextPageToken?: string;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessage {
  internalDate: string;
  payload?: { headers?: GmailHeader[] };
}

interface GmailThreadResponse {
  id: string;
  messages?: GmailMessage[];
}

async function gfetch<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${GMAIL_API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Gmail API ${path} -> ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return results;
}

function getHeader(headers: GmailHeader[] | undefined, name: string): string {
  if (!headers) return "";
  const h = headers.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return h?.value ?? "";
}

function parseEmail(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  return (match ? match[1] : raw).trim().toLowerCase();
}

export interface FetchOptions {
  coldAgeDays?: number;
  maxThreads?: number;
}

export async function fetchStalledThreads(
  accessToken: string,
  userEmail: string,
  opts: FetchOptions = {}
): Promise<Thread[]> {
  const cold = opts.coldAgeDays ?? COLD_AGE_DAYS;
  const max = opts.maxThreads ?? MAX_THREADS;

  const list = await gfetch<GmailListResponse>(
    `/threads?q=${encodeURIComponent("in:inbox newer_than:180d")}&maxResults=${max}`,
    accessToken
  );
  const threadIds = (list.threads ?? []).map((t) => t.id);

  const detailed = await pool(threadIds, CONCURRENCY, async (id) => {
    return gfetch<GmailThreadResponse>(
      `/threads/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To`,
      accessToken
    );
  });

  const selfEmail = userEmail.trim().toLowerCase();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const threads: Thread[] = detailed
    .filter((t) => t.messages && t.messages.length > 0)
    .map((t) => {
      const msgs = t.messages!;
      const subject = getHeader(msgs[0].payload?.headers, "Subject") || "(no subject)";

      let counterparty = "";
      for (const m of msgs) {
        const fromRaw = getHeader(m.payload?.headers, "From");
        const fromEmail = parseEmail(fromRaw);
        if (fromEmail && fromEmail !== selfEmail) {
          counterparty = fromEmail;
          break;
        }
      }
      if (!counterparty) {
        const toRaw = getHeader(msgs[0].payload?.headers, "To");
        counterparty = parseEmail(toRaw) || "(unknown)";
      }

      let latestMs = 0;
      for (const m of msgs) {
        const d = Number(m.internalDate);
        if (Number.isFinite(d) && d > latestMs) latestMs = d;
      }
      const daysSilent = Math.floor((now - latestMs) / oneDayMs);
      const lastReply = new Date(latestMs).toISOString().slice(0, 10);

      return {
        thread_id: t.id,
        subject,
        counterparty,
        last_reply_at: lastReply,
        days_silent: daysSilent,
        sla_breach: daysSilent >= cold,
        thread_link: `https://mail.google.com/mail/u/0/#all/${t.id}`,
      };
    })
    .filter((t) => t.days_silent >= 7)
    .sort((a, b) => b.days_silent - a.days_silent || a.last_reply_at.localeCompare(b.last_reply_at));

  return threads;
}
