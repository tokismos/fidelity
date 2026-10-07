import { Id, StoreCustomer } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
}

export const getStoreCustomers = async ({ storeId }: Props) => {
  if (!storeId) return null

  const { data, error } = await supabase
    .from("user_stores")
    .select("id, points, user_id, created_at, profile:profiles(email)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<StoreCustomer[]>()
  if (error) throw error

  return data
}
