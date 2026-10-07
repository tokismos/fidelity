import { Id, RewardConfig } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
  title: string
  description: string
  config: RewardConfig
  isOneTime: boolean
}

export const updateReward = async ({ rewardId, title, description, config, isOneTime }: Props) => {
  if (!rewardId) throw new Error("rewardId is required to update a reward")

  const { error } = await supabase
    .from("rewards")
    .update({ title, description, config, is_one_time: isOneTime })
    .eq("id", rewardId)
  if (error) throw error
}
