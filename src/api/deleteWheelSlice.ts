import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  sliceId: Id
}

export const deleteWheelSlice = async ({ sliceId }: Props) => {
  if (!sliceId) throw new Error("sliceId is required to delete a wheel slice")

  const { error } = await supabase.from("wheel_slices").delete().eq("id", sliceId)
  if (error) throw error
}
