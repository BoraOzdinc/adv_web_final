import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/items");
  }
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      <div className="flex flex-col items-center justify-center gap-4">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin/google"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </main>
  );
}
