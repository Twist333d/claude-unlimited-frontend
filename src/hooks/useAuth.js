// hooks/useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "../auth/supabaseClient";

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
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

  return { session, loading, login, signup, logout };
};
