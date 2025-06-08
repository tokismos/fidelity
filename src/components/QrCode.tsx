import { View } from "react-native"
import QRCode from "react-native-qrcode-svg"

type Props = {
  value: string
}

export const QrCode = ({ value }: Props) => {
  return (
    <View className="p-3">
      <QRCode value={value} size={200} />
    </View>
  )
}
