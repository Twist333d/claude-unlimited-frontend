import { createClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.auth.onError((error) => {
  logger.error("Supabase auth error:", error);
});

export const signInAnonymously = async () => {
  try {
    const { user, error } = await supabase.auth.signIn({
      provider: "anonymous",
    });
    if (error) throw error;
    logger.info("Anonymous sign-in successful", user);
    return user;
  } catch (error) {
    logger.error("Anonymous sign-in failed:", error);
    throw error;
  }
};

export const getSession = () => supabase.auth.session();

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    logger.debug("Auth state changed:", event, session);
    callback(event, session);
  });
};
