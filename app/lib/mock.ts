import type { Thread } from "./types";

const today = new Date();

function daysAgoISO(days: number): string {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const SAMPLES: Array<{ subject: string; counterparty: string; days: number }> = [
  { subject: "Re: Q3 retainer scope — final sign-off", counterparty: "lauren@retain.co", days: 87 },
  { subject: "RFP response — Acme rebrand engagement", counterparty: "jordan@acmegroup.com", days: 64 },
  { subject: "Updated proposal — March deliverables", counterparty: "priya@northwinds.io", days: 58 },
  { subject: "Re: Contract draft v3 (legal review)", counterparty: "marcus@brightline.co", days: 52 },
  { subject: "Re: Kickoff intro — copy refresh", counterparty: "emma@halftrip.net", days: 44 },
  { subject: "Re: Onboarding deck — your turn", counterparty: "ben@cypherflow.com", days: 41 },
  { subject: "Re: Invoice 0094 — payment status?", counterparty: "ar@dovetailpartners.com", days: 39 },
  { subject: "RE: Design retrospective — your slot", counterparty: "sara@orangeleaf.co", days: 35 },
  { subject: "Re: Workshop scheduling for May", counterparty: "tom@shapelabs.com", days: 32 },
  { subject: "Re: Discovery call follow-up + deck", counterparty: "kai@nordhouse.io", days: 28 },
  { subject: "Re: Audit findings — next steps", counterparty: "yuki@aritsuna.jp", days: 24 },
  { subject: "Re: Q2 roadmap input requested", counterparty: "felix@castelco.eu", days: 21 },
  { subject: "Re: New scope addendum — your sign", counterparty: "rosa@plumdesign.studio", days: 17 },
  { subject: "Re: Reminder: feedback on draft 3", counterparty: "henry@goldhill.com", days: 14 },
  { subject: "Re: Estimate adjustment — extended", counterparty: "amelie@duvalpartners.fr", days: 11 },
  { subject: "Re: Workshop materials review", counterparty: "leo@northbound.co", days: 9 },
  { subject: "Re: Brief approved — go ahead?", counterparty: "stella@quietworks.com", days: 7 },
  { subject: "Re: Updated mocks for v2", counterparty: "rohan@flintforge.io", days: 5 },
  { subject: "Re: Light retainer extension question", counterparty: "casey@longtablehq.com", days: 4 },
  { subject: "Re: Final deliverable — ship date?", counterparty: "june@papermill.studio", days: 2 },
];

const COLD_AGE_DAYS = 30;

export function getMockThreads(): Thread[] {
  return SAMPLES.map((s, idx) => ({
    thread_id: `mock_${String(idx + 1).padStart(3, "0")}`,
    subject: s.subject,
    counterparty: s.counterparty,
    last_reply_at: daysAgoISO(s.days),
    days_silent: s.days,
    sla_breach: s.days >= COLD_AGE_DAYS,
    thread_link: `https://mail.google.com/mail/u/0/#all/mock_${String(idx + 1).padStart(3, "0")}`,
  })).sort((a, b) => b.days_silent - a.days_silent);
}
