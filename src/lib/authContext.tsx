"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

// Define types for our context
type UserRole = "admin" | "judge" | "unknown";

interface AuthContextType {
  user: any | null;
  userRole: UserRole;
  judgeStatus: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("unknown");
  const [judgeStatus, setJudgeStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Get current session and user
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // No active session
          setUser(null);
          setUserRole("unknown");
          setJudgeStatus(null);
          setLoading(false);
          return;
        }

        // We have a session, get the user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUser(null);
          setUserRole("unknown");
          setJudgeStatus(null);
          setLoading(false);
          return;
        }

        // Set the base user
        setUser(user);

        // Check if user is an admin
        const isAdmin = user.app_metadata?.role === "admin";

        if (isAdmin) {
          setUserRole("admin");
          setJudgeStatus(null);
          setLoading(false);
          return;
        }

        // If not admin, check if they're a judge
        try {
          const { data: judgeData, error } = await supabase
            .from("judges")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              // No judge record found
              setUserRole("unknown");
              setJudgeStatus(null);
            } else {
              console.error("Error fetching judge data:", error);
              setUserRole("unknown");
              setJudgeStatus(null);
            }
          } else if (judgeData) {
            // Valid judge found
            setUserRole("judge");
            setJudgeStatus(judgeData.status);
          }
        } catch (error) {
          console.error("Error checking judge status:", error);
          setUserRole("unknown");
          setJudgeStatus(null);
        }
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUser();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserRole("unknown");
        setJudgeStatus(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Context value
  const value = {
    user,
    userRole,
    judgeStatus,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
