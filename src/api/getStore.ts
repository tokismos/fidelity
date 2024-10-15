import { UserId } from "@/types"
import { supabase } from "@/utils/supabase"

export const getStore = async ({ userId }: { userId: UserId }) => {
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from("stores")
      .select("id, name, image_url")
      .eq("owner_id", userId)
      .maybeSingle()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error getting the store")

    throw error
  }
}
