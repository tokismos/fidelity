import { QrCode } from "@/components/QrCode"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { View, Text, Button } from "react-native"

export default function User() {
  const { userId, isAdmin } = useAuth()

  return (
    <View>
      <Text className="text-lg font-bold">THIS IS USER {userId}</Text>
      {userId && <QrCode value={userId} />}
      <Button title="Log out" onPress={() => supabase.auth.signOut()} />
    </View>
  )
}
