import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

export const getProfile = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase.from("profiles").select("id, email, name, role").eq("id", userId).single()
  if (error) throw error

  return data
}
