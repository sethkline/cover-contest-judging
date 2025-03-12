// src/components/SignOutButton.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-gray-600 hover:text-gray-900 px-4 py-2"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
