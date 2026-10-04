import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const getHistory = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("history")
    .select("id, created_at, operation_type, transaction_amount, previous_points, new_points")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
  if (error) throw error

  return data
}
