import { supabase } from "@/utils/supabase"
import { decode } from "base64-arraybuffer"
import * as FileSystem from "expo-file-system/legacy"

type Props = {
  uri: string
  folder: "stores" | "rewards"
}

// Uploads a local photo to the public images bucket and returns its public URL
export const uploadImageToBucket = async ({ uri, folder }: Props) => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" })
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const path = `${folder}/${fileName}.jpg`

  const { error } = await supabase.storage.from("images").upload(path, decode(base64), { contentType: "image/jpeg" })
  if (error) throw error

  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl
}
