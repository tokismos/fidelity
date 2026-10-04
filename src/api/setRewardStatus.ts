import { Id, RewardStatus } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
  status: RewardStatus
}

export const setRewardStatus = async ({ rewardId, status }: Props) => {
  if (!rewardId) throw new Error("rewardId is required to change a reward status")

  const { error } = await supabase.from("rewards").update({ status }).eq("id", rewardId)
  if (error) throw error
}
