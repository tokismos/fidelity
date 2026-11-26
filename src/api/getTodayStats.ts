import { Id, TodayStats } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  since: string
}

// Customers served, points added and rewards given in the store since `since`
export const getTodayStats = async ({ storeId, since }: Props): Promise<TodayStats | null> => {
  if (!storeId) return null

  const [history, purchases, rewards] = await Promise.all([
    supabase
      .from("history")
      .select("user_id, operation_type, transaction_amount")
      .eq("store_id", storeId)
      // Wheel bonuses come from the customer's own spin, not from a visit to the store
      .neq("operation_type", "wheel_bonus")
      .gte("created_at", since),
    supabase.from("purchase_log").select("user_id").eq("store_id", storeId).gte("created_at", since),
    supabase.from("user_rewards").select("user_id").eq("store_id", storeId).gte("created_at", since),
  ])
  if (history.error) throw history.error
  if (purchases.error) throw purchases.error
  if (rewards.error) throw rewards.error

  const customers = new Set([...history.data, ...purchases.data, ...rewards.data].map((row) => row.user_id))
  // Points removed (an Undo, a correction) are taken off the points added
  const points = Math.max(
    0,
    history.data.reduce((sum, row) => {
      if (row.operation_type === "add") return sum + row.transaction_amount
      if (row.operation_type === "subtract") return sum - row.transaction_amount
      return sum
    }, 0),
  )

  return { customers: customers.size, points, rewards: rewards.data.length }
}
