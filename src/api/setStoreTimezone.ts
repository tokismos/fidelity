import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  timezone: string
}

// Saves the store time zone only if it was never set
export const setStoreTimezone = async ({ storeId, timezone }: Props) => {
  if (!storeId) throw new Error("storeId is required to set the time zone")

  const { error } = await supabase.from("stores").update({ timezone }).eq("id", storeId).is("timezone", null)
  if (error) throw error
}
