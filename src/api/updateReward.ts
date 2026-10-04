import { Id, RewardConfig } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
  title: string
  description: string
  config: RewardConfig
}

export const updateReward = async ({ rewardId, title, description, config }: Props) => {
  if (!rewardId) throw new Error("rewardId is required to update a reward")

  const { error } = await supabase.from("rewards").update({ title, description, config }).eq("id", rewardId)
  if (error) throw error
}
