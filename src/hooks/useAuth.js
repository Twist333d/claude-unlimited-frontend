// src/hooks/useAuth.js
import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import { supabase } from "../auth/supabaseClient";
import { logger } from "../utils/logger";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function useProvideAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session);
      return data.session;
    } catch (error) {
      logger.error("Error refreshing session:", error.message);
      setError(error.message);
      return null;
    }
  }, []);

  const getToken = useCallback(() => {
    return session?.access_token;
  }, [session]);

  const signInAnonymously = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setSession(data.session);
      return data.session;
    } catch (error) {
      logger.error("Error signing in anonymously:", error.message);
      setError(error.message);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error) {
      logger.error("Error signing out:", error.message);
      setError(error.message);
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
        setSession(currentSession);
        if (!currentSession) {
          await signInAnonymously();
        }
      } catch (error) {
        logger.error("Error during authentication:", error.message);
        setError(error.message);
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
  }, [signInAnonymously]);

  return {
    session,
    loading,
    error,
    refreshSession,
    getToken,
    signInAnonymously,
    signOut,
  };
}
