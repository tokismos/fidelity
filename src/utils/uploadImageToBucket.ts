import { supabase } from "./supabase"
import { decode } from "base64-arraybuffer"
import * as FileSystem from "expo-file-system"
import * as Crypto from "expo-crypto"

export const uploadImageToBucket = async (imgUri: string) => {
  if (!imgUri) return
  const base64 = await FileSystem.readAsStringAsync(imgUri, { encoding: "base64" })
  const UUID = Crypto.randomUUID()

  const { data, error } = await supabase.storage
    .from("images")
    .upload(`products/${UUID}-${Date.now()}.jpg`, decode(base64), {
      contentType: "image/jpeg",
    })

  if (error) {
    throw new Error(`Error uploading the image ${error}`)
  }

  return data.path
}
