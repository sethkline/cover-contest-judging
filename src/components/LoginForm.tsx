"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Step 2: Get the user and check their role
      const { user } = data;
      console.log("User authenticated:", user.id);

      console.log("User metadata:", user);

      // Check if user is an admin based on metadata
      const isAdmin = user.user_metadata?.role === "admin";
      console.log("Is admin?", isAdmin);

      if (isAdmin) {
        // Admin user - redirect to admin dashboard
        console.log("Redirecting to admin dashboard");
        router.refresh();
        router.push("/admin");
        return;
      }

      // Step 3: Not an admin, so check if they're a judge
      console.log("Checking if user is a judge");
      const { data: judgeData, error: judgeError } = await supabase
        .from("judges")
        .select("*")
        .eq("id", user.id)
        .single();

      if (judgeError) {
        console.error("Judge query error:", judgeError);
        if (judgeError.code === "PGRST116") {
          throw new Error(
            "You don't have access to this system. Please contact an administrator.",
          );
        }
        throw judgeError;
      }

      // Valid judge found
      console.log("Judge found:", judgeData);
      router.refresh();

      // Check if first login (status is pending)
      if (judgeData.status === "pending") {
        console.log("Redirecting to welcome page");
        router.push("/judge/welcome");
      } else {
        console.log("Redirecting to judge dashboard");
        router.push("/judge/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-sm text-right">
          <Link
            href="/reset-password"
            className="text-blue-600 hover:text-blue-800"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
