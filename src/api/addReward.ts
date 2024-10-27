import { Json, Reward, REWARD_STATUS, REWARD_TYPES, Tables } from "@/types"
import { supabase } from "@/utils/supabase"

export const addReward = async ({ title, description, config, storeId, type }: Reward<REWARD_TYPES>) => {
  if (!storeId) {
    throw new Error("Store id is required to add a reward")
  }
  try {
    const newReward = {
      title,
      description: description || null,
      store_id: storeId,
      type,
      status: REWARD_STATUS.ACTIVE,
      config: config as Json,
    } as Tables<"rewards">

    const { error } = await supabase.from("rewards").insert(newReward)

    if (error) throw error
  } catch (error) {
    console.log("Error adding reward :", error)
    throw error
  }
}
