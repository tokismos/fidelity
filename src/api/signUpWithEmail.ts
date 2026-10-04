import { supabase } from "@/utils/supabase"

type Props = {
  email: string
  password: string
}

export const signUpWithEmail = async ({ email, password }: Props) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  return data
}
