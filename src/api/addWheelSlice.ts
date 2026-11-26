import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  points: number | null
  rewardId: string | null
  weight: number
  weeklyLimit: number | null
}

export const addWheelSlice = async ({ storeId, points, rewardId, weight, weeklyLimit }: Props) => {
  if (!storeId) throw new Error("storeId is required to add a wheel slice")

  const { error } = await supabase.from("wheel_slices").insert({
    store_id: storeId,
    points,
    reward_id: rewardId,
    weight,
    weekly_limit: weeklyLimit,
  })
  if (error) throw error
}
