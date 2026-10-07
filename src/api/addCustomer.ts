import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const addCustomer = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) throw new Error("userId and storeId are required to add a customer")

  const { error } = await supabase.from("user_stores").insert({ user_id: userId, store_id: storeId })
  if (error) throw error
}
