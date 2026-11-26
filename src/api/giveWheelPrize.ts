import { Id } from "@/types"
import { supabase } from "@/utils/supabase"

type Props = {
  spinId: Id
}

// Gives a reward won on the wheel, it costs no points
export const giveWheelPrize = async ({ spinId }: Props) => {
  if (!spinId) throw new Error("spinId is required to give a wheel prize")

  const { data, error } = await supabase.rpc("give_wheel_prize", { p_spin_id: spinId })
  if (error) throw error

  return data
}
