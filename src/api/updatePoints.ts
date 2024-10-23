import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type UpdatePointsProps = {
  userId: Id
  storeId: Id
  points: number
}

export const updatePoints = async ({ userId, storeId, points }: UpdatePointsProps) => {
  if (!userId || !storeId) {
    throw new Error("User ID and Store ID are required to update points")
  }

  try {
    const { error } = await supabase
      .from("user_stores")
      .update({ points })
      .eq("user_id", userId)
      .eq("store_id", storeId)

    if (error) throw error
  } catch (error) {
    console.log("Error updating points:", error)
    throw error
  }
}
