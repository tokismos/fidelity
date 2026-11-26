import { Id, UserRewardProgress } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

// Purchase counts of a customer on every card, in every store
export const getUserProgress = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase
    .from("reward_progress")
    .select("reward_id, store_id, purchases")
    .eq("user_id", userId)
    .returns<UserRewardProgress[]>()
  if (error) throw error

  return data
}
