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
  const [authState, setAuthState] = useState({
    session: null,
    loading: true,
  });

  const getToken = useCallback(
    () => authState.session?.access_token,
    [authState.session],
  );

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setAuthState((prevState) => ({
        ...prevState,
        session: data.session,
      }));
      return data.session;
    } catch (error) {
      logger.error("Failed to refresh session:", error);
      await supabase.auth.signOut();
      setAuthState((prevState) => ({
        ...prevState,
        session: null,
      }));
      return null;
    }
  }, []);

  const signInAnonymously = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setAuthState((prevState) => ({
        ...prevState,
        session: data.session,
      }));
      return data.session;
    } catch (error) {
      logger.error("Error signing in anonymously:", error);
      return null;
    }
  }, []);

  const hasSessionChanged = useCallback(
    (newSession) => {
      return (
        authState.session?.user?.id !== newSession?.user?.id ||
        authState.session?.access_token !== newSession?.access_token
      );
    },
    [authState.session],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setAuthState((prevState) => ({
          ...prevState,
          session,
          loading: false,
        }));
      } catch (error) {
        logger.error("Error initializing auth:", error);
      } finally {
        setAuthState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setAuthState((prevState) => {
        if (
          prevState.session?.user?.id !== newSession?.user?.id ||
          prevState.session?.access_token !== newSession?.access_token
        ) {
          logger.info("Auth state changed", {
            event,
            userId: newSession?.user.id,
          });
          return { session: newSession, loading: false };
        }
        return prevState;
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      session: authState.session,
      loading: authState.loading,
      signInAnonymously,
      refreshSession,
      getToken,
      hasSessionChanged,
    }),
    [authState, signInAnonymously, refreshSession, getToken, hasSessionChanged],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
