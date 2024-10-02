import { Link, Redirect } from "expo-router"
import { AppState, Button } from "react-native"
import { supabase } from "@/utils/supabase"
import { useAuth } from "@/hooks/useAuth"
import { AuthProvider } from "@/providers/AuthProvider"

export default function Auth() {
  return <Redirect href={"/sign-in"} />
}
