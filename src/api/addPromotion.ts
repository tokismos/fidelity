import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  multiplier: number
  startsAt: Date
  endsAt: Date
}

export const addPromotion = async ({ storeId, multiplier, startsAt, endsAt }: Props) => {
  if (!storeId) throw new Error("storeId is required to add a promotion")

  const { error } = await supabase.from("promotions").insert({
    store_id: storeId,
    multiplier,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  })
  if (error) throw error
}
