"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/authContext"; 

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // // Create separate functions for cleaner code
  // const checkIsAdmin = async (userId) => {
  //   const { data } = await supabase
  //     .from('admin_users')
  //     .select('id')
  //     .eq('id', userId)
  //     .maybeSingle();
    
  //   return !!data;
  // };

  // const checkIsJudge = async (userId) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("judges")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();
        
  //     if (error) throw error;
  //     return data;
  //   } catch (error) {
  //     if (error.code === "PGRST116") {
  //       throw new Error("You don't have access to this system. Please contact an administrator.");
  //     }
  //     throw error;
  //   }
  // };

  // Main form submission handler  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Use the signIn method from AuthContext
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      // No need to handle redirects - AuthContext's signIn handles that
      
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
        <div className="bg-error-50 text-error-600 p-4 rounded-md my-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
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
              className="mt-1 block w-full rounded-md border border-neutral-300 dark:border-neutral-700 
                bg-white dark:bg-neutral-800 shadow-sm px-3 py-2 
                text-neutral-900 dark:text-neutral-100
                focus:border-primary-600 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-neutral-300 dark:border-neutral-700 
                  bg-white dark:bg-neutral-800 shadow-sm px-3 py-2 pr-10 
                  text-neutral-900 dark:text-neutral-100
                  focus:border-primary-600 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 
                  text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-right">
          <Link
            href="/reset-password"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400"
          >
            Forgot your password?
          </Link>
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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}