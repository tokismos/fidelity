import { colors } from "@/constants/colors"
import QRCode from "react-native-qrcode-svg"

type Props = {
  value: string
  size?: number
}

// Navy on white, so it scans well. Put it on a white Card.
export const QrCode = ({ value, size = 210 }: Props) => (
  <QRCode value={value} size={size} color={colors.ink} backgroundColor={colors.white} />
)
