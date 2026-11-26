import { Id, Json, OperationType, PointsUpdateResult } from "@/types"
import { asJsonObject } from "@/utils/json"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
  amount: number
  operationType: OperationType
}

// The function returns a json object, read its numbers
const toResult = (data: Json): PointsUpdateResult | null => {
  const result = asJsonObject(data)
  if (!result) return null

  return {
    previous_points: Number(result.previous_points),
    new_points: Number(result.new_points),
    amount: Number(result.amount),
    multiplier: Number(result.multiplier),
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
