import { Id, WheelSpin } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

// A customer's spins in one store, newest first
export const getWheelSpins = async ({ userId, storeId }: Props) => {
  if (!userId || !storeId) return null

  const { data, error } = await supabase
    .from("wheel_spins")
    .select("id, created_at, points, reward_id, given_at, reward:rewards(title)")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<WheelSpin[]>()
  if (error) throw error

  return data
}
