import { Id, UserGivenReward } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

// Every reward a customer received, in every store
export const getUserGivenRewards = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase
    .from("user_rewards")
    .select("reward_id, store_id")
    .eq("user_id", userId)
    .returns<UserGivenReward[]>()
  if (error) throw error

  return data
}
