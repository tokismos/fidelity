import { Id, SpinResult } from "@/types"
import { asJsonObject } from "@/utils/json"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  // Test mode: skips the 3 day wait, only accepted by a local database
  ignoreWait: boolean
}

// The database picks the prize, the app only shows it
export const spinWheel = async ({ storeId, ignoreWait }: Props): Promise<SpinResult | null> => {
  if (!storeId) throw new Error("storeId is required to spin the wheel")

  const { data, error } = await supabase.rpc("spin_wheel", { p_store_id: storeId, p_ignore_wait: ignoreWait })
  if (error) throw error

  const result = asJsonObject(data)
  if (!result) return null

  return { sliceId: String(result.slice_id), points: typeof result.points === "number" ? result.points : null }
}
