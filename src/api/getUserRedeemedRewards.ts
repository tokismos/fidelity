import { supabase } from "@/utils/supabase"

export const getUserRedeemedRewards = async ({ userId, storeId }: { userId: string; storeId: string }) => {
  if (!userId || !storeId) return null

  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .select("reward_id,rewards(*)")
      .eq("user_id", userId)
      .eq("rewards.store_id", storeId)

    if (error) throw error
    return data.map((item) => item.reward_id)
  } catch (error) {
    console.log("Error getting redeemed rewards", error)
    throw error
  }
}
