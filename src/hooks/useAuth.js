// hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../auth/supabaseClient";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
      } else {
        // If refresh fails, try anonymous sign-in
        await signInAnonymously();
      }
    } catch (error) {
      console.error("Error refreshing session:", error.message);
      setAuthError(error.message);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (currentSession) {
          setSession(currentSession);
        } else {
          await signInAnonymously();
        }
      } catch (error) {
        console.error("Error during authentication:", error.message);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Error signing in anonymously:", error);
    } else if (data?.session) {
      setSession(data.session);
    }
  };

  // Placeholder functions for future implementation
  const login = () => console.log("Login not yet implemented");
  const signup = () => console.log("Signup not yet implemented");
  const logout = () => console.log("Logout not yet implemented");

  return { session, loading, login, signup, logout, authError, refreshSession };
};
