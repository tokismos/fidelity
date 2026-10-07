import { Id, OperationType } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
  amount: number
  operationType: OperationType
}

export const updatePoints = async ({ userId, storeId, amount, operationType }: Props) => {
  if (!userId || !storeId) throw new Error("userId and storeId are required to update points")

  const { data, error } = await supabase.rpc("update_points_with_history", {
    p_user_id: userId,
    p_store_id: storeId,
    p_transaction_amount: amount,
    p_operation_type: operationType,
  })
  if (error) throw error

  return data
}
