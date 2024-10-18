import { UserId } from "@/types"
import { supabase } from "@/utils/supabase"

export const getUserStores = async ({ userId }: { userId: UserId }) => {
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from("user_stores")
      .select("id, points, store:stores!inner(id,name)")
      .eq("user_id", userId)

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error getting the stores for user")

    throw error
  }
}
