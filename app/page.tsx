import { ThreadTable } from "./components/ThreadTable";
import { getMockThreads } from "./lib/mock";

export default function Home() {
  const threads = getMockThreads();
  const breachCount = threads.filter((t) => t.sla_breach).length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <header className="mb-12">
          <div className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Preview · sample data · Google sign-in coming
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            See which client emails went cold this week.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Your inbox knows which leads ghosted you. This is a read-only Friday triage of stalled
            threads, ranked by silent days. No outbound automation, no scraping, no mailbox cache.
          </p>
        </header>

        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Stalled threads
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {threads.length} threads · {breachCount} SLA breach (silent ≥ 30 days)
            </p>
          </div>
          <a
            href="/api/threads.csv"
            download
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Download CSV
          </a>
        </section>

        <ThreadTable threads={threads} />

        <section className="mt-12 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            About this preview
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            The data above is sample data so you can see the format before connecting your inbox.
            The hosted version with Google one-click sign-in (gmail.readonly scope only) is in
            scoping.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              · Source:{" "}
              <a
                href="https://github.com/foxck016077/apify-gmail-inbox-intel"
                className="text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                github.com/foxck016077/apify-gmail-inbox-intel
              </a>{" "}
              (MIT)
            </li>
            <li>
              · Apify Actor:{" "}
              <a
                href="https://apify.com/foxck/gmail-inbox-intel"
                className="text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                apify.com/foxck/gmail-inbox-intel
              </a>{" "}
              (developer version, OAuth + INPUT.json)
            </li>
            <li>
              · Vote on v0.2 direction:{" "}
              <a
                href="https://github.com/foxck016077/apify-gmail-inbox-intel/discussions/16"
                className="text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                Discussion #16
              </a>
            </li>
          </ul>
        </section>

        <footer className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
          v0.2 preview · sample data only · no Gmail data is collected on this preview build
        </footer>
      </main>
    </div>
  );
}
