import { Reward, REWARD_TYPES } from "@/types"
import { supabase } from "@/utils/supabase"

export const redeemReward = async ({
  userId,
  rewardId,
  config,
}: {
  userId: string
  rewardId: string
  config: Reward<REWARD_TYPES>["config"]
}) => {
  try {
    const { data, error } = await supabase.from("user_rewards").insert({
      user_id: userId,
      reward_id: rewardId,
      status: "redeemed",
      config,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error redeeming reward:", error)
    throw error
  }
}
