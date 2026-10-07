import { LoadingView } from "@/components/LoadingView"
import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function AuthLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingView />
  if (session) return <Redirect href={isAdmin ? "/admin/home" : "/user/home"} />

  return <Stack screenOptions={{ headerShown: false }} />
}
