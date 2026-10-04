import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  rewardId: Id
}

export const deleteReward = async ({ rewardId }: Props) => {
  if (!rewardId) throw new Error("rewardId is required to delete a reward")

  const { error } = await supabase.from("rewards").delete().eq("id", rewardId)
  if (error) throw error
}
