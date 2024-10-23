import { Id, OperationType } from "@/types"
import { supabase } from "@/utils/supabase"

type UpdatePointsProps = {
  userId: Id
  storeId: Id
  amount: number
  operationType: OperationType
}

export const updatePoints = async ({ userId, storeId, amount, operationType }: UpdatePointsProps) => {
  if (!userId || !storeId) {
    throw new Error("User ID and Store ID are required to update points")
  }

  try {
    const { data, error } = await supabase.rpc("update_points_with_history", {
      p_user_id: userId,
      p_store_id: storeId,
      p_transaction_amount: amount,
      p_operation_type: operationType,
    })

    if (error) throw error

    return data
  } catch (error) {
    console.log("Error updating points:", error)
    throw error
  }
}
