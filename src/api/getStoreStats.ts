import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
}

export const getStoreStats = async ({ storeId }: Props) => {
  if (!storeId) return null

  const { data, error } = await supabase.rpc("get_store_stats", { p_store_id: storeId }).single()
  if (error) throw error

  return data
}
