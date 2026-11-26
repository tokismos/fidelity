import { LoadingView } from "@/components/LoadingView"
import { stackScreenOptions } from "@/constants/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function AdminLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingView />
  if (!session) return <Redirect href="/sign-in" />
  if (!isAdmin) return <Redirect href="/user/home" />

  // Every screen draws its own NavBar. Only screens with special options are listed.
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scanner" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="newReward" options={{ presentation: "modal" }} />
      {/* A modal sheet both when it comes from newReward and when it edits a reward from Program */}
      <Stack.Screen name="upsert" options={{ presentation: "modal" }} />
    </Stack>
  )
}
