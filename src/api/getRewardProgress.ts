import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const getRewardProgress = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("reward_progress")
    .select("reward_id, purchases")
    .eq("user_id", userId)
    .eq("store_id", storeId)
  if (error) throw error

  return data
}
