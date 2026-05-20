import type { Thread } from "../lib/types";

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

export function ThreadTable({ threads }: { threads: Thread[] }) {
  if (threads.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-lg text-zinc-700 dark:text-zinc-300">No stalled threads found.</p>
        <p className="mt-2 text-sm text-zinc-500">Your inbox is clean. Come back next Friday.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Counterparty</th>
            <th className="px-4 py-3">Last reply</th>
            <th className="px-4 py-3 text-right">Days silent</th>
            <th className="px-4 py-3 text-center">SLA</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {threads.map((t) => (
            <tr key={t.thread_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{truncate(t.subject, 60)}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{t.counterparty}</td>
              <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{t.last_reply_at}</td>
              <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">{t.days_silent}</td>
              <td className="px-4 py-3 text-center">{t.sla_breach ? <span title="SLA breach">🚨</span> : <span className="text-zinc-300 dark:text-zinc-700">—</span>}</td>
              <td className="px-4 py-3 text-right">
                <a
                  href={t.thread_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  aria-label="Open in Gmail"
                >
                  ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
