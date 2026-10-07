import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  rewardId: Id
}

export const addPurchase = async ({ userId, rewardId }: Props) => {
  if (!userId || !rewardId) throw new Error("userId and rewardId are required to add a purchase")

  const { data, error } = await supabase.rpc("add_purchase", { p_user_id: userId, p_reward_id: rewardId })
  if (error) throw error

  return data
}
