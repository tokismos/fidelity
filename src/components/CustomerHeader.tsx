import { PointsBalance } from "@/components/PointsBalance"
import { PointsEditor } from "@/components/PointsEditor"
import { SegmentedControl } from "@/components/SegmentedControl"
import { OperationType } from "@/types"
import { Text, View } from "react-native"

export type CustomerSection = "rewards" | "history"

type Props = {
  email: string
  points: number
  isUpdatingPoints: boolean
  onChangePoints: (amount: number, operationType: OperationType) => void
  section: CustomerSection
  onSectionChange: (section: CustomerSection) => void
}

export const CustomerHeader = ({
  email,
  points,
  isUpdatingPoints,
  onChangePoints,
  section,
  onSectionChange,
}: Props) => (
  <View className="mb-3">
    <Text className="mb-2 text-base font-medium text-gray-700" numberOfLines={1}>
      {email}
    </Text>
    <PointsBalance points={points} label="Points" />
    <View className="mt-3">
      <PointsEditor isPending={isUpdatingPoints} onSubmit={onChangePoints} />
    </View>
    <View className="mt-4">
      <SegmentedControl
        options={[
          { value: "rewards", label: "Rewards" },
          { value: "history", label: "History" },
        ]}
        value={section}
        onChange={onSectionChange}
      />
    </View>
  </View>
)
