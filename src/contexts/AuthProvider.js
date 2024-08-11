import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "../auth/supabaseClient";
import { logger } from "../utils/logger";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(() => session?.access_token, [session]);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      logger.error("Error refreshing session:", error);
      return null;
    }
    setSession(data.session);
    return data.session;
  }, []);

  const signInAnonymously = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      logger.error("Error signing in anonymously:", error);
      return null;
    }
    setSession(data.session);
    return data.session;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
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
  }, [signInAnonymously]);

  const value = useMemo(
    () => ({
      session,
      loading,
      signInAnonymously,
      refreshSession,
      getToken,
    }),
    [session, loading, signInAnonymously, refreshSession, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
