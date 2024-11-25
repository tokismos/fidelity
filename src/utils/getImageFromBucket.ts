import React from "react"
import { supabase } from "./supabase"

export const getImageFromBucket = async (path: string) => {
  const { data, error } = await supabase.storage.from("images").createSignedUrl(path, 3600)

  return data
}
