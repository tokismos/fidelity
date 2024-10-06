import { QrCode } from "@/components/QrCode"
import { useAuth } from "@/hooks/useAuth"
import { View, Text } from "react-native"

export default function Tab() {
  const { userId, isAdmin } = useAuth()

  return (
    <View>
      <Text>USER ROLE : {isAdmin ? "ADMIN " : "USER"}</Text>
      {userId && <QrCode value={userId} />}
    </View>
  )
}
