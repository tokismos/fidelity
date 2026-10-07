import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  promotionId: Id
}

// Removes an upcoming promotion, or ends a running one now
export const endPromotion = async ({ promotionId }: Props) => {
  if (!promotionId) throw new Error("promotionId is required to end a promotion")

  const { error } = await supabase.rpc("end_promotion", { p_promotion_id: promotionId })
  if (error) throw error
}
