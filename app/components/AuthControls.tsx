import { auth, signIn, signOut } from "@/auth";

export async function AuthControls() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue with Google
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
      className="flex items-center gap-3"
    >
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{session.user.email}</span>
      </span>
      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Sign out
      </button>
    </form>
  );
}
