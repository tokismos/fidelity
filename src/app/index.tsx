import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { Redirect, router, useSegments } from "expo-router"
import { ActivityIndicator, AppState, View } from "react-native"

export default function Index() {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
  const segments = useSegments()
  console.log("Current route segments:", segments)
  const { session, isLoading, isAdmin } = useAuth()

  // if (isLoading) return <ActivityIndicator size={"large"} color={"black"} />
  if (isLoading) return <View className="flex-1 bg-black" />

  if (session) {
    return <Redirect href={isAdmin ? "/(admin)/home" : "/(user)/home"} />
  }

  return <Redirect href="/sign-in" />
}
