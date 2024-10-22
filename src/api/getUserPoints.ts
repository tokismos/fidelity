import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

export const getUserPoints = async ({ userId, storeId }: { userId: Id; storeId: Id }) => {
  if (!userId || !storeId) return null

  try {
    const { data, error } = await supabase
      .from("user_stores")
      .select("id, points,user_id,store_id")
      .eq("user_id", userId)
      .eq("store_id", storeId)
      .maybeSingle()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error getting points for user store", error)

    throw error
  }
}
