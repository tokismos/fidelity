import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

export const isUserAdmin = async ({ userId }: Props) => {
  if (!userId) return false

  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()
  if (error) throw error

  return data.role === "admin"
}
