import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { Redirect } from "expo-router"
import { AppState, View } from "react-native"

export default function Index() {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
  const { session, isLoading, isAdmin } = useAuth()

  if (isLoading) return <View className="flex-1 bg-black" />

  if (session) {
    return <Redirect href={isAdmin ? "/(admin)/home" : "/(user)/home"} />
  }

  return <Redirect href="/sign-in" />
}
