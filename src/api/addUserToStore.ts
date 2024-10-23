import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  userId: Id
  storeId: Id
}

export const addUserToStore = async ({ userId, storeId }: Props) => {
  if (!storeId || !userId) {
    throw new Error("Store id and UserId are required to add user to store")
  }
  try {
    const { error } = await supabase.from("user_stores").insert({ user_id: userId, store_id: storeId })
    if (error) throw error
  } catch (error) {
    console.log("Error adding user to store :", error)
    throw error
  }
}
