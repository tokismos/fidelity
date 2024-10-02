import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { PropsWithChildren, createContext, useEffect, useState } from "react"

type AuthData = {
  session: Session | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthData["session"]>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setIsLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ session, isLoading }}>{children}</AuthContext.Provider>
}
