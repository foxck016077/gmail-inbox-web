import { getMockThreads } from "@/app/lib/mock";

const CSV_HEADER = "subject,counterparty,last_reply_at,days_silent,sla_breach,thread_link";

function escape(s: string): string {
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET() {
  const threads = getMockThreads();
  const rows = threads.map((t) =>
    [
      escape(t.subject),
      escape(t.counterparty),
      t.last_reply_at,
      String(t.days_silent),
      t.sla_breach ? "true" : "false",
      escape(t.thread_link),
    ].join(",")
  );
  const csv = "﻿" + CSV_HEADER + "\n" + rows.join("\n") + "\n";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gmail-cold-threads-${today}.csv"`,
    },
  });
}
