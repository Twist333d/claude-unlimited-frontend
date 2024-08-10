// hooks/useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedSession = localStorage.getItem("supabase.auth.token");
      if (storedSession) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(storedSession);
        if (!error && user) {
          setSession({ access_token: storedSession, user });
        } else {
          await signInAnonymously();
        }
      } else {
        await signInAnonymously();
      }
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      localStorage.setItem("supabase.auth.token", session?.access_token || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Error signing in anonymously:", error);
    } else if (data?.session) {
      setSession(data.session);
      localStorage.setItem("supabase.auth.token", data.session.access_token);
    }
  };

  // Placeholder functions for future implementation
  const login = () => console.log("Login not yet implemented");
  const signup = () => console.log("Signup not yet implemented");
  const logout = () => console.log("Logout not yet implemented");

  return { session, loading, login, signup, logout };
};
