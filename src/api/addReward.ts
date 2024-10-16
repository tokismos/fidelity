import { supabase } from "@/utils/supabase"

type Props = {
  title: string
  pointsCost: number
  storeId: string
}

export const addReward = async ({ title, pointsCost, storeId }: Props) => {
  if (!storeId) {
    throw new Error("Store id is required to add a reward")
  }
  try {
    const { error } = await supabase.from("rewards").insert({ title, points_cost: pointsCost, store_id: storeId })

    if (error) throw error
  } catch (error) {
    console.log("Error adding reward :", error)
    throw error
  }
}
