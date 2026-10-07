import { Id, PurchaseLogEntry } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const getPurchaseLog = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("purchase_log")
    .select("id, created_at, reward_id, change, reward:rewards(title)")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<PurchaseLogEntry[]>()
  if (error) throw error

  return data
}
