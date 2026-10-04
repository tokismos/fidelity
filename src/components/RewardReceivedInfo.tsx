import { formatDate } from "@/utils/rewards"
import { Text, View } from "react-native"

type Props = {
  count: number
  lastDate: string | null
}

export const RewardReceivedInfo = ({ count, lastDate }: Props) => (
  <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
    <Text className="font-semibold text-gray-900">
      {count === 0 ? "Never" : count === 1 ? "Once" : `${count} times`} received
    </Text>
    <Text className="mt-1 text-sm text-gray-500">
      {lastDate ? `Last time: ${formatDate(lastDate)}` : "Not received yet."}
    </Text>
  </View>
)
