import { Id, TablesUpdate } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  storeId: Id
  name?: string
  imageUrl?: string
  timezone?: string
}

// Saves only the fields that are given
export const updateStore = async ({ storeId, name, imageUrl, timezone }: Props) => {
  if (!storeId) throw new Error("storeId is required to update a store")

  const changes: TablesUpdate<"stores"> = {}
  if (name !== undefined) changes.name = name
  if (imageUrl !== undefined) changes.image_url = imageUrl
  if (timezone !== undefined) changes.timezone = timezone

  const { data, error } = await supabase
    .from("stores")
    .update(changes)
    .eq("id", storeId)
    .select("id, name, image_url, timezone")
    .single()
  if (error) throw error

  return data
}
