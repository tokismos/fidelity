import { QrCode } from "@/components/QrCode"
import { useAuth } from "@/hooks/useAuth"
import { View, Text } from "react-native"

export default function Tab() {
  const { userId } = useAuth()

  return (
    <View>
      <Text>Tab Index</Text>
      {userId && <QrCode value={userId} />}
    </View>
  )
}
