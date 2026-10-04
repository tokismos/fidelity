import { isUserAdmin } from "@/api/isUserAdmin"
import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { PropsWithChildren, createContext, useEffect, useState } from "react"

type AuthData = {
  session: Session | null
  isLoading: boolean
  userId: string
  email: string
  isAdmin: boolean
}

const SIGNED_OUT: AuthData = { session: null, isLoading: false, userId: "", email: "", isAdmin: false }

export const AuthContext = createContext<AuthData | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authData, setAuthData] = useState<AuthData>({ ...SIGNED_OUT, isLoading: true })

  useEffect(() => {
    const handleSession = async (session: Session | null) => {
      if (!session) {
        setAuthData(SIGNED_OUT)
        return
      }

      const isAdmin = await isUserAdmin({ userId: session.user.id }).catch(() => false)
      setAuthData({
        session,
        isLoading: false,
        userId: session.user.id,
        email: session.user.email ?? "",
        isAdmin,
      })
    }

    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session))

    // Supabase calls inside this callback can block auth, so run them right after it
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setTimeout(() => handleSession(session), 0)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
}
