import { colors } from "@/constants/colors"
import { TimelineEntry } from "@/types"
import { formatDate } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  entry: TimelineEntry
}

export const TimelineItem = ({ entry }: Props) => {
  if (entry.kind === "reward") {
    return (
      <View className="mb-2 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Ionicons name="gift" size={20} color={colors.warning} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-medium text-gray-900">{entry.title}</Text>
          <Text className="text-xs text-gray-500">Reward received · {formatDate(entry.date)}</Text>
        </View>
        {entry.pointsCost !== null && <Text className="font-semibold text-red-600">-{entry.pointsCost}</Text>}
      </View>
    )
  }

  const isAdd = entry.operation === "add"

  return (
    <View className="mb-2 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <View className={`h-10 w-10 items-center justify-center rounded-full ${isAdd ? "bg-green-100" : "bg-red-100"}`}>
        <Ionicons name={isAdd ? "add" : "remove"} size={22} color={isAdd ? colors.success : colors.danger} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-medium text-gray-900">{isAdd ? "Points added" : "Points removed"}</Text>
        <Text className="text-xs text-gray-500">{formatDate(entry.date)}</Text>
      </View>
      <Text className={`font-semibold ${isAdd ? "text-green-600" : "text-red-600"}`}>
        {isAdd ? "+" : "-"}
        {entry.amount}
      </Text>
    </View>
  )
}
