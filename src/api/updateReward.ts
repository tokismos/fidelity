import { Id, Reward, REWARD_TYPES } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
  updatedReward: Reward<REWARD_TYPES>
}

export const updateReward = async ({ rewardId, updatedReward }: Props) => {
  if (!rewardId) {
    throw new Error("RewardId is required to update reward")
  }

  try {
    const { data, error } = await supabase
      .from("rewards")
      .update({
        title: updatedReward.title,
        description: updatedReward.description,
        config: updatedReward.config,
      })
      .eq("id", rewardId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error updating the reward", error)
    throw error
  }
}
