import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  name: string
  imageUrl: string
}

export const addStore = async ({ userId, name, imageUrl }: Props) => {
  if (!userId) throw new Error("userId is required to add a store")

  const { data, error } = await supabase
    .from("stores")
    .insert({ owner_id: userId, name, image_url: imageUrl })
    .select("id")
    .single()
  if (error) throw error

  return data
}
