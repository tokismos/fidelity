import { QrCode } from "@/components/QrCode"
import { useAuth } from "@/hooks/useAuth"
import { View, Text } from "react-native"

export default function Home() {
  const { userId, isAdmin } = useAuth()

  return (
    <View>
      <Text>THIIS IS ADMIN</Text>
    </View>
  )
}
