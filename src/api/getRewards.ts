import { supabase } from "@/utils/supabase"

export const getRewards = async ({ storeId }: { storeId: string | null }) => {
  if (!storeId) return null

  try {
    const { data, error } = await supabase
      .from("rewards")
      .select("id,title,description,type,config")
      .eq("store_id", storeId)
    if (error) throw error

    return data
  } catch (error) {
    console.log("Error getting the rewards for store.", error)

    throw error
  }
}
