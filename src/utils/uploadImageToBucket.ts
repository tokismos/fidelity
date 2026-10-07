import { supabase } from "@/utils/supabase"
import { decode } from "base64-arraybuffer"
import * as Crypto from "expo-crypto"
import * as FileSystem from "expo-file-system/legacy"

type Props = {
  uri: string
  folder: "stores" | "rewards"
}

// Uploads a local photo to the public images bucket and returns its public URL
export const uploadImageToBucket = async ({ uri, folder }: Props) => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" })
  const path = `${folder}/${Crypto.randomUUID()}.jpg`

  const { error } = await supabase.storage.from("images").upload(path, decode(base64), { contentType: "image/jpeg" })
  if (error) throw error

  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl
}
