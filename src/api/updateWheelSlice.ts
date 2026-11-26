import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  sliceId: Id
  points: number | null
  rewardId: string | null
  weight: number
  weeklyLimit: number | null
}

export const updateWheelSlice = async ({ sliceId, points, rewardId, weight, weeklyLimit }: Props) => {
  if (!sliceId) throw new Error("sliceId is required to update a wheel slice")

  const { error } = await supabase
    .from("wheel_slices")
    .update({ points, reward_id: rewardId, weight, weekly_limit: weeklyLimit })
    .eq("id", sliceId)
  if (error) throw error
}
