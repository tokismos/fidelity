import { Id, Reward } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
}

export const getReward = async ({ rewardId }: Props) => {
  if (!rewardId) return null

  const { data, error } = await supabase
    .from("rewards")
    .select("id, created_at, title, description, type, config, status, store_id, cost_points, is_one_time")
    .eq("id", rewardId)
    .returns<Reward[]>()
    .single()
  if (error) throw error

  return data
}
