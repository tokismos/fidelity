import { Id, RewardConfig, RewardType } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  type: RewardType
  title: string
  description: string
  config: RewardConfig
  isOneTime: boolean
}

export const addReward = async ({ storeId, type, title, description, config, isOneTime }: Props) => {
  if (!storeId) throw new Error("storeId is required to add a reward")

  // cost_points is set by the database from the reward type
  const { error } = await supabase.from("rewards").insert({
    store_id: storeId,
    type,
    title,
    description,
    config,
    is_one_time: isOneTime,
    status: "active",
    cost_points: false,
  })
  if (error) throw error
}
