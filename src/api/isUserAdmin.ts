import { Role } from "@/types"
import { supabase } from "@/utils/supabase"

export const isUserAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

    if (error) throw error

    return data?.role === Role.ADMIN
  } catch (error) {
    console.log("Error fetching user role:", error)
    return false
  }
}
