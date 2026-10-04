import { LoadingView } from "@/components/LoadingView"
import { useAuth } from "@/hooks/useAuth"
import { Redirect } from "expo-router"

export default function Index() {
  const { session, isLoading, isAdmin } = useAuth()

  if (isLoading) return <LoadingView />
  if (!session) return <Redirect href="/sign-in" />

  return <Redirect href={isAdmin ? "/admin/home" : "/user/home"} />
}
