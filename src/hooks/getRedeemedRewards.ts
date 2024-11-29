import { RedeemedReward } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: string
  storeId: string
}
export const getRedeemedRewards = async ({ userId, storeId }: Props) => {
  const { data, error } = await supabase
    .from("user_rewards")
    .select("id,status,config,reward:rewards(id,title,description)")
    .eq("user_id", userId)
    .eq("store_id", storeId)
    .returns<RedeemedReward[] | null>()

  if (error) throw error
  return data
}
