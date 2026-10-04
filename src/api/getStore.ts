import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

export const getStore = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase
    .from("stores")
    .select("id, name, image_url")
    .eq("owner_id", userId)
    .maybeSingle()
  if (error) throw error

  return data
}
