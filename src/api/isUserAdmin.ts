import { Id, Role } from "@/types"
import { supabase } from "@/utils/supabase"

export const isUserAdmin = async (userId: Id) => {
  if (!userId) return null

  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

    if (error) throw error

    return data?.role === Role.ADMIN
  } catch (error) {
    console.log("Error fetching user role:", error)
    return null
  }
}
