import { Reward } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeIds: string[]
}

// Active rewards of several stores, for the customer's list of cards
export const getRewardsByStores = async ({ storeIds }: Props) => {
  if (storeIds.length === 0) return []

  const { data, error } = await supabase
    .from("rewards")
    .select("id, created_at, title, description, type, config, status, store_id, cost_points, is_one_time")
    .in("store_id", storeIds)
    .eq("status", "active")
    .order("created_at")
    .returns<Reward[]>()
  if (error) throw error

  return data
}
