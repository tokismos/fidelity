import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  rewardId: Id
}

// Takes the points or resets the purchase card, then logs the reward
export const giveReward = async ({ userId, rewardId }: Props) => {
  if (!userId || !rewardId) throw new Error("userId and rewardId are required to give a reward")

  const { data, error } = await supabase.rpc("give_reward", { p_user_id: userId, p_reward_id: rewardId })
  if (error) throw error

  return data
}
