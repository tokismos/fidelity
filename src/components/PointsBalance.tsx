import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  points: number
  label: string
}

export const PointsBalance = ({ points, label }: Props) => (
  <View className="flex-row items-center rounded-xl bg-blue-600 p-4">
    <Ionicons name="star" size={28} color={colors.warning} />
    <View className="ml-3">
      <Text className="text-3xl font-bold text-white">{points}</Text>
      <Text className="text-sm text-blue-100">{label}</Text>
    </View>
  </View>
)
