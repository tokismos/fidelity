import { LoadingView } from "@/components/LoadingView"
import { stackScreenOptions } from "@/constants/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function UserLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingView />
  if (!session) return <Redirect href="/sign-in" />
  if (isAdmin) return <Redirect href="/admin/home" />

  // Every screen draws its own NavBar, so no screen needs to be listed except the tabs
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
