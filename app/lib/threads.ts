import { auth } from "@/auth";
import { fetchStalledThreads } from "./gmail";
import { getMockThreads } from "./mock";
import type { Thread } from "./types";

export interface ThreadsResult {
  threads: Thread[];
  source: "live" | "mock";
  userEmail?: string;
  error?: string;
}

export async function getThreadsForCurrentUser(): Promise<ThreadsResult> {
  const session = await auth();

  if (!session?.accessToken || !session.user?.email) {
    return { threads: getMockThreads(), source: "mock" };
  }

  if (session.error === "RefreshAccessTokenError") {
    return {
      threads: getMockThreads(),
      source: "mock",
      error: "Your Gmail session expired. Sign in again to refresh.",
    };
  }

  try {
    const threads = await fetchStalledThreads(session.accessToken, session.user.email);
    return { threads, source: "live", userEmail: session.user.email };
  } catch (err) {
    return {
      threads: getMockThreads(),
      source: "mock",
      userEmail: session.user.email,
      error: err instanceof Error ? err.message : "Gmail API call failed",
    };
  }
}
