import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { Redirect } from "expo-router"
import { ActivityIndicator, AppState } from "react-native"

export default function Index() {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

  const { session, isLoading } = useAuth()

  if (isLoading) return <ActivityIndicator size={"large"} color={"black"} />

  if (!session) {
    return <Redirect href="/sign-in" />
  }

  return <Redirect href="/(tabs)" />
}
