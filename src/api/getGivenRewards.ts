import { GivenReward, Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const getGivenRewards = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("user_rewards")
    .select("id, created_at, reward_id, config, reward:rewards(title, type)")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<GivenReward[]>()
  if (error) throw error

  return data
}
