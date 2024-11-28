import { supabase } from "./supabase"

export const getImageUrl = (imageName: string) => {
  const { data } = supabase.storage.from("images").getPublicUrl(imageName)

  return data.publicUrl
}
