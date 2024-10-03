import { supabase } from "@/utils/supabase"
import { Session, User } from "@supabase/supabase-js"
import { PropsWithChildren, createContext, useEffect, useState } from "react"

type AuthData = {
  session: Session | null
  isLoading: boolean
  userId: User["id"] | null
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthData["session"]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<AuthData["userId"]>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUserId(session?.user.id ?? null)
      setIsLoading(false)
    })

    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setUserId(session?.user.id ?? null)
      setIsLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ session, isLoading, userId }}>{children}</AuthContext.Provider>
}
