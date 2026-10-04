import { colors } from "@/constants/colors"
import { RewardProgress } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  progress: RewardProgress
  isAdmin: boolean
}

// "Ready" or "X more points/purchases" under a reward
export const RewardStatusMessage = ({ progress, isAdmin }: Props) => {
  if (progress.isReady) {
    return (
      <View className="mt-4 flex-row items-center rounded-xl bg-green-50 p-3">
        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
        <Text className="ml-2 flex-1 font-medium text-green-800">
          {isAdmin ? "Ready to give." : "Ready! Show your QR code at the counter."}
        </Text>
      </View>
    )
  }

  const remaining = progress.target - progress.current
  const unit = progress.unit === "purchases" ? "purchase" : "point"

  return (
    <View className="mt-4 flex-row items-center rounded-xl bg-gray-100 p-3">
      <Ionicons name="hourglass-outline" size={20} color={colors.text} />
      <Text className="ml-2 flex-1 text-gray-700">
        {remaining} more {unit}
        {remaining > 1 ? "s" : ""} needed.
      </Text>
    </View>
  )
}
