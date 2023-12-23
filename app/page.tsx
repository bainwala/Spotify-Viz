"use client";

import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, session } = useClerk();
  const router = useRouter();

  if (user && session) router.replace("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Happy Visualizing.
    </main>
  );
}
