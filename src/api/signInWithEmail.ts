import { supabase } from "@/utils/supabase"

type Props = {
  email: string
  password: string
}

export const signInWithEmail = async ({ email, password }: Props) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  return data
}
