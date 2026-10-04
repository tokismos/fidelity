import { Id, Reward } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  activeOnly: boolean
}

export const getRewards = async ({ storeId, activeOnly }: Props) => {
  if (!storeId) return null

  let query = supabase
    .from("rewards")
    .select("id, created_at, title, description, type, config, status, store_id, cost_points")
    .eq("store_id", storeId)

  if (activeOnly) query = query.eq("status", "active")

  const { data, error } = await query.order("created_at").order("title").returns<Reward[]>()
  if (error) throw error

  return data
}
