import { PointsEditor } from "@/components/PointsEditor"
import { PromotionBadge } from "@/components/PromotionBadge"
import { SegmentedControl } from "@/components/SegmentedControl"
import { OperationType } from "@/types"
import { formatDate } from "@/utils/rewards"
import { initials } from "@/utils/text"
import { Text, View } from "react-native"

export type CustomerSection = "rewards" | "history"

type Props = {
  email: string
  memberSince: string
  visits: number
  points: number
  isUpdatingPoints: boolean
  multiplier: number
  onChangePoints: (amount: number, operationType: OperationType) => void
  section: CustomerSection
  onSectionChange: (section: CustomerSection) => void
}

export const CustomerHeader = ({
  email,
  memberSince,
  visits,
  points,
  isUpdatingPoints,
  multiplier,
  onChangePoints,
  section,
  onSectionChange,
}: Props) => (
  <View className="mb-3">
    <View className="rounded-2xl border border-gray-200 bg-white p-4">
      <View className="flex-row items-center">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-100">
          <Text className="font-extrabold text-primary-700">{initials(email)}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            {email}
          </Text>
          <Text className="text-xs text-gray-500">
            Customer since {formatDate(memberSince).split(",")[0]} · {visits} {visits === 1 ? "visit" : "visits"}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-bold uppercase tracking-wide text-gray-500">Points</Text>
          <Text className="text-5xl font-extrabold text-gray-900">{points}</Text>
        </View>
        {multiplier > 1 && <PromotionBadge multiplier={multiplier} />}
      </View>
    </View>
    <View className="mt-3">
      <PointsEditor isPending={isUpdatingPoints} multiplier={multiplier} onSubmit={onChangePoints} />
    </View>
    <View className="mt-4">
      <SegmentedControl
        options={[
          { value: "rewards", label: "Rewards" },
          { value: "history", label: "Activity" },
        ]}
        value={section}
        onChange={onSectionChange}
      />
    </View>
  </View>
)
