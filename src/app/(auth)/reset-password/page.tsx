"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
          Reset your password
        </h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Enter your email and we'll send you a password reset link
        </p>
      </div>

      {error && (
        <div className="mt-4 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 p-4 rounded-md">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-8 space-y-4">
          <div className="bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 p-4 rounded-md">
            Check your email for the password reset link
          </div>
          <Link
            href="/login"
            className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
          >
            Return to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 
                bg-white dark:bg-neutral-800 shadow-sm px-3 py-2 
                text-neutral-900 dark:text-neutral-100
                focus:border-primary-600 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
              text-sm font-medium text-white 
              bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </>
  );
}
