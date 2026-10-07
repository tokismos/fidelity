import { Id, UserStoreWithStore } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
}

export const getUserStores = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase
    .from("user_stores")
    .select("id, points, store:stores!inner(id, name, image_url, timezone)")
    .eq("user_id", userId)
    .order("created_at")
    .returns<UserStoreWithStore[]>()
  if (error) throw error

  return data
}
