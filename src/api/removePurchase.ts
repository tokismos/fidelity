import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  rewardId: Id
}

export const removePurchase = async ({ userId, rewardId }: Props) => {
  if (!userId || !rewardId) throw new Error("userId and rewardId are required to remove a purchase")

  const { data, error } = await supabase.rpc("remove_purchase", { p_user_id: userId, p_reward_id: rewardId })
  if (error) throw error

  return data
}
