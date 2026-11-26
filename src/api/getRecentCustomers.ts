import { Id, RecentCustomer } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  limit: number
}

// Rows read from each activity log, enough to find a few different customers
const ACTIVITY_ROWS = 100

// The customers with the latest points, purchases or rewards, newest first.
// Newest cards fill the list when there is not enough activity yet.
export const getRecentCustomers = async ({ storeId, limit }: Props) => {
  if (!storeId) return null

  const [history, purchases, rewards, newestCards] = await Promise.all([
    supabase
      .from("history")
      .select("user_id, created_at")
      .eq("store_id", storeId)
      // Wheel bonuses come from the customer's own spin, not from a visit to the store
      .neq("operation_type", "wheel_bonus")
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_ROWS),
    supabase
      .from("purchase_log")
      .select("user_id, created_at")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_ROWS),
    supabase
      .from("user_rewards")
      .select("user_id, created_at")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_ROWS),
    supabase
      .from("user_stores")
      .select("user_id, points, profile:profiles(name, email)")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<RecentCustomer[]>(),
  ])
  if (history.error) throw history.error
  if (purchases.error) throw purchases.error
  if (rewards.error) throw rewards.error
  if (newestCards.error) throw newestCards.error

  const latestFirst = [...history.data, ...purchases.data, ...rewards.data].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const activeIds = [...new Set(latestFirst.map((row) => row.user_id))].slice(0, limit)

  let activeCards: RecentCustomer[] = []
  if (activeIds.length > 0) {
    const { data, error } = await supabase
      .from("user_stores")
      .select("user_id, points, profile:profiles(name, email)")
      .eq("store_id", storeId)
      .in("user_id", activeIds)
      .returns<RecentCustomer[]>()
    if (error) throw error

    activeCards = activeIds.flatMap((userId) => data.filter((card) => card.user_id === userId))
  }

  const fillers = newestCards.data.filter((card) => !activeIds.includes(card.user_id))
  return [...activeCards, ...fillers].slice(0, limit)
}
