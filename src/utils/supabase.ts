import "react-native-url-polyfill/auto"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { Database } from "database.types"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL_DEV as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_DEV as string

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
