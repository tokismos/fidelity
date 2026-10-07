import { supabase } from "@/utils/supabase"

type Props = {
  storeIds: string[]
}

const RECENT_DAYS = 7

// Running, upcoming and recently ended promotions of these stores
export const getPromotions = async ({ storeIds }: Props) => {
  if (storeIds.length === 0) return []

  const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("promotions")
    .select("id, created_at, store_id, multiplier, starts_at, ends_at")
    .in("store_id", storeIds)
    .gt("ends_at", since)
    .order("starts_at")
  if (error) throw error

  return data
}
