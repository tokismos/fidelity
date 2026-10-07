import { colors } from "@/constants/colors"
import { TimelineEntry } from "@/types"
import { formatClock } from "@/utils/time"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Text, View } from "react-native"

type Props = {
  entry: TimelineEntry
}

type Line = {
  icon: ComponentProps<typeof Ionicons>["name"]
  iconColor: string
  iconClass: string
  title: string
  subtitle: string
  amount: string
  amountClass: string
  balance: string | null
}

const describe = (entry: TimelineEntry): Line => {
  switch (entry.kind) {
    case "reward":
      return {
        icon: "gift",
        iconColor: colors.amber,
        iconClass: "bg-amber-100",
        title: `Reward · ${entry.title}`,
        subtitle: formatClock(entry.date),
        amount: entry.pointsCost !== null ? `-${entry.pointsCost}` : "",
        amountClass: "text-red-600",
        balance: null,
      }
    case "purchase": {
      const isAdded = entry.change > 0
      return {
        icon: isAdded ? "cafe" : "arrow-undo",
        iconColor: isAdded ? colors.primary : colors.text,
        iconClass: isAdded ? "bg-primary-100" : "bg-gray-100",
        title: isAdded ? `Stamp added · ${entry.title}` : `Stamp removed · ${entry.title}`,
        subtitle: formatClock(entry.date),
        amount: isAdded ? "+1" : "-1",
        amountClass: isAdded ? "text-primary-700" : "text-gray-500",
        balance: null,
      }
    }
    case "points": {
      const isAdd = entry.operation === "add"
      return {
        icon: isAdd ? "add" : "remove",
        iconColor: isAdd ? colors.success : colors.danger,
        iconClass: isAdd ? "bg-green-100" : "bg-red-100",
        title: isAdd ? "Points added" : "Points removed",
        subtitle: `${formatClock(entry.date)}${entry.multiplier > 1 ? ` · x${entry.multiplier} promotion` : ""}`,
        amount: `${isAdd ? "+" : "-"}${entry.amount}`,
        amountClass: isAdd ? "text-green-700" : "text-red-600",
        balance: String(entry.balance),
      }
    }
  }
}

export const TimelineItem = ({ entry }: Props) => {
  const line = describe(entry)

  return (
    <View className="mb-2 flex-row items-center rounded-2xl border border-gray-200 bg-white p-3">
      <View className={`h-10 w-10 items-center justify-center rounded-xl ${line.iconClass}`}>
        <Ionicons name={line.icon} size={20} color={line.iconColor} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-900">{line.title}</Text>
        <Text className="text-xs text-gray-500">{line.subtitle}</Text>
      </View>
      <View className="items-end">
        <Text className={`font-extrabold ${line.amountClass}`}>{line.amount}</Text>
        {line.balance && <Text className="text-xs text-gray-400">{line.balance}</Text>}
      </View>
    </View>
  )
}
