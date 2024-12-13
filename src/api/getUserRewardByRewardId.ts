import { Reward, UserReward } from "@/types"
import { supabase } from "@/utils/supabase"

export const getUserRewardByRewardId = async ({ rewardId }: { rewardId: string }) => {
  if (!rewardId) return null

  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .select("reward_id,config,status,reward:rewards!inner(title,description,type)")
      .eq("reward_id", rewardId)
      .returns<UserReward[]>()
      .single()

    if (error) throw error
    const { reward_id, config, status } = data
    return {
      reward_id,
      config,
      status,
      title: data.reward?.title,
      description: data.reward?.description,
      type: data.reward?.type,
    }
  } catch (error) {
    console.log("Error getting user reward", error)
    throw error
  }
}
