import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { isUserAdmin } from "@/api"

type AuthData = {
  session: Session | null
  isLoading: boolean
  userId: string
  isAdmin: boolean | null
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authData, setAuthData] = useState<AuthData>({
    session: null,
    isLoading: true,
    userId: '',
    isAdmin: null,
  });

  useEffect(() => {
    const handleUserSession = async (userSession: Session | null) => {
      if (userSession) {
        const isAdmin = await isUserAdmin(userSession.user.id);
        setAuthData({
          session: userSession,
          isLoading: false,
          userId: userSession.user.id,
          isAdmin,
        });
      } else {
        setAuthData({
          session: null,
          isLoading: false,
          userId: '',
          isAdmin: false,
        });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        handleUserSession(session);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authData }}>
      {children}
    </AuthContext.Provider>
  );
};
