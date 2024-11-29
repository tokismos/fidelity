import { Reward } from "@/types"
import { supabase } from "@/utils/supabase"

export const redeemReward = async ({
  userId,
  rewardId,
  config,
  storeId,
}: {
  userId: string
  rewardId: string
  config: Reward["config"]
  storeId: string
}) => {
  try {
    console.log("zzzzzzzzb", storeId)

    const { data, error } = await supabase.from("user_rewards").insert({
      user_id: userId,
      reward_id: rewardId,
      status: "redeemed",
      config,
      store_id: storeId,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error redeeming reward:", error)
    throw error
  }
}
