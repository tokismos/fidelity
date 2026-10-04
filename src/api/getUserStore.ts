import { Id, StoreCustomer } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

// The customer's membership in one store, null when they are not a customer yet
export const getUserStore = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("user_stores")
    .select("id, points, user_id, created_at, profile:profiles(email)")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .returns<StoreCustomer[]>()
    .maybeSingle()
  if (error) throw error

  return data
}
