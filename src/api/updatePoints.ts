import { Id, Json, OperationType, PointsUpdateResult } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
  amount: number
  operationType: OperationType
}

// The function returns a json object, read its numbers
const toResult = (data: Json): PointsUpdateResult | null => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null

  return {
    previous_points: Number(data.previous_points),
    new_points: Number(data.new_points),
    amount: Number(data.amount),
    multiplier: Number(data.multiplier),
  }
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

  return toResult(data)
}
