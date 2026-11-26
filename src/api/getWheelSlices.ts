import { Id, WheelSlice } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
}

// The slices of a store's wheel, in the order they are drawn on it
export const getWheelSlices = async ({ storeId }: Props) => {
  if (!storeId) return null

  const { data, error } = await supabase
    .from("wheel_slices")
    .select("id, points, reward_id, weight, weekly_limit, reward:rewards(title)")
    .eq("store_id", storeId)
    .order("created_at")
    .order("id")
    .returns<WheelSlice[]>()
  if (error) throw error

  return data
}
