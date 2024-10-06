import { supabase } from "@/utils/supabase"
import { Session, User } from "@supabase/supabase-js"
import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { isUserAdmin } from "@/api"

type AuthData = {
  session: Session | null
  isLoading: boolean
  userId: User["id"] | null
  isAdmin: boolean
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthData["session"]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<AuthData["userId"]>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const handleUserSession = async (userSession: Session | null) => {
      setIsAdmin(false)
      setSession(userSession)
      if (userSession) {
        const isAdmin = await isUserAdmin(userSession.user.id)
        setIsAdmin(isAdmin)
      }

      setUserId(userSession?.user.id ?? null)
      setIsLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      handleUserSession(session)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, isLoading, userId, isAdmin }}>{children}</AuthContext.Provider>
}
