import { supabase } from "@/utils/supabase"

type Props = {
  email: string
  password: string
  name?: string
}

// The name is saved on the profile by the handle_new_user trigger
export const signUpWithEmail = async ({ email, password, name }: Props) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name?.trim() ?? "" } },
  })
  if (error) throw error

  return data
}
