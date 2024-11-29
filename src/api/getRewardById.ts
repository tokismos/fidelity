import { Reward } from "@/types"
import { supabase } from "@/utils/supabase"

export const getRewardById = async ({ rewardId }: { rewardId: string }) => {
  if (!rewardId) return null

  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("id,title,description,type,config")
      .eq("id", rewardId)
      .single()
    if (error) throw error

    return data as Reward
  } catch (error) {
    console.log("Error getting the reward  by id.", error)

    throw error
  }
}
